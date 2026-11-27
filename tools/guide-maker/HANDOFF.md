# ส่งต่องานคู่มือ Vellum Check (อ่านไฟล์นี้ก่อนเริ่มงาน)

ไฟล์นี้เขียนไว้ให้ Claude ในแชตใหม่ อ่านแล้วทำงานต่อได้ทันที โดยผู้ใช้ไม่ต้องอธิบายซ้ำ


## 0. อ่านก่อน: สิ่งที่ผู้ใช้สั่งล่าสุด (27 พ.ย. 2569) และวิธีทำงานที่ใช้จริงในเรื่อง 147–191

### คำสั่งล่าสุดของผู้ใช้ (ถอดความ)
> "สิ่งที่ผมจะให้ทำคือ**ทำตามหมวดหมู่** และทำให้**สวยขึ้น พัฒนาเรื่อยๆ ไม่ซ้ำซากจำเจ** **เปลี่ยนท่าทางน้องม้วนเยอะๆ** และ**เนื้อหาด้านในพัฒนามากขึ้นเรื่อยๆ โดยที่ผมไม่ต้องสั่ง** และสวยขึ้นอีก ไม่จำเจ"

แปลเป็นงาน:
- ผู้ใช้พิมพ์แค่ **"ทำอีก5เรื่อง"** → ทำ 5 เรื่องในหมวดปัจจุบัน (ตอนนี้ **ค้าขายและแบรนด์ ถึงเรื่องที่ 231 แล้ว เรื่องถัดไป 232**) commit + push เอง ไม่ต้องถาม
- **ทุกชุดต้องดีกว่าชุดก่อนอย่างน้อย 2 อย่าง** โดยไม่ต้องรอผู้ใช้สั่ง (ภาพ ฉาก ท่าน้องม้วน ความลึกของเนื้อหา) และบอกผู้ใช้สั้นๆ ว่าชุดนี้พัฒนาอะไร
- ผู้ใช้ **ขอให้ใช้เครดิตน้อยที่สุด**: อ่านไฟล์เฉพาะที่จำเป็น ตอบสั้น ทำ 5 เรื่องรวดเดียว ดูภาพรวม 5 เรื่องในรูปเดียว ไม่ต้องส่ง zip
- ผู้ใช้ใช้ **iPhone** ตอบภาษาไทยสั้นๆ ทุกครั้งต้องปิดท้ายว่า **"ยังไม่ได้ลองบน iPhone จริงครับ"**

### รูปแบบคำตอบหลังทำเสร็จแต่ละชุด
1. ตารางเรื่อง (ลำดับ | เรื่องสั้นๆ ภาษาคนทั่วไป | มาตรา)
2. "ส่วนที่ไม่ได้มาจากตัวบท" (ตัวอย่างแต่งเอง, ข้อที่ตีความ, ตัวบทที่ถูกตัดในฐานข้อมูล)
3. ส่งรูปปก/การ์ดให้ดู (SendUserFile) และบอกเลขเรื่องถัดไป
4. "ยังไม่ได้ลองบน iPhone จริงครับ"

### ⚠️ มาตรฐานปกใหม่ (แก้ 40 ปก 192–231 · 27 พ.ย. 69 ตามที่ผู้ใช้สั่ง)
- **ไม่ใส่ป้าย tag เล็กบนภาพปกแล้ว** (ตัวเล็กอ่านไม่ออก/ถูกตัด) → ใช้ `fast/examples/runall.py` ที่ตั้ง `tag=None`, ลบ `<text>` ที่ font-size < 6.5, ขยายตัวอักษรที่เหลือ 15%, เติมวงแสงพื้นหลัง (halo)
- ข้อความในภาพปกต้อง **font-size ≥ 7** และ hero ทั้งก้อนย่อ scale 0.62 ที่ translate(89 72) (หน้ารายการบนมือถือเห็นแค่ x≈58–122 ของภาพ) — ตรวจด้วย /tmp/listshot.py ทุกครั้ง
- **coverLines ต้องไม่ล้นบนมือถือ**: รัน `python3 tools/guide-maker/fast/covertitle_check.py 390` (และ 430) ต้องได้ `0 bad` — ปกติบรรทัดละไม่เกิน ~13 ตัวอักษรหลัก

### สิ่งที่ชุด 227–231 พัฒนาเพิ่ม
- หัวข้อขยายไปความรับผิดต่อคนนอก/เพื่อนบ้าน (สัตว์ในร้าน ม.433, ของอันตราย ม.437, รากไม้ ม.1347, ผู้รับจ้างช่วง ม.607, ลูกหนี้ร่วม ม.290–296)
- ทุกเรื่องมี "ทำอะไรทันทีหลังเกิดเหตุ" + บันทึกตกลงชดใช้ที่มีประโยค "ชำระครบไม่เรียกร้องอีก"
- ท่าที่ใช้: chin+sleepy+coin+breathe, open+relief+phone+spin, wave+cry+pen+shake, scratch+wink+umbrella+bob, cheer+shock+none+breathe, cross+laugh+clip+peek, thumb+smile+umbrella+shake, point+firm+cup+spin, up+think+money+hop, bow+star+cal+sway, cross+hmm+coin+lean, open+cry+sign+peek, palm+sad+clip+bob, cover+shock+phone+lean, cheer+firm+coin+hop, up+hmm+sign+sway, wave+wink+phone+spin, scratch+sleepy+cup+bob, chin+relief+pen+breathe, point+star+umbrella+shake
- ปกชุดนี้: `fast/examples/b17.py`

