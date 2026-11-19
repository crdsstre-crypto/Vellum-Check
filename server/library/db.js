// ตารางของคลังกฎหมาย (ขึ้นต้น lib_ ทั้งหมด · ไม่แตะตารางเดิมของ Vellum Check)
// เรียกครั้งเดียวหลังเซิร์ฟเวอร์เปิด ถ้าล้มเหลว คลังกฎหมายปิดตัวเอง แต่ระบบเดิมยังทำงานปกติ

export async function initLibraryDb(pool) {
  // ค้นหาชื่อแบบคำคล้าย (Render รองรับ pg_trgm) · ถ้าเปิดไม่ได้ก็ยังใช้ได้ แค่ค้นชื่อช้าลง
  let trgm = true;
  try { await pool.query('CREATE EXTENSION IF NOT EXISTS pg_trgm'); }
  catch (e) { trgm = false; console.warn('[library] pg_trgm ใช้ไม่ได้:', e.message); }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_sources (
      id           SERIAL PRIMARY KEY,
      code         TEXT UNIQUE NOT NULL,
      name         TEXT NOT NULL,
      homepage     TEXT,
      license      TEXT NOT NULL,
      license_note TEXT,
      collected_at DATE,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_laws (
      id                  SERIAL PRIMARY KEY,
      slug                TEXT UNIQUE NOT NULL,
      title               TEXT NOT NULL,
      title_norm          TEXT NOT NULL,
      doc_type            TEXT NOT NULL,
      law_number          TEXT,
      year_be             INTEGER,
      agency              TEXT,
      topics              TEXT[] NOT NULL DEFAULT '{}',
      status              TEXT NOT NULL DEFAULT 'unverified'
                          CHECK (status IN ('in_force','not_yet_in_force','repealed','unverified')),
      status_evidence_url TEXT,
      status_note         TEXT,
      status_verified_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
      status_verified_at  TIMESTAMPTZ,
      views_total         INTEGER NOT NULL DEFAULT 0,
      created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
      CHECK (status = 'unverified' OR status_evidence_url IS NOT NULL)
    )`);
  // กันกฎหมายซ้ำ: ประเภท + ชื่อที่ทำให้เป็นรูปแบบเดียว + ปี (ปีว่างนับเป็น 0)
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS lib_laws_identity ON lib_laws (doc_type, title_norm, COALESCE(year_be, 0))`);
  await pool.query(`CREATE INDEX IF NOT EXISTS lib_laws_created ON lib_laws (created_at DESC)`);
  if (trgm) await pool.query(`CREATE INDEX IF NOT EXISTS lib_laws_title_trgm ON lib_laws USING GIN (title_norm gin_trgm_ops)`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_versions (
      id                  SERIAL PRIMARY KEY,
      law_id              INTEGER NOT NULL REFERENCES lib_laws(id) ON DELETE CASCADE,
      label               TEXT,
      promulgated_on      DATE,
      effective_on        DATE,
      gazette_ref         TEXT,
      gazette_url         TEXT,
      source_id           INTEGER NOT NULL REFERENCES lib_sources(id),
      source_url          TEXT,
      source_ref          TEXT,
      content_hash        TEXT NOT NULL UNIQUE,
      preamble            TEXT NOT NULL DEFAULT '',
      footnotes           JSONB NOT NULL DEFAULT '{}',
      blocks              JSONB NOT NULL DEFAULT '[]',
      quality             JSONB NOT NULL DEFAULT '{}',
      is_current_verified BOOLEAN NOT NULL DEFAULT false,
      verified_by         INTEGER REFERENCES users(id) ON DELETE SET NULL,
      verified_at         TIMESTAMPTZ,
      imported_at         TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS lib_versions_law ON lib_versions (law_id, imported_at DESC)`);
  // ฉบับปัจจุบันที่ยืนยันแล้ว มีได้แค่ฉบับเดียวต่อกฎหมาย
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS lib_versions_one_current ON lib_versions (law_id) WHERE is_current_verified`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_sections (
      id            SERIAL PRIMARY KEY,
      version_id    INTEGER NOT NULL REFERENCES lib_versions(id) ON DELETE CASCADE,
      ord           INTEGER NOT NULL,
      kind          TEXT NOT NULL CHECK (kind IN ('heading','section')),
      block         INTEGER NOT NULL DEFAULT 0,
      is_main       BOOLEAN NOT NULL DEFAULT true,
      level         TEXT,
      number        TEXT,
      number_key    TEXT,
      heading       TEXT,
      body          TEXT NOT NULL DEFAULT '',
      notes         TEXT[] NOT NULL DEFAULT '{}',
      search_tokens TSVECTOR,
      UNIQUE (version_id, ord)
    )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS lib_sections_key ON lib_sections (version_id, number_key)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS lib_sections_fts ON lib_sections USING GIN (search_tokens)`);

  // เหตุการณ์ในเส้นเวลา (ประกาศ / แก้ไขเพิ่มเติม / ยกเลิก) — มาจากเชิงอรรถต้นฉบับหรือแอดมินเพิ่ม
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_events (
      id          SERIAL PRIMARY KEY,
      law_id      INTEGER NOT NULL REFERENCES lib_laws(id) ON DELETE CASCADE,
      version_id  INTEGER REFERENCES lib_versions(id) ON DELETE CASCADE,
      kind        TEXT NOT NULL CHECK (kind IN ('promulgated','amended','repealed','effective','other')),
      title       TEXT NOT NULL,
      event_date  DATE,
      gazette_ref TEXT,
      evidence    TEXT,
      verified    BOOLEAN NOT NULL DEFAULT false,
      UNIQUE (law_id, kind, title)
    )`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_relations (
      id           SERIAL PRIMARY KEY,
      from_law     INTEGER NOT NULL REFERENCES lib_laws(id) ON DELETE CASCADE,
      to_law       INTEGER NOT NULL REFERENCES lib_laws(id) ON DELETE CASCADE,
      kind         TEXT NOT NULL CHECK (kind IN ('amends','repeals','references','issued_under')),
      effective_on DATE,
      evidence_url TEXT,
      verified     BOOLEAN NOT NULL DEFAULT false,
      UNIQUE (from_law, to_law, kind)
    )`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_import_jobs (
      id          SERIAL PRIMARY KEY,
      source_code TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','running','done','failed')),
      total       INTEGER NOT NULL DEFAULT 0,
      done        INTEGER NOT NULL DEFAULT 0,
      added       INTEGER NOT NULL DEFAULT 0,
      new_version INTEGER NOT NULL DEFAULT 0,
      duplicates  INTEGER NOT NULL DEFAULT 0,
      flagged     INTEGER NOT NULL DEFAULT 0,
      log         JSONB NOT NULL DEFAULT '[]',
      started_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
      finished_at TIMESTAMPTZ
    )`);

  // ----- ข้อมูลของผู้ใช้ (ลบตามบัญชีอัตโนมัติ) — เปิดใช้ใน Phase 3–5 -----
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_bookmarks (
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      law_id     INTEGER NOT NULL REFERENCES lib_laws(id) ON DELETE CASCADE,
      folder     TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, law_id)
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_follows (
      user_id           INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      law_id            INTEGER NOT NULL REFERENCES lib_laws(id) ON DELETE CASCADE,
      last_seen_version INTEGER,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, law_id)
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_highlights (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      section_id INTEGER NOT NULL REFERENCES lib_sections(id) ON DELETE CASCADE,
      start_off  INTEGER NOT NULL CHECK (start_off >= 0),
      end_off    INTEGER NOT NULL CHECK (end_off > start_off),
      quote      TEXT NOT NULL CHECK (length(quote) <= 2000),
      color      TEXT NOT NULL CHECK (color IN ('yellow','green','blue','pink','orange')),
      note       TEXT CHECK (length(note) <= 2000),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS lib_highlights_user ON lib_highlights (user_id, section_id)`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_notes (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      law_id     INTEGER NOT NULL REFERENCES lib_laws(id) ON DELETE CASCADE,
      section_id INTEGER REFERENCES lib_sections(id) ON DELETE SET NULL,
      body       TEXT NOT NULL CHECK (length(body) BETWEEN 1 AND 5000),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS lib_notes_user ON lib_notes (user_id, law_id)`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_reading (
      user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      law_id       INTEGER NOT NULL REFERENCES lib_laws(id) ON DELETE CASCADE,
      last_section INTEGER,
      progress     REAL,
      read_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, law_id)
    )`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_searches (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      q          TEXT NOT NULL CHECK (length(q) <= 200),
      filters    JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`);
  await pool.query(`CREATE INDEX IF NOT EXISTS lib_searches_user ON lib_searches (user_id, created_at DESC)`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS lib_entitlements (
      user_id     INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      plan        TEXT NOT NULL DEFAULT 'free',
      valid_until TIMESTAMPTZ
    )`);

  return { trgm };
}