### สิ่งที่ชุด 222–226 พัฒนาเพิ่ม
- เนื้อหา: แยก "บั๊ก vs งานเพิ่ม", "ข่าวลือ vs ล้มละลายจริง", "ถูกฟ้อง ≠ ล้มละลาย" — ช่วยผู้ใช้ไม่ด่วนตัดสินใจผิด + ตัวอย่างนับวัน 6 สัปดาห์/1 เดือน
- ⚠️ ชื่อการ์ดต้องไม่ซ้ำทั้ง repo (เช่น cardguesthouse มีแล้ว) — lint/apply2 จะฟ้อง ให้เปลี่ยนชื่อใน mk + stub ใหม่
- ท่าที่ใช้: wave+relief+phone+sway, thumb+firm+shield+hop, point+sad+sign+bob, cheer+wink+umbrella+lean, open+sleepy+umbrella+breathe, scratch+relief+coin+bob, chin+cry+shield+spin, up+firm+none+shake, cover+smile+none+peek, cross+star+phone+shake, scratch+laugh+cup+breathe, cheer+shock+sign+spin, bow+think+pen+lean, palm+cry+money+peek, thumb+hmm+mag+hop, up+star+cup+sway, wave+wink+none+hop, point+relief+phone+bob, cover+sad+sign+sway, palm+firm+umbrella+lean
- ปกชุดนี้: `fast/examples/b16.py`

### สิ่งที่ชุด 217–221 พัฒนาเพิ่ม
- เนื้อหา: ทุกเรื่องมี "ทางออกเชิงปฏิบัติ" (แผนจ่าย/ใบแจ้งยอด/หนังสือคืนเงินประกัน/ใบเสนอราคาใหม่) + ตัวอย่างนับวันตามมาตรา (15 วัน, 7 วัน, 30/45 วัน)
- ตรวจตัวบทจากไฟล์เต็ม `/home/claude/out/*.txt` ด้วย `grep -n -A8 "^มาตรา ๑๐๕๕ "` เมื่อ sec2.py ตัดข้อความยาว
- ท่าที่ใช้: chin+sad+clip+lean, bow+relief+cup+peek, palm+star+sign+hop, up+wink+umbrella+sway, cheer+laugh+phone+lean, wave+firm+mag+bob, thumb+shock+umbrella+sway, cross+relief+coin+hop, open+think+coin+breathe, up+hmm+cal+bob, cheer+cry+phone+shake, thumb+sleepy+umbrella+spin, scratch+smile+shield+breathe, point+cry+money+shake, cover+star+sign+peek, cross+laugh+pen+spin, chin+laugh+none+sway, palm+wink+phone+hop, bow+shock+clip+lean, up+think+cal+peek
- ปกชุดนี้: `fast/examples/b15.py`

### สิ่งที่ชุด 212–216 พัฒนาเพิ่ม
- ภาพ: เพิ่ม `CHART(x,y,w,h,vals,c,lab)` กราฟเส้นในฉาก ใน `fast/fgk.py`
- เนื้อหา: ตัวอย่างคำนวณเป็นขั้น (ลำดับชำระบัญชี, เรทแลกเงิน, เพดานหักค่าจ้าง) + ข้อความเจรจากับอีกฝ่าย
- เรื่องเศร้า (หุ้นส่วนเสียชีวิต) ใช้ภาพโทนอุ่น นุ่มนวล ไม่มีภาพความตาย
- ท่าที่ใช้: wave+wink+cal+breathe, open+laugh+money+spin, cheer+sleepy+clip+peek, cover+cry+phone+shake, chin+relief+umbrella+lean, palm+sad+coin+sway, bow+think+clip+hop, up+firm+mag+peek, thumb+shock+mag+lean, scratch+laugh+phone+bob, cheer+firm+clip+sway, wave+hmm+umbrella+hop, point+star+sign+spin, cross+smile+pen+bob, open+think+mag+shake, up+hmm+phone+breathe, cover+wink+coin+spin, scratch+cry+cal+breathe, point+sleepy+none+shake, palm+smile+umbrella+peek
- ปกชุดนี้: `fast/examples/b14.py`

### สิ่งที่ชุด 207–211 พัฒนาเพิ่ม
- ภาพ: เพิ่ม `FLOOR()` (เส้นพื้นมีระยะ) และ `DOC(x,y,w,h,title,rows,head,sig)` (เอกสารในฉากสำเร็จรูป) ใน `fast/fgk.py`
- ⚠️ layout `left`: กรอบคำพูดอยู่ขวาบน (x≳225, y≲90) → วางเอกสารที่ x 56–200 · layout `right`: กรอบอยู่ซ้ายบน
- แก้ `mkc.py` ให้หาชื่อการ์ดเดิมใน template อัตโนมัติ (เดิมชนชื่อซ้ำเมื่อ c206gen.py ถูกเขียนทับ)
- เนื้อหา: ตัวอย่างหนังสือ/บันทึกที่ใส่เลขเครื่อง ยอด วันที่ครบ ลอกไปใช้ได้ทันที
- ท่าที่ใช้: chin+laugh+cup+shake, up+star+phone+breathe, point+hmm+cal+bob, open+cry+sign+spin, palm+laugh+umbrella+peek, wave+star+pen+spin, scratch+relief+phone+shake, thumb+wink+coin+breathe, cover+smile+money+lean, cheer+hmm+mag+hop, chin+cry+coin+peek, palm+relief+cup+sway, cross+sad+shield+sway, bow+sleepy+umbrella+hop, thumb+shock+sign+lean, scratch+firm+coin+bob, open+think+none+spin, up+hmm+clip+bob, point+smile+cal+shake, cross+star+pen+breathe
- ปกชุดนี้: `fast/examples/b13.py`

### สิ่งที่ชุด 202–206 พัฒนาเพิ่ม
- เนื้อหา: แต่ละเรื่องมีคำถาม **"ถ้าเราเป็นอีกฝ่าย"** (เช่น ฝ่ายขาย/ฝ่ายซื้อตึก) + ตัวอย่างนับวันจริง + ข้อความตัวอย่าง
- ภาพ: เพิ่ม `BEAM()` (ลำแสงเฉียง) และ `TX()` (ข้อความในฉาก) ใน `fast/fgk.py`
- ⚠️ พื้นที่ที่มองเห็นในแผงเริ่มประมาณ **y≈62** · กรอบคำพูดบน/คำบรรยายกลางบังถึง **y≈88** → layout `center` ให้วางเอกสารสำคัญ**ซ้าย (x 12–100, y 66–140)** ไม่ใช่กลาง
- ท่าที่ใช้: bow+sleepy+mag+lean, palm+hmm+pen+bob, point+star+cal+sway, open+wink+cup+hop, up+think+phone+breathe, wave+cry+clip+bob, chin+wink+cup+shake, point+hmm+none+spin, cheer+shock+cup+peek, thumb+laugh+none+spin, wave+firm+shield+shake, palm+smile+clip+breathe, cross+sad+pen+sway, cover+relief+clip+lean, scratch+smile+phone+peek, cheer+star+coin+hop, bow+laugh+umbrella+sway, open+shock+shield+lean, thumb+sad+cup+hop, cross+think+mag+bob
- ปกชุดนี้: `fast/examples/b12.py`

### สิ่งที่ชุด 197–201 พัฒนาเพิ่ม
- เนื้อหา: **ตัวอย่างนับวันจริง** (เช่น ยกเลิกก่อน 14/7/3 วัน คิดเงินคืนเท่าไร) + ตัวอย่างข้อความ/ใบเสนอราคาที่ลอกไปใช้ได้
- ภาพ: เพิ่ม `DUST(n,seed,c,op)` ใน `fast/fgk.py` = ฝุ่นแสงลอย ใช้คู่กับ `FG()` ให้ฉากมีมิติ
- ป้าย/ข้อความในฉากต้อง**ไม่อยู่ใต้กรอบคำพูดด้านบน** (ตรวจครอปทุกตอน)
- ท่าที่ใช้: up+smile+shield+sway, scratch+wink+umbrella+lean, thumb+star+none+peek, chin+sad+cup+hop, palm+hmm+phone+lean, bow+shock+cal+sway, point+relief+umbrella+bob, open+sleepy+cup+hop, wave+firm+mag+shake, up+think+clip+breathe, cheer+cry+sign+spin, chin+wink+cal+bob, cover+laugh+mag+peek, cross+hmm+clip+shake, wave+laugh+clip+shake, thumb+sad+sign+spin, scratch+star+money+hop, thumb+smile+umbrella+lean, cross+relief+none+peek, cover+sad+cal+sway
- ปกชุดนี้: `fast/examples/b11.py`

### สิ่งที่ชุด 192–196 พัฒนาเพิ่ม (ชุดต่อไปต้องคงไว้และเพิ่มอีก)
- เนื้อหา: **ส่วนละ 3 คำถาม** (เดิม 2) + **ตัวอย่างข้อความที่ส่งได้จริง** (ทวงเงิน แจ้งลูกค้า แจ้งซ่อม) + **เช็กลิสต์** ในส่วนสุดท้าย
- ภาพ: 3 ช่อง**เล่าเหตุการณ์ต่อเนื่อง** (เกิดเรื่อง → จัดการ → ป้องกัน) และเพิ่ม**ชั้นหน้าเบลอ** `FG()` จาก `fast/fgk.py` (ใบไม้/เงามุมล่าง ฝั่งตรงข้ามน้องม้วน) ให้ฉากมีมิติหน้า-กลาง-หลัง
- `SIGN()` ใน fgk.py ทำป้ายข้อความสั้นในฉาก · คนที่อยู่หลังเคาน์เตอร์: วางเคาน์เตอร์ **หลัง** person ใน parts และสูงไม่เกิน y≈142 ไม่งั้นบังหน้า
- lint ล่าสุด: คำพูดในช่อง (say) ยาวเกิน ~26 ตัวจะไม่ผ่าน ให้เขียนสั้นแบบ "**คำหลัก** = **ผล**"
- `setup_fast.sh` ใช้ rsync ซึ่งบางเครื่องไม่มี ถ้าล้ม ให้ `cp -a /home/claude/vellum-check /home/claude/src/Vellum-Check-main && rm -rf /home/claude/src/Vellum-Check-main/.git`
- ATTRIB ต้อง export ใหม่ทุกครั้งที่เรียก shell (เก็บไว้ในไฟล์แล้ว `. attrib.sh`)

### ⚠️ ประหยัดเวลา build ของ Render (สำคัญ · 27 พ.ย. 2569)
- Render แผนฟรีให้ build **500 นาที/เดือน** ทุก push = 1 build (~40 วินาที) เดือน พ.ย. 2569 หมดโควตาเพราะ push ทีละเรื่องหลายสิบครั้ง ผู้ใช้เลยต้องซื้อเพิ่ม
- **กติกาใหม่:** commit ย่อยทุกอันต้องมี **`[skip render]`** ในข้อความ (publish.sh ใส่ให้แล้ว) และ **build แค่ครั้งเดียวต่อชุด 5 เรื่อง** = commit สุดท้าย (ปก/การ์ด) ไม่ใส่ `[skip render]`
- commit ที่แก้แค่ tools/ HANDOFF.md PROJECT_NOTES.md ให้ใส่ `[skip render]` เสมอ

### ปกและการ์ด: สไตล์ "พาสเทลมีมิติ" (ผู้ใช้ชมว่าสวย ห้ามถอยกลับ)
- ใช้ `pastel/gen.py` เหมือนเดิม แต่ **เติมชั้นกระดาษซ้อนด้านหลัง 2 แผ่น + เส้นไฮไลต์** ด้วย `fast/examples/enrich.py` (ดูวิธีรวมใน `fast/examples/run9.py` และตัวอย่าง hero ใน `fast/examples/b9.py`)
- ภาพหลักชิ้นใหญ่ชิ้นเดียว + **ของประกอบชิ้นเล็ก 1 ชิ้นที่เล่าเรื่อง** (ตรายาง ค้อน ลูกศร คลิป แว่นขยาย) แบบเรื่อง 147–151
- **หน้ารายการบนมือถือเห็นแค่ซีกซ้ายของการ์ด**: ของสำคัญต้องอยู่ช่วง x 54–118 (ก่อน translate) ถ้าภาพกว้าง ให้ห่อ `<g transform="translate(92 86) scale(.8) translate(-92 -86)">`
- ป้าย tag บรรทัดแรก **ไม่เกิน ~12 ตัวอักษร** ไม่งั้นถูกตัด
- badge ห้ามใช้ emoji (ใช้ตัวอักษร/ตัวเลข/สัญลักษณ์ เช่น ✓ ⌂ ↗ ¾)
- ตรวจด้วย `/tmp/listshot.py` (แก้รายชื่อ slug บรรทัด 12) ว่าการ์ดในหน้ารายการมือถือไม่โดนตัด

### น้องม้วน: เปลี่ยนท่าให้หลากหลายจริงๆ
- mood = `แขน+หน้า+ของในมือ+การขยับ` ห้ามซ้ำในชุดเดียวกัน (ปก 1 + ฉาก 3 × 5 เรื่อง = 20 ท่า)
- **ห้ามใช้**: `point+smile+clip+bob`, `cross+firm+…`, `scratch+hmm…`, `scratch+shock…`
- ชุดล่าสุด (192–196) ใช้ไปแล้ว (เลือกด้วย `moodpick.py` แล้วแก้ท่าต้องห้ามเอง): point+relief+cup+breathe, palm+sleepy+cal+shake, cheer+sad+mag+peek, cover+cry+none+spin, up+shock+sign+lean, cross+wink+phone+sway, wave+hmm+coin+hop, thumb+laugh+shield+peek, open+cry+none+sway, chin+hmm+cal+bob, up+shock+shield+lean, palm+relief+clip+hop, bow+firm+shield+shake, wave+star+sign+breathe, thumb+smile+cal+spin, open+think+cup+bob, cheer+sleepy+coin+shake, point+sad+clip+breathe, cover+cry+money+spin, cross+laugh+sign+peek → **ชุดถัดไปให้จับคู่ใหม่**
- 💡 พัฒนาต่อได้: เพิ่มท่าใหม่ใน `public/mascot.js` (ราวบรรทัด 150–180) เช่น ถือป้ายสองมือ กระโดดดีใจ นั่ง ชี้กระดาน

### ภาพการ์ตูน 3 ช่อง (ทำใน `/home/claude/work/gN.py` ด้วย helper ใน `fast/pk.py`)
- ทุกช่องต่างกันทั้ง **เวลา สถานที่ โทนสี แหล่งแสง และสัตว์/ต้นไม้ 1 อย่าง** และเขียนคอมเมนต์ `# ตอน N ...` บอกโทนสี/แสง/สิ่งมีชีวิต
- ตัวละครสลับ หญิง/ชาย และมี **ชายใส่แว่น** 1 ช่องต่อเรื่อง วางตำแหน่ง: left → คน x≈318, right → คน x≈60, center → คน x≈292
- ห้ามวางของสำคัญใต้กรอบคำพูดมุมบน (ตรวจรูปรวมทุกครั้ง แล้วย้ายของที่โดนบัง)
- 💡 ยกระดับต่อ: ฉากหลังมีชั้นหน้า-กลาง-หลัง, ใช้ `FL()/CT()/SH()` ของชุด art/ ให้พื้นสมจริง, ให้ 3 ช่องเล่าเรื่องต่อเนื่องเป็นเหตุการณ์เดียว

### เนื้อหา: ลึกขึ้นทุกชุด
- อ้างมาตราจากตัวบทจริงเท่านั้น (`fast/sec2.py`: `W=500 python3 sec2.py "ชื่อกฎหมาย" 15 16 "199 ตรี"`) ถ้าตัวบทถูกตัดท้ายในฐานข้อมูล ต้องบอกในคำตอบ
- ทุกคำตอบต้องมี **ตัวหนา** (lint บังคับ) และข้อที่ไม่ได้มาจากตัวบทตรงๆ ต้องกำกับ "(เป็นการตีความของผม)" หรือ "(เป็นคำแนะนำของผม)"
- อ้างข้ามไปคู่มือเดิมด้วยชื่อจริง (`T('slug')` ใน hdr.py) อย่างน้อย 2 ครั้งต่อเรื่อง
- 💡 ยกระดับต่อ: เพิ่มตัวอย่างข้อความที่ใช้ส่งได้จริง (หนังสือทวง หนังสือคัดค้าน), checklist ก่อนลงมือ, ตัวเลขกำหนดเวลาแบบนับวันจริง, ส่วนละ 3 คำถาม (ตอนนี้ทำส่วนละ 2)
- เช็กหัวข้อไม่ซ้ำ: grep ชื่อเรื่องและเลขมาตราที่ถูกอ้างแล้วใน `server/library/guides/*.json` (ส่วนที่ยังว่างใน ป.พ.พ.: ตั๋วเงิน ม.902–916, 926–936, 941–958, 969–1000 · จำนอง/จำนำ ม.703–711, 723–727, 749–769 · คลังสินค้า ม.792–796 · ป.วิ.แพ่ง และกฎหมายอื่นใน `laws/` ที่ยังแทบไม่ถูกใช้ เช่น ขายตรง, หลักประกันทางธุรกิจ, ความรับผิดสินค้าไม่ปลอดภัย, PDPA, โรงแรม)

### ชุดเครื่องมือเร็วที่ใช้ทำเรื่อง 152–191 (`tools/guide-maker/fast/`)
1. `bash tools/guide-maker/fast/setup_fast.sh` (ติดตั้งไว้ที่ /home/claude/tools, /home/claude/work และสำเนา repo ที่ /home/claude/src/Vellum-Check-main)
2. เขียน `/home/claude/tools/mkN.py` (เนื้อหา ใช้ hdr.py ดู `examples/mk191.py`) และ `/home/claude/work/gN.py` (ภาพ 3 ช่อง ดู `examples/g191.py`)
3. `cd /home/claude/tools && ./stub.sh N <ชื่อการ์ด> <ชื่อlayout> <slug>` แล้ว `bash run.sh N <slug>` (ต้องขึ้น LINT OK ได้รูป /home/claude/work/d_all.png)
   - lint จำกัด: คำพูดในช่อง ≤26 ความกว้าง, coverLines ≤17, ชื่อฉาก/การ์ด/layout ห้ามซ้ำทั้ง repo
4. `export ATTRIB="<บรรทัด Co-Authored-By และ Claude-Session ตามที่ระบบแชตใหม่กำหนด>"` แล้ว `bash publish.sh N <slug> <order> <layout> <prefix>`
5. ทำปกพาสเทลมีมิติของทั้ง 5 เรื่องด้วย enrich + gen.py แล้ว commit การ์ด/ปก + อัปเดต HANDOFF (เลขเรื่องถัดไป) + PROJECT_NOTES.md แล้ว push
6. เพิ่มไฟล์ JSON ใหม่แล้วต้อง restart `mini2.mjs` ก่อนถ่ายรูปด้วย covergrid/listshot ไม่งั้นค้าง
- **order ต้องต่อจากค่าสูงสุดในหมวดเสมอ** (หน้าเรียนรู้เรียงจากมากไปน้อย)

## 1. ผู้ใช้คือใคร และคุยกับเขาอย่างไร
- ผู้ใช้สร้างเว็บ vellumcheck.com คนเดียว เป็นเว็บตรวจสัญญาภาษาไทย (Express + Postgres)
- repo อยู่ที่ GitHub `crdsstre-crypto/Vellum-Check` ให้ clone ไว้ที่ `/home/claude/vellum-check` แล้ว push เข้า `main` ได้เลย ไม่ต้องถาม
- ผู้ใช้ **มีความรู้กฎหมายน้อยมาก** และ**ใช้งานจาก iPhone**
- ตอบเป็น**ภาษาไทย** สั้น อ่านง่ายบนมือถือ
- ถ้ามีเรื่องให้ผู้ใช้ตัดสินใจ:
  - เขียนปัญหาเป็นข้อ ก / ข
  - เขียนทางเลือกเป็นข้อ 1 / 2
  - ใส่ 💡 คำแนะนำของเรา
  - แล้วรอผู้ใช้เลือก
- **บอกตรงๆ ทุกครั้ง** ว่าดูจากภาพจำลองหน้าจอ ยังไม่ได้ลองบน iPhone จริง
- อย่าแก้สิ่งที่ผู้ใช้ไม่ได้สั่ง ยกเว้นงานพัฒนาคุณภาพตามข้อ 4
- ส่งรูปตัวอย่างผลงานให้ผู้ใช้ดูทุกครั้ง โดยรวมปกกับภาพการ์ตูนไว้ในรูปเดียว

## 2. กฎที่ห้ามละเมิด
- **ลิขสิทธิ์** ผู้ใช้สั่งไว้ว่า "ไม่เอาลิงก์ที่เขาไม่อนุญาตมาใส่น่ะครับและผิดลิขสิทธิ์เขาน่ะ"
  - อ้างกฎหมายจาก**ตัวบทของกฤษฎีกาเท่านั้น**
  - ห้ามใส่ลิงก์เว็บอื่น
- **ตรวจเลขมาตราทุกข้อกับตัวบทจริง** ด้วย `python3 /tmp/sec.py <ไฟล์กฎหมาย> <เลขมาตรา>` และ `node /tmp/chk15.mjs <guide>.json`
  - ไฟล์กฎหมายอยู่ที่ `tools/guide-maker/laws/`
  - ในไฟล์ใช้เลขไทย ดูส่วนของ sec.py
- กฎหมายที่ไม่มีในคลัง ให้ใส่เป็นป้ายสีเทาแทนการอ้างมาตรา: `L("ชื่อกฎหมาย")` ซึ่งได้ผลเป็น `{"label":...,"note":"ยังไม่มีในคลัง"}`
  - เช่น พ.ร.บ.คอมพิวเตอร์, PDPA, ประมวลรัษฎากร, ป.วิ.อาญา, พ.ร.บ.จราจร
- ถ้ากฎหมายไม่ได้เขียนไว้ตรงๆ ให้เขียนกำกับว่า **"(เป็นการตีความของผม)"**
- คู่มือทุกเรื่องต้องเป็น `reviewed:false` คือต้องให้ทนายตรวจก่อน
- **ห้าม commit ความลับ** เช่น .env, DATABASE_URL, API key
- ห้ามแตะไฟล์ของเพื่อนผู้ใช้ที่วางอยู่ในโฟลเดอร์บนสุดของ repo
- ข้อความ commit ต้องลงท้ายด้วยสองบรรทัดนี้:
  ```
  Co-Authored-By: Claude <noreply@anthropic.com>
  Claude-Session: <ลิงก์ session ปัจจุบัน>
  ```
  ถ้าระบบกำหนดข้อความต่อท้ายมาให้ ใช้ตามที่ระบบกำหนด
- ทุกครั้งที่ทำงานเสร็จหนึ่งชุด ให้เพิ่ม 1 บรรทัดใน `PROJECT_NOTES.md`

## 3. คำสั่งประจำของผู้ใช้
- **"ทำอีก5เรื่อง"** = ทำคู่มือใหม่ 5 เรื่อง แล้ว commit และ push
- ผู้ใช้อยากให้ทำ **ตามหมวดหมู่**
  - ตอนนี้หมวด **ค้าขายและแบรนด์** มีถึงเรื่องที่ 196 แล้ว
  - หมวดที่ยังบางมาก:
    - **สัญญาทั่วไป** (1 เรื่อง)
    - **ภัยออนไลน์** (1 เรื่อง)
    - **ที่อยู่อาศัย** (27 เรื่อง)
  - ผู้ใช้เคยบอกว่าอยากให้**แต่ละหมวดครบประมาณ 1,000 เรื่องขึ้นไปก่อน แล้วค่อยขยับไปหมวดถัดไป**
  - ถ้าผู้ใช้ไม่ได้ระบุหมวด ให้**ทำหมวดค้าขายและแบรนด์ต่อ** (เรื่องถัดไปคือเรื่องที่ 232) และแตกหัวข้อย่อยให้หลากหลาย เช่น ร้านอาหาร ร้านออนไลน์ ร้านเสริมสวย ร้านซ่อม โรงงานเล็ก แบรนด์ เครื่องหมายการค้า และนำเข้า-ส่งออก
  - ถ้าผู้ใช้ระบุหมวด ให้ทำตามนั้น
  - ดูจำนวนเรื่องในแต่ละหมวดได้ด้วยคำสั่งนี้ (นับจาก category ในไฟล์ `server/library/guides/*.json`):
    ```
    python3 -c "import json,glob,collections;print(collections.Counter(json.load(open(f))['category'] for f in glob.glob('server/library/guides/*.json')))"
    ```
  - หมวดใหม่ ต้องดู categoryIcon และ categoryNote จากคู่มือเดิมในหมวดนั้นมาใช้ให้ตรงกัน
- **ก่อนเลือกหัวข้อ ต้องเช็กว่าไม่ซ้ำเรื่องที่มีแล้ว** ด้วยการ grep ทั้งชื่อเรื่องและเนื้อหาของคู่มือทั้งหมด

## 4. ผู้ใช้ต้องการให้ "พัฒนาเองเรื่อยๆ โดยไม่ต้องสั่ง" (สำคัญที่สุด)
ผู้ใช้เคยบ่นว่า "คุณภาพแย่ลงเรื่อยๆ" และว่า "พื้นดูไม่สมจริง" ทุกชุดใหม่จึง**ต้องดีกว่าชุดก่อน**อย่างน้อย 1 อย่าง และ**ห้ามซ้ำซากจำเจ**

### ภาพการ์ตูนในเรื่อง (3 ช่องต่อเรื่อง)
- **ใช้สไตล์ภาพใหม่ทุกช่อง** และเขียนชื่อสไตล์ไว้ในคอมเมนต์ `// [ภาพ...]`
- สไตล์ที่ใช้ไปแล้ว:
  - ภาพสีน้ำ, ภาพพิมพ์ริโซ, ไอโซเมตริก, ป๊อปอาร์ต, พิมพ์เขียว, ภาพตัดปะ
  - กระดานชอล์ก, ภาพฟิล์มนัวร์, ดูเดิลบนสมุด, พิกเซลอาร์ต, นีออน, โปสเตอร์สวิส
  - ภาพกวอช, ใบเสร็จตัวพิมพ์, บอร์ดไม้ก๊อก, ภาพวินเทจ, ภาพยุค 70, ดินปั้น
  - อาร์ตเดโค, ลายเมมฟิส, ผนังรูปโพลารอยด์, ภาพจอกล้องวงจรปิด, อินโฟกราฟิก
  - ภาพพิมพ์ลิโนคัต, ภาพถนนยามเย็น, ภาพอุกิโยะเอะ, เครื่องเขียน, กระดาษกราฟ
  - ภาพมังงะ, ครัว, ซินธ์เวฟ, ห้องเซิร์ฟเวอร์, ภาพสแกนดิเนเวียน, ตลาดกลางคืน, เกมตู้
- **พื้นต้องสมจริง:**
  - ใช้ `FL()` ทำพื้นที่มีเส้นเล็กลงตามระยะไกลใกล้
  - ใช้ `CT()` ทำเคาน์เตอร์หรือโต๊ะที่มีด้านบนและด้านหน้า
  - ใช้ `SH()` ทำเงา
  - helper ทั้งสามอยู่ใน `art/fl.js` และถูกใส่ให้อัตโนมัติตอน build
- **ตัวละครต้องไม่ลอย:**
  - ให้ยืนหลังเคาน์เตอร์หรือโต๊ะ
  - หรือให้ตัวยาวเลยขอบล่าง คือค่า `y + 66*s ≥ 180`
- เลย์เอาต์ช่อง (viewBox 360×180):
  - `left` = น้องม้วนอยู่ซ้าย ภาพอยู่ช่วง x 90–350
  - `right` = น้องม้วนอยู่ขวา ภาพอยู่ช่วง x 10–270
  - `center` = มีคำบรรยายด้านบน ภาพอยู่ช่วง x 50–140 และ 220–350
  - บนเดสก์ท็อปจะเห็นเฉพาะช่วง y ≥ 58 และกรอบคำพูดจะบังมุมบน **ห้ามวางของสำคัญไว้ใต้กรอบคำพูด**
- ห้ามใส่ class ที่เป็นแอนิเมชัน (`cm-*`) บน `<g>` ที่มี transform ต้องห่อ `<g>` อีกชั้นก่อน
- ห้ามใช้ cm-stamp, cm-move, cm-sweep ให้ใช้ cm-stampin, cm-bob, cm-vibx, cm-pinpulse, cm-steam2, cm-blink แทน
- ห้ามใช้ emoji ในภาพ SVG
- **ไอเดียสำหรับพัฒนาต่อ:**
  - แสงและเงาที่ซับซ้อนขึ้น
  - ฉากหลังที่ลึกขึ้น มีชั้นหน้า กลาง หลัง
  - ตัวประกอบที่ทำท่าทางเยอะขึ้น
  - ช่องที่เล่าเรื่องต่อเนื่องกัน

### น้องม้วน (มาสคอตหลัก)
- เปลี่ยนท่าทางให้มาก รูปแบบคือ `mood: "แขน+หน้า+ของในมือ+การขยับ"`
  - แขน: wave point up thumb cross scratch chin cheer cover palm open bow
  - หน้า: smile laugh star wink hmm think shock sad cry firm relief sleepy
  - ของในมือ: pen mag coin phone sign umbrella shield cal money clip cup none
  - การขยับ: sway bob hop shake spin peek lean breathe
- **ห้ามใช้ mood ซ้ำกันภายในชุดเดียวกัน**
- ต้องใช้ให้ครบทุกแขน ทุกหน้า และทุกการขยับ ไม่วนอยู่แค่ point/cross/scratch
- ตอนนี้มีท่าที่ใช้ถี่เกินไป คือ `point+smile+clip+bob`, `cross+firm+...+lean` และ `scratch+hmm/shock+...` **ต้องเลิกใช้ท่าซ้ำพวกนี้**
- ถ้าท่าที่มีอยู่ยังไม่พอ ให้เพิ่มท่าใหม่ใน `public/mascot.js` ได้ ระบบท่าทางอยู่ราวบรรทัด 150–180

### ปกและการ์ด (สไตล์พาสเทลที่ผู้ใช้ชอบ)
- สร้างด้วย `python3 /tmp/pastel/gen.py <ไฟล์>.py` ดูตัวอย่างที่ `examples/cards-b8.py`
- สร้าง `.card.js` และ `.cover.css` เปล่าๆ ไว้ก่อน (ใส่ชื่อฟังก์ชันและชื่อ layout) แล้วตัวสร้างจะเขียนทับให้
- สูตรของปก:
  - พื้นพาสเทลไล่ 2 สี มีวงแสงขาวและคลื่นขาวจางๆ
  - **ภาพหลักชิ้นเดียว ขนาดใหญ่ มีเงา**
  - ป้ายเล็ก 1 อัน อยู่ด้านบน เพื่อไม่ให้น้องม้วนบังหรือโดนตัดขอบในหน้ารายการ
  - กรอบบาง และ badge ที่มุม
- **ห้าม:**
  - พื้นหลังสีเข้มหรือสีจัด
  - ของชิ้นเล็กๆ หลายชิ้น
  - กรอบหนา
  - ป้ายข้อความหลายอัน
- ชื่อ layout ต้องไม่ซ้ำ ให้ grep ทั้งใน `public/guide-covers/*.css` และ `public/guide.css`

### เนื้อหาในคู่มือ
- ต้องลึกและใช้งานได้จริงขึ้นเรื่อยๆ เช่น:
  - ตัวอย่างข้อความที่ใช้ทวงหรือตอบได้จริง
  - ขั้นตอนเป็นลำดับ
  - ตัวเลขระยะเวลาหรืออายุความที่ตรวจจากตัวบทแล้ว
  - redFlags ที่เจาะจง
  - อ้างข้ามไปคู่มืออื่นด้วย "ชื่อเรื่องจริง" (grep หาชื่อเรื่องก่อนทุกครั้ง)
- โครงสร้างคู่มือ:
  - intro ที่เป็นเรื่องราวสมจริง
  - cardText
  - summary 5 ข้อ
  - 3 ส่วน (left / right / center) ส่วนละ 3 คำถาม
  - redFlags 4 ข้อ

## 5. ขั้นตอนทำงาน (เครื่องมืออยู่ในโฟลเดอร์นี้)
1. `bash tools/guide-maker/setup.sh` เพื่อติดตั้งเครื่องมือไว้ใน /tmp และเปิดเซิร์ฟเวอร์จำลองที่พอร์ต 3410
   - ถ้าเซิร์ฟเวอร์ดับ (เจอ ERR_CONNECTION_REFUSED) หรือเพิ่งเพิ่มไฟล์ JSON ใหม่ ให้รันคำสั่งนี้:
     ```
     pkill -f mini2.mjs; (ROOT=/home/claude/vellum-check ADMIN=1 PORT=3410 nohup node /tmp/mini2.mjs > /tmp/mini2.log 2>&1 &)
     ```
2. เขียนเนื้อหาใน `/tmp/newg/mkNN.py` (ดูตัวอย่าง `newg/mk13.py`) แล้วรัน `python3 /tmp/newg/mkNN.py`
   - ไฟล์นี้จะเขียน JSON ลงใน `server/library/guides/`
3. ตรวจมาตรา: `node /tmp/chk15.mjs server/library/guides/<slug>.json` ทุกบรรทัดต้องขึ้น OK
4. เขียนภาพการ์ตูนใน `/tmp/art/xN.js` (ดูตัวอย่าง `examples/h1.js`)
   - build: `python3 /tmp/art/build.py xN:<slug>`
   - test: `node /tmp/art/test.mjs public/guide-panels/<slug>.panels.js`
5. ทำปกและการ์ดด้วย `/tmp/pastel/gen.py`
6. ถ่ายภาพหน้าจอตรวจ:
   - `python3 /tmp/shoot.py <slug> 3410` ได้ไฟล์ `/tmp/sh_<slug>_m.png` (มือถือ) และ `_d.png` (เดสก์ท็อป)
   - `python3 /tmp/covergrid.py out.png slug...` ได้ปกเรียงกันหลายเรื่อง
   - `/tmp/listshot.py` ดูหน้ารายการ (แก้ slug ที่บรรทัด 12)
   - **ต้องดูภาพเองทุกช่อง** และแก้ทุกจุดที่มีของโดนบัง ตัวละครลอย หรือดูเละ
7. commit, `git fetch`, `git rebase origin/main`, `git push origin main`, เพิ่มบรรทัดใน PROJECT_NOTES.md แล้วส่งรูปตัวอย่างและสรุปสั้นๆ ให้ผู้ใช้

- ก่อนตั้ง order ต้องหาค่าสูงสุดในหมวดก่อนเสมอ แล้วใช้ค่าถัดไป เพราะหน้าเรียนรู้เรียงจาก order มากไปน้อย ถ้าใช้เลขซ้ำ เรื่องใหม่จะไปจมอยู่กลางรายการ
- ป้ายบนการ์ด (tag) บรรทัดแรกต้องสั้นไม่เกินราว 12 ตัวอักษร และของสำคัญในภาพหลักต้องอยู่ช่วง x 54–118 ไม่อย่างนั้นหน้ารายการบนมือถือจะตัดทิ้ง
- ปกและการ์ดตั้งแต่เรื่อง 147 ใช้สไตล์ "พาสเทลมีมิติ" ที่ผู้ใช้ชอบ: มีกระดาษซ้อนด้านหลังสองแผ่น (สีเส้นกรอบ 22% หมุน 8 องศา และสีขาว 75% หมุน 4 องศา) และเส้นไฮไลต์ขาวด้านบน ดูตัวอย่างการเติมชั้นใน tools/guide-maker/pastel/enrich.py แล้วสร้างด้วย gen.py ตามปกติ
