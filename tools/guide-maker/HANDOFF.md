# ส่งต่องานคู่มือ Vellum Check (อ่านไฟล์นี้ก่อนเริ่มงาน)

ไฟล์นี้เขียนไว้ให้ Claude ในแชตใหม่ อ่านแล้วทำงานต่อได้ทันที โดยผู้ใช้ไม่ต้องอธิบายซ้ำ


## 0. อ่านก่อน: สิ่งที่ผู้ใช้สั่งล่าสุด (27 พ.ย. 2569) และวิธีทำงานที่ใช้จริงในเรื่อง 147–191

### คำสั่งล่าสุดของผู้ใช้ (ถอดความ)
> "สิ่งที่ผมจะให้ทำคือ**ทำตามหมวดหมู่** และทำให้**สวยขึ้น พัฒนาเรื่อยๆ ไม่ซ้ำซากจำเจ** **เปลี่ยนท่าทางน้องม้วนเยอะๆ** และ**เนื้อหาด้านในพัฒนามากขึ้นเรื่อยๆ โดยที่ผมไม่ต้องสั่ง** และสวยขึ้นอีก ไม่จำเจ"

แปลเป็นงาน:
- ผู้ใช้พิมพ์แค่ **"ทำอีก5เรื่อง"** → ทำ 5 เรื่องในหมวดปัจจุบัน (ตอนนี้ **ค้าขายและแบรนด์ ถึงเรื่องที่ 541 แล้ว เรื่องถัดไป 542**) commit + push เอง ไม่ต้องถาม
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
- ⚠️ **ห้ามวางป้าย/ข้อความทับน้องม้วน** (ผู้ใช้สั่ง 28 พ.ย. 69): หน้ารายการบนมือถือเห็นภาพการ์ด viewBox x≈28–108 และน้องม้วนกินมุมซ้ายล่าง x≈29–73, y≥99 → ใน hero (ก่อน scale 0.62) ห้ามมีป้าย/ตัวหนังสือที่ x<112 และ y>128 · ป้ายเล็กท้าย hero ให้วางที่ `translate(132 ~150) rotate(-4)` (ถ้ากว้างกว่า 46 ให้ `translate(128 …) scale(44/กว้าง)`) · ตรวจทุกชุดด้วย `python3 tools/guide-maker/fast/mascot_overlap_check.py ค้าขาย` ต้องไม่มีชื่อเรื่องใหม่โผล่ (ยกเว้น RECT ใหญ่ที่เป็นพื้นหลัง)
- **title (หัวข้อ) ต้องสั้น ≤ 95 ตัวอักษร** เป็นคำถามเดียวที่อ่านจบใน 3–4 บรรทัดบนมือถือ (lint ฟ้องแล้ว) — รายละเอียดเรื่องราวไปใส่ใน intro แทน
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
- ผู้ใช้ขอให้วาดสัตว์ให้สวยขึ้น (ปกเรื่อง 265 แพะเดิมเป็นวงรีหยาบ) → เพิ่ม `GOAT()` ใน gx.py (หน้า ตา แก้มชมพู เขา หู เครา กีบ คาบผัก) และ `examples/b24goat.py` สำหรับปก **กฎ: สัตว์ทุกตัวต้องมีหน้า ตา แก้ม และรายละเอียด ห้ามใช้วงรีเปล่า** ถ้า pk.py ไม่มีสัตว์ที่ต้องการ ให้เขียนฟังก์ชันใหม่แบบ GOAT
  - ตอนแก้เฉพาะภาพเรื่องเก่า: รัน run.sh แล้ว **copy เฉพาะ panels.js** เข้า repo (อย่าใช้ publish.sh เพราะจะทับ card/cover พาสเทลด้วย stub)
- ชุด 462–466 (อาคารชุด: มรดก/เสียสัญชาติ 19 สัตต–นว,66 ; บริษัทเป็นต่างด้าว/ถือแทน 19 ฉ,19 ทศ,66,67 ; เจ้าหน้าที่ตรวจนิติบุคคล/อายัด/ขัดขวาง 60/1–60/3,70,73 ; ควบคุมอาคาร: ร้านข้างเคียงเป็นผู้เสียหาย/ผู้คุมงานพิสูจน์ 30 วัน 49,49 ทวิ,72,73 ; เครื่องเล่นเป็นอาคาร/แบบสถาปนิก/ข้อบัญญัติเกินจำเป็น 8 ทวิ,10 ทวิ,28 ทวิ,65 ทวิ) ใช้ท่าไปแล้ว: cover+hmm+folder+peek, pinch+think+pie+tilt, stop+shock+deed+stomp, thumb+relief+globe+bob, chin+worried+envelope+tiptoe, rub+worried+deed+lean, fist+shock+calendar+tiptoe, ok+relief+calendar+hop, count+hmm+badge+tiptoe, elbow+focus+mag+tilt, stop+shock+lock+stomp, nod+relief+folder+hop, palm+worried+helmet+duck, scratch+worried+umbrella+lean, grip+shock+helmet+stomp, fold+relief+letter+hop, wave+think+bell+peek, cheer+hmm+plan+lean, hip+shock+pen+stomp, rub+relief+scroll+hop
- ชุด 467–471 (เกษตรพันธสัญญา 22–25,27,28,40,41 ผู้ซื้อ / 29–31,33–35 ไกล่เกลี่ย; ศาลล้มละลาย 16–18,20–23 สืบพยานไว้ก่อน / 24–28/2 อุทธรณ์; ป.ล้มละลาย 82–87 ลูกหนี้ตาย) ท่า: tap+think+map+lean, elbow+think+map+tiptoe, stop+shock+paper+stomp, nod+relief+umbrella+hop, both+hmm+handshake+duck, rub+hmm+handshake+tilt, grip+shock+map+stomp, cross+relief+calendar+hop, pinch+worried+folder+tiptoe, point+worried+map+lean, stop+shock+box+stomp, ok+relief+mail+hop, hmm+firm+scroll+lean, count+think+scroll+tiptoe, palm+shock+calendar+stomp, bow+relief+gavel+hop, sad+think+flower+lean, fold+think+calendar+tilt, shrug+shock+paper+stomp, nod+relief+folder+hop · สัตว์ใหม่ FROG · ที่ยังว่าง: ป.ล้มละลาย 88–89 ห้างหุ้นส่วน, 11–18, 61, 64–71; พ.ร.บ.หอพัก; ควบคุมอาคาร 7–12
- ชุด 472–476 (ป.ล้มละลาย 11–15 ฟ้อง/ประกัน, 16–18 หนี/พิทักษ์ชั่วคราว, 88,89,61 ห้าง/หุ้นส่วนไม่จำกัด, 64–67 หน้าที่ลูกหนี้, 68–71 ปลด) ท่า: thumb+focus+coin+sway, wave+focus+coin+peek, cheer+shock+paper+duck, hip+relief+calendar+bob, grip+alert+truck+stomp, palm+alert+plane+tiptoe, fist+shock+truck+stomp, nod+calm+lock+breathe, scratch+curious+deed+peek, chin+curious+ledger+lean, point+shock+idcard+stomp, cheer+relief+gavel+sway, cover+star+chat+bob, open+star+chat+shake, stop+alert+plane+stomp, thumb+calm+ledger+sway, fold+hopeful+certificate+wave, pray+hopeful+letter+sway, cross+firm+report+shake, ok+calm+certificate+bob · สัตว์ใหม่ PANDA, ตัวช่วย PASSPORT/PCTBAR · ที่ยังว่าง: พ.ร.บ.หอพัก, ควบคุมอาคาร 7–12, ป.ล้มละลาย 72–81
- ชุด 477–481 (ป.ล้มละลาย 76,79–81 หลังปลด/เพิกถอน; พ.ร.บ.หอพัก 48,50–56 ผู้จัดการ / 42,43,57,59–61 ประกัน ระเบียบ ป้าย / 62–64 ทะเบียน 7 วัน / 39,44–47 ต่อเติม เลิก ทายาท) · สัตว์ใหม่ OWL, ตัวช่วย DORMBLDG/FIREKIT · ที่ยังว่าง: หอพัก 65–73 (เพิกถอนใบอนุญาต/ตรวจ), 41 สิทธิประโยชน์, ควบคุมอาคาร 7–12, ป.ล้มละลาย 1–5,29,35,44,49,51,58,93,97,103,107,118,121,139–144
- ชุด 537–541: ป.อาญา ผู้ใช้ทำเกินขอบเขต/ขัดขวาง/เหตุส่วนตัว 87–89 ; ผิดซ้ำกลุ่มเดียวกัน 3 ปี +1/2 / ไม่นับประมาท-ลหุโทษ-อายุ<18 / พ่อแม่จ่ายตามข้อกำหนด 93,94,77 ; พ.ร.บ.คุ้มครองผู้บริโภค ฉลาก/โรงพิมพ์/กฎกระทรวง ม.35/เปรียบเทียบ 53,54,55,62,63 ; สคบ.ฟ้องแทน/เพิกถอนสมาคม/จ้างสมาคมฟ้องกลั่นแกล้ง/เผยความลับ 39/1,42,60,61 ; พ.ร.บ.แข่งขันทางการค้า ข้อยกเว้น/นิยาม/เงื่อนไขรวมธุรกิจ/บังคับค่าปรับทางปกครอง 4,5,46,53,85 · วิธีหามาตราว่าง: walk guides JSON เทียบ seed ตัด "(ฉบับ Update…)" ออกจากชื่อ · ยังว่างที่เข้ากับหมวด: ประกันสังคม (88 มาตรา ว่าง — นายจ้าง/ร้านจ้างลูกจ้าง), แรงงานสัมพันธ์ 133, ศาลแรงงาน 61, จัดสรรที่ดิน 56, ป.ที่ดิน 76, ป.พ.พ. 461, ป.วิ.แพ่ง 149 · ท่า: grip+worried+megaphone+tilt, stop+alert+phone+duck, elbow+think+scroll+sway, pinch+focus+key+tiptoe, tap+hopeful+ledger+stomp, rub+hopeful+envelope+lean, count+inspect+ledger+bob, shrug+sad+stamp+peek, tap+curious+label+sway, hip+focus+tag+bob, ok+proud+bottle+lean, grip+inspect+receipt+tilt, both+relief+handshake+breathe, fist+firm+folder+stomp, elbow+hopeful+mail+peek, pinch+alert+lock+duck, shrug+smile+chart+tiptoe, nod+joy+coin+hop, pray+calm+certificate+breathe, stop+calm+scale+sway · ปก b67.py (สเปรย์/แบงก์ซ้อน/ขวดฉลากกากบาท/แฟ้มติ๊ก/ตาชั่ง)
- ชุด 532–536 ป.อาญา ภาค 1 (โทษ/อายุความ): นับวันจำคุก/หักวันขัง/กักขังแทน/ยกจำคุกเหลือปรับ 21,22,23,55 ; กักขังที่บ้าน/สิทธิ/ทำอาชีพ/เปลี่ยนเป็นจำคุก 24–27 ; อายุความ/ล่วงเลยการลงโทษ/บังคับค่าปรับ 5 ปี 95,98,99 ; ผิดเงื่อนไขรอลงอาญา/บวกโทษ/เพิ่มก่อนลด/เพดาน 50 ปี 51,54,57,58 ; ค่าปรับสูงสุดคดีระงับ/ปรับรายตัว/ชำระต่อศาล/จำอย่างเดียว/ตายโทษระงับ 20,28,31,38,79 · ⚠️ sec2 ของ ป.อาญา ม.1–9 คืนตัวบท พ.ร.บ.ให้ใช้ ไม่ใช่ตัวประมวล → ห้ามใช้ · ท่า: shrug+hopeful+hourglass+tilt, nod+focus+key+lean, fold+calm+clock+peek, rub+smile+door+bob, pray+worried+lock+sway, hip+proud+lamp+tiptoe, ok+joy+bell+breathe, tap+inspect+notebook+lean, elbow+curious+coffee+bob, grip+alert+calendar+peek, count+focus+hourglass+sway, pinch+inspect+scroll+tilt, both+worried+clock+duck, stop+firm+gavel+stomp, fist+proud+stamp+hop, nod+calm+receipt+lean, shrug+curious+cash+sway, ok+hopeful+receipt+tiptoe, fold+sad+flower+breathe, hip+smile+scale+tilt · ปก b66.py (ปฏิทินหักวัน/บ้าน/นาฬิกาทราย/ขั้นบันไดเพิ่มลด/ใบเสร็จ) · ป.อาญา ภาค 1 ที่ยังว่าง: 10–17, 19, 40–43, 48, 49, 52, 53, 77, 87–89, 93, 94, 97, 100, 101 → ภาค 1 ใกล้หมด ชุดหน้าอาจย้ายไปกฎหมายอื่นใน seed
- ชุด 527–531 ป.อาญา ภาค 1: เด็ก/เยาวชนทำผิด 73–76 (ฐานข้อมูลยังเขียน 10 ปี — ใช้ 12 ปีตามฉบับที่ 29 พ.ศ. 2565 และบอกในคู่มือ) ; เมา/จิตบกพร่อง/คำสั่งเจ้าพนักงาน 65,66,70 ; พลาด/สำคัญผิดตัว/ผลธรรมดา 60,61,63 ; บรรเทาโทษ/กรรมเดียว/หลายกรรม/ผิดซ้ำ 78,90,91,92 ; ลหุโทษ/โฆษณาชวนทำผิด 85,102–106 · ท่า: wave+think+cup+peek, cheer+sad+pen+lean, scratch+laugh+money+sway, nod+proud+bell+tilt, up+hmm+umbrella+lean, cover+shock+cal+bob, thumb+think+shield+peek, open+laugh+pen+spin, tap+curious+lamp+tiptoe, up+sad+mag+hop, bow+hmm+coin+lean, cross+relief+sign+breathe, palm+star+cup+hop, scratch+think+clip+spin, bow+shock+phone+peek, thumb+relief+money+lean, cheer+wink+shield+breathe, up+cry+sign+lean, palm+laugh+cal+bob, open+firm+umbrella+peek · ปก b65.py (บัตรอายุ/ขวด/เป้าพลาด/แฟ้มซ้อน/โทรโข่ง) · ป.อาญา ภาค 1 ที่ยังว่าง: 1–28, 31, 38, 40–43, 48, 49, 51–55, 57, 58, 77, 79, 87–89, 93–95, 97–101
- ชุด 522–526 ป.อาญา ภาค 1: ริบทรัพย์/เจ้าของไม่รู้เห็นขอคืน 1 ปี 32–37 ; ค่าปรับ 30 วัน/ยึดทรัพย์/กักขัง 500 บาท/วัน/ทำงานบริการสังคม 29,29/1,30,30/1 ; วิธีการเพื่อความปลอดภัย ห้ามเข้าเขต/ทัณฑ์บน/ห้ามอาชีพ 39,44–47,50 ; ไม่รู้กฎหมาย/สำคัญผิด/จำเป็น/บันดาลโทสะ 62,64,67,72 ; ญาติ ม.71/พยายาม/ตัวการ 80–83 · ท่า: open+think+mag+bob, chin+sad+money+spin, palm+laugh+shield+lean, bow+relief+clip+peek, cheer+hmm+coin+sway, up+cry+cal+breathe, cross+firm+phone+hop, wave+smile+pen+bob, thumb+think+sign+lean, scratch+sad+umbrella+peek, open+wink+shield+sway, cheer+firm+cup+spin, cover+hmm+phone+hop, point+think+cal+lean, palm+shock+money+breathe, up+relief+sign+peek, chin+laugh+clip+bob, wave+cry+coin+spin, thumb+hmm+pen+sway, bow+wink+mag+hop · ปก b64.py · ป.อาญา ภาค 1 ที่ยังว่าง: 1–28 (ขอบเขต/โทษ), 31, 38, 40–43, 48, 49, 51–55, 57, 58, 60, 61, 63, 65, 66, 70, 73–79, 85, 87–95, 97–106
- ชุด 517–521 ป.อาญา: เจ้าพนักงานภาษี/ประเมินราคาทุจริต/ละเว้นหน้าที่/ขัดขวางคำสั่ง 154,155,157,165 ; ขายของให้รัฐ เบียดบัง/ใช้อำนาจทุจริต/ส่วนได้เสีย/จ่ายเกิน 147,151–153 ; ข่มขืนใจเจ้าพนักงาน/ยกพวก/ขัดขวางขายทอดตลาด/ดูหมิ่นศาล 139,140,197,198 ; อุทกภัย/ถนนอันตราย/สื่อสารขัดข้อง/ยิงปืน 228,229,235,376 ; ทำร้ายสาหัส/ทารุณเด็ก-คนชรา/ยักยอกโดยอาชีพที่ไว้ใจ 297,398,354 · ท่า: cross+wink+phone+bob, up+think+coin+peek, palm+sad+clip+lean, thumb+firm+cal+spin, open+hmm+cup+breathe, scratch+shock+money+bob, cheer+laugh+sign+peek, wave+firm+umbrella+lean, chin+cry+umbrella+hop, bow+shock+sign+sway, up+laugh+coin+breathe, cover+star+pen+bob, thumb+star+cal+sway, palm+cry+phone+peek, scratch+wink+clip+lean, open+firm+shield+bob, cross+relief+phone+peek, up+sad+shield+spin, chin+think+cup+hop, thumb+wink+money+lean · ปก b63.py · ป.อาญา ภาค 2 ความผิดเฉพาะ (107–398) ที่ยังว่างเหลือเฉพาะเรื่องที่ไม่ค่อยเกี่ยวกับร้าน (ความมั่นคง ศาสนา เพศ การคุมขัง 190–196,199–205, ความผิดของเจ้าพนักงานบางมาตรา 150,156,158–164,166) → ชุดหน้าควรไป ป.อาญา ภาค 1 (หลักทั่วไป เช่น ป้องกัน 68 ใช้แล้ว, จำเป็น 67, ยอมความ/อายุความ 95–96 ใช้แล้ว/97–101, รอลงอาญา 56 ใช้แล้ว, ผู้สนับสนุน 86 ใช้แล้ว ฯลฯ) หรือ ป.วิ.อาญา (out/ มีไฟล์เต็ม แต่ต้องเช็กว่ามีใน seed ไหม — seed ไม่มี ป.วิ.อาญา ⇒ lint จะไม่ผ่าน)
- ชุด 512–516 ป.อาญา ความผิดต่อเจ้าพนักงาน/ความยุติธรรม: สินบน/คนกลาง/เจ้าพนักงานเรียกเงิน/แอบอ้าง 143–146,148,149 ; ดูหมิ่น/แจ้งเท็จ/ขัดขวาง/แกะตรา/ของกลาง 136–138,141,142 ; แจ้งความเท็จ/ฟ้องเท็จ/ลุแก่โทษ 172–176 ; ขัดขืนหมาย/เบิกความเท็จ/หลักฐานเท็จ 168–171,177,179,180,182 ; ทำลายหลักฐาน/ของศาล/ทรัพย์ถูกยึด/ซ่อนคน 184–187,189,192 · ท่า: cross+hmm+shield+peek, up+cry+money+sway, palm+think+sign+bob, wave+relief+pen+lean, open+star+clip+spin, thumb+shock+cup+peek, chin+laugh+cal+sway, bow+firm+umbrella+hop, scratch+hmm+phone+breathe, point+cry+clip+lean, cheer+think+money+shake, cover+relief+sign+bob, wave+wink+cal+lean, open+sad+shield+hop, up+firm+pen+peek, thumb+laugh+umbrella+spin, chin+star+money+sway, palm+shock+phone+bob, cross+think+coin+breathe, cheer+relief+mag+lean · ปก b62.py · ⚠️ judgebench(x,y=146,w) ต้องส่ง y ของพื้น · ป.อาญา ที่ยังว่าง: 139,140,147,150–167 (ความผิดของเจ้าพนักงานเอง), 178,181,183,190,191,193–205, 228–232,235,297,354,376,388,398
- ชุด 507–511: พ.ร.บ.ห้ามเรียกดอกเบี้ยเกินอัตรา (law "พระราชบัญญัติห้ามเรียกดอกเบี้ยเกินอัตรา พ.ศ. ๒๕๖๐") 4–6 ; ป.อาญา บัตรอิเล็กทรอนิกส์ 269/1,269/2,269/4–269/7 ; ปลอมเอกสารสิทธิ/แจ้งเท็จ/คำรับรองเท็จ 266,267,269 ; ภัยสาธารณะจากงานก่อสร้าง/ระบบน้ำไฟ/รถรับจ้าง/ท่อระบาย 226,227,233,234,375 ; ลหุโทษอาวุธ/ชื่อเท็จ/ข่าวลือ/น้ำบ่อ/ทรัพย์ที่ฝัง 355,367,371,379,380,384 · ⚠️ แก้ lint.py ให้หา "มาตรา\nเลข" ใน seed ได้ (มาตรา 269/4 ฯลฯ ขึ้นบรรทัดใหม่ใน seed) · ⚠️ sec2.py กับ ป.อาญา 265 คืนข้อความผิดมาตรา อย่าใช้ · พ.ร.บ.เช่าอสังหาฯ เพื่อพาณิชย์มีแค่ 11 มาตรา ใช้หมดแล้ว · ท่า: scratch+wink+coin+lean, point+sad+money+bob, cover+think+pen+hop, thumb+relief+shield+sway, up+hmm+phone+peek, wave+shock+clip+lean, chin+firm+mag+spin, open+relief+cal+bob, palm+hmm+pen+sway, bow+cry+sign+breathe, cheer+wink+clip+shake, cross+star+money+peek, cheer+think+umbrella+lean, scratch+shock+cal+bob, up+laugh+shield+breathe, palm+firm+phone+hop, thumb+star+cup+bob, chin+hmm+sign+spin, wave+laugh+pen+peek, open+sleepy+coin+lean · ปก b61.py · ป.อาญา ที่ยังว่าง: 228–232, 235, 297, 354, 376, 388, 398 และภาคความผิดต่อตำแหน่งหน้าที่/ความยุติธรรม (136–205) ที่ร้านอาจเจอ เช่น ติดสินบนเจ้าพนักงาน 144, ขัดขวางเจ้าพนักงาน 140, แจ้งความเท็จ 172–174, พยานเท็จ 177
- ชุด 502–506 ย้ายมา ป.อาญา (ใช้ชื่อ law "ประมวลกฎหมายอาญา"): วางเพลิง/ทำให้ไฟไหม้/ประมาท/ไม่ช่วยดับไฟ 217,218,220,225,383 ; ปลอมปนอาหาร/เจือของมีพิษ/ผลตายสาหัส/ไม่ช่วยคนอันตราย 236–238,374 ; เปิดผนึกจดหมาย/ความลับจากอาชีพ/ความลับอุตสาหกรรม 322–324 ; ลหุโทษหน้าร้าน 368,369,386,387,389,396 ; สัตว์ดุ/ทารุณ/ใช้งานเกิน/เข้าสวน 377,381,382,394,395 · ⚠️ ชื่อฉากต้องไม่ซ้ำทั้ง repo (frhelp ชน → เปลี่ยนเป็น frassist) · ระบุว่าอัตราโทษเป็น "ตามตัวบทในฐานข้อมูล อาจแก้ไขภายหลัง" · ท่า: cheer+cry+shield+bob, up+shock+pen+sway, palm+think+cup+breathe, bow+relief+money+lean, wave+hmm+clip+hop, thumb+sad+cal+peek, scratch+laugh+phone+sway, open+firm+mag+spin, chin+star+umbrella+shake, cover+hmm+sign+lean, up+star+coin+bob, palm+wink+umbrella+breathe, cross+think+cup+hop, scratch+sad+money+lean, bow+laugh+clip+peek, thumb+firm+phone+sway, open+laugh+pen+bob, up+sleepy+shield+spin, chin+relief+cal+shake, cross+wink+money+breathe · ปก b60.py · ป.อาญา ที่ยังว่างน่าใช้: 226–235 (ภัยสาธารณะ), 265–267,269 (เอกสาร), 269/1–269/7 (บัตรอิเล็กทรอนิกส์), 297, 354, 355, 367, 371, 374 แล้ว, 375, 376, 379, 380, 384, 388, 398 · กฎหมายอื่นใน seed ที่ยังว่าง: ห้ามเรียกดอกเบี้ยเกินอัตรา (1–8), เช่าอสังหาฯ เพื่อพาณิชย์ (10–30), แข่งขันทางการค้า (1–49 ส่วนใหญ่เป็นเรื่องคณะกรรมการ)
- ชุด 497–501 (ป.พ.พ. บรรพ 1: นิติบุคคล/ผู้แทน/ขัดประโยชน์/รับผิด 65–67,70–76 ; ภูมิลำเนา คน/สามีภริยา/ผู้เยาว์/นิติบุคคล/สาขา 37–44,68,69 ; คนไร้ความสามารถ/วิกลจริต/เสมือนไร้ความสามารถ 28–36 ; ทรัพย์ ส่วนควบ อุปกรณ์ ดอกผล 137–148 ; ผู้ไม่อยู่ ตัวแทน ผู้จัดการทรัพย์สิน 49–51,53,55,56,59,60,64) · ⚠️ sec2.py กับเลขมาตรา 1–17 คืนบทเฉพาะกาลของ พ.ร.บ.แก้ไข ไม่ใช่ ป.พ.พ. จริง อย่าใช้ · ท่า: point+star+sign+hop, up+hmm+pen+sway, cheer+think+shield+peek, cover+relief+coin+bob, thumb+wink+mag+lean, wave+sad+phone+spin, palm+laugh+cal+shake, bow+firm+clip+breathe, open+hmm+shield+sway, chin+cry+pen+hop, scratch+star+money+peek, cross+relief+cup+lean, cheer+laugh+umbrella+spin, up+firm+mag+bob, thumb+think+cal+hop, wave+relief+coin+peek, chin+think+phone+breathe, palm+sad+clip+sway, open+wink+sign+lean, bow+star+shield+shake · ปก b59.py · ที่ยังว่างใน ป.พ.พ.: 78–136 (สมาคม/มูลนิธิ), 149, 177, 194, 197, 201, 642, 727, 985, 1242, 1248, 1353, 1354, 1386, 1396, 1434
- ชุด 492–496 (ละเมิด: ตึกข้างจะพัง/ร่วมกันทำ/ภัยฉุกเฉิน/รั้วต้นไม้ร่วม ป.พ.พ.435,432,450,1345 ; เอาของไปโดยละเมิด+ดอกเบี้ย/ลาภมิควรได้ 439–441,414,417,418 ; จัดการงานนอกสั่ง 397,400,404,405 ; ขายฝากห้ามจำหน่าย/คืนตามสภาพ/ภาระจำยอม 493,501,706,480 ; สิทธิอาศัย/เก็บกิน 1408,1409,1423,1428,1338) · ผู้ใช้ชมภาพแบบ 489 (เอกสารติ๊กถูก, การ์ดขั้นตอน) → gx.py เพิ่ม LETTER, STEPCARD, ARROW, NOTEBAR, ICON, CRACKWALL, TILTSIGN, FRUITSTALL, TENT, WINDLINES, SHOPFRONT, STAIRS, SPEAKER · ⚠️ ในช่องภาพ เนื้อหาเริ่ม y≥64 (บนกว่านั้นโดนตัด/โดนกรอบคำพูด) · layout center: การ์ดที่ x 10–138, y 84–120 + แถบโน้ต y 128 (น้องม้วนอยู่ x≈150–190) · ท่า: up+star+umbrella+bob, cover+shock+shield+shake, point+think+clip+peek, palm+relief+none+lean, wave+hmm+mag+sway, chin+sad+coin+bob, open+think+pen+spin, thumb+relief+money+breathe, cheer+smile+phone+hop, scratch+hmm+cup+lean, bow+wink+cal+peek, cross+firm+sign+sway, open+cry+money+peek, up+think+sign+shake, palm+star+clip+bob, wave+firm+pen+lean, chin+wink+umbrella+breathe, cover+hmm+cal+spin, point+laugh+cup+hop, thumb+sleepy+shield+peek · ปก b58.py · ⚠️ ป.พ.พ. เหลือน้อยมาก (บรรพ 1 มาตรา 1–240 ยังว่างเยอะ, 642, 727, 985, 1242, 1248, 1353, 1354, 1386, 1396, 1434) — ชุดหน้าควรไปกฎหมายอื่น เช่น ป.วิ.พ. ส่วนที่เหลือ หรือกฎหมายเฉพาะที่ยังไม่มีในคลัง
- ชุด 487–491 (จำนอง: ผู้รับโอนตึกติดจำนอง บอก 60 วัน/ค่าปรับปรุงเท่าราคาที่งอก ป.พ.พ.735,737,740–743 ; จำนำตราสาร/ใบหุ้นให้สู้คนนอกได้ 751–755 ; ตั๋วถูกบอกปัด: ไม่ต้องคัดค้าน/แจ้งใน 4 วัน/รายการคำบอกกล่าว-คำคัดค้าน 962,965,966 ; จดทะเบียนห้าง สามัญ/จำกัด สำนักงาน ค่าธรรมเนียม เรื่องเกิดต่างประเทศ 1014,1017,1018,1064,1078,1080 ; หุ้นส่วนสะเพร่า/ครบกำหนดแต่ค้าต่อ/ห้างจดทะเบียนล้มละลาย 1039,1059,1069) · ท่า: scratch+star+mag+peek, cheer+cry+cal+sway, chin+laugh+pen+hop, palm+relief+money+lean, open+star+sign+lean, point+hmm+shield+spin, cover+laugh+cup+peek, cross+relief+pen+sway, chin+cry+mag+hop, palm+think+phone+peek, up+wink+clip+breathe, cheer+firm+cal+bob, wave+star+cup+spin, bow+think+money+peek, thumb+laugh+sign+lean, scratch+firm+shield+hop, cover+wink+pen+breathe, chin+sad+cup+shake, point+cry+phone+bob, open+relief+umbrella+sway · ปก b57.py · ⚠️ gx.py รวมตัวช่วยสองสาย (COMPARE2, TALLY, SNAIL, TOUCAN, CERTSHARE, PANGOLIN ฯลฯ ต่อท้ายไฟล์) อย่าเขียนทับด้วยไฟล์เก่า · ที่ยังว่าง: ป.พ.พ.773 (ตรวจสินค้าในคลัง), เกือบหมดหมวดหุ้นส่วนแล้ว
- ชุด 482–486 (พ.ร.บ.หอพัก 65–69 เพิกถอน / 70–73,76,93 ตรวจ / 77–80,95,96 เงินผู้พัก เปรียบเทียบ / 82–89 ใบอนุญาต ผู้จัดการ / 41,90–92,94 หน้าที่ รางวัล) · สัตว์ใหม่ KOALA, ตัวช่วย TROPHY/FINESLIP · หอพักเหลือแค่หมวดคณะกรรมการ (14–26) ไม่ค่อยใช้ได้จริง · ที่ยังว่าง: ควบคุมอาคาร 7–12, ป.ล้มละลาย 1–5,29,35,44,49,51,58,93,97,103,107,118,121,139–144, เกษตรพันธสัญญาส่วนที่เหลือ
- ชุด 457–461 (ที่ดินคนต่างด้าว: ซื้อทำร้าน/จำนวนไร่/มรดก ป.ที่ดิน 86–88,93,111 ; ใช้ตามกิจการ-แจ้ง 30 วัน-บังคับขาย 89–92,94 ; บริษัทหุ้นต่างชาติ 49% 95,97–100 ; นอมินี-โทษนิติบุคคล 94,96,112,113 ; อาคารชุด: ซื้อห้องเปิดร้าน สัญญามาตรฐาน-ข้อบังคับ 6/2,12,21,32,33,42/3,63) ใช้ท่าไปแล้ว: tap+worried+calendar+peek, rub+hmm+calendar+lean, grip+shock+hourglass+stomp, nod+relief+map+hop, wave+think+globe+lean, elbow+hopeful+globe+tiptoe, pinch+shock+deed+stomp, fold+relief+handshake+hop, chin+focus+pie+bob, count+think+pie+tilt, palm+shock+chart+stomp, both+relief+deed+hop, cross+shock+deed+duck, cover+worried+deed+tilt, stop+shock+gavel+stomp, ok+relief+receipt+hop, thumb+think+mag+peek, point+focus+mag+lean, scratch+shock+clip+stomp, hip+relief+deed+bob
- ชุด 452–456 (ที่ดิน: ค่าธรรมเนียมโอนตามราคาประเมิน/บริจาคยกเว้น/ฉบับสำนักงานหาย ม.64,103,103 ทวิ,104 ; หมุดหลักเขต-ขออนุญาตย้าย-อุทธรณ์ 15 วัน-รังวัดเข้าที่ ม.66–68,70 ทวิ,108 ตรี ; อาคารชุด: กรรมการ ม.37/1–37/6 และผู้จัดการแต่งตั้ง-ถอด ม.35/2,35/3,69 ; ควบคุมอาคาร: คณะกรรมการพิจารณาอุทธรณ์ ม.50,51,51 ทวิ,68) ใช้ท่าไปแล้ว: count+think+coin+tiptoe, nod+hmm+coin+lean, pinch+shock+receipt+stomp, shrug+relief+deed+hop, open+hopeful+badge+bob, elbow+think+clip+tilt, stop+shock+badge+stomp, nod+relief+gavel+hop, up+think+map+breathe, bow+focus+folder+tilt, cover+shock+envelope+stomp, palm+relief+badge+hop, chin+worried+map+duck, scratch+worried+wrench+lean, fist+shock+calendar+stomp, thumb+relief+map+hop, cross+hmm+folder+duck, pray+think+folder+lean, grip+shock+gavel+tiptoe, hip+relief+receipt+hop
- ชุด 447–451 (อาคารชุด: หนังสือห้องชุดหาย/จดผิด/ติดจำนอง ม.22–27 ; งบดุล-รายงานประจำปี-ฟ้องแทน ม.38/1–38/3,39,71 ; ค่าใช้จ่ายเฉพาะ-มอบฉันทะ-มติ 1/4-บุริมสิทธิ ม.40,41,46,47,49 ; ควบคุมอาคาร: หารือท้องถิ่น-ประกาศห้ามชั่วคราว-แจ้งคำสั่ง-โทษ ม.13,13 ทวิ,13 ตรี,47 ทวิ,66 ทวิ,67 ; โรงมหรสพ-อุปกรณ์ไม่ปลอดภัย ม.39 จัตวา–ฉ,46 ทวิ,65 ตรี) ใช้ท่าไปแล้ว: rub+hmm+deed+peek, grip+think+deed+lean, palm+shock+paper+stomp, fold+relief+stamp+hop, chin+hmm+chart+tiptoe, count+focus+chart+lean, stop+shock+folder+stomp, ok+relief+map+hop, ok+hmm+key+peek, both+think+coin+tilt, cover+shock+pen+stomp, pinch+relief+receipt+hop, wave+smile+reel+lean, cheer+hopeful+reel+tilt, cover+shock+bulb+stomp, point+relief+calendar+hop, scratch+think+plan+tiptoe, tap+hmm+letter+lean, grip+shock+sign+stomp, nod+relief+envelope+breathe
- ชุด 442–446 (ควบคุมอาคาร: เขตเพลิงไหม้ห้าม 45 วัน ม.56,57,62 / ปรับปรุงเขต-แผนผัง-เวนคืน ม.58–61 / นายช่างเข้าตรวจ-ผู้ตรวจสอบ ม.53–55 ตรี,63,64 ; อาคารชุด: เลิกอาคารชุด-ชำระบัญชี ม.52–58,60 ; ภาษีที่ดิน: ส่งหนังสือ 7 วัน-ขอขยายเวลา ม.11–14) ใช้ท่าไปแล้ว: cover+worried+cone+duck, palm+worried+map+tilt, grip+shock+hourglass+tilt, fold+relief+calendar+bob, wave+hmm+wrench+tiptoe, open+focus+helmet+lean, pinch+shock+mag+stomp, thumb+relief+badge+bob, elbow+think+phone+bob, point+hmm+envelope+duck, cross+shock+calendar+stomp, hip+relief+pen+hop, cross+hopeful+map+peek, chin+focus+plan+breathe, stop+shock+calendar+stomp, both+relief+deed+hop, pray+hmm+folder+lean, scratch+worried+key+tilt, fist+shock+deed+stomp, nod+relief+coin+breathe
- ชุด 437–441 (คลังสินค้า: ใบรับหาย/แยกส่วน/โอน ป.พ.พ.783–788,795,796 และจำนำด้วยประทวน/ขายทอดตลาด/ไล่เบี้ย 781,782,785,792–794 ; ตั๋วแลกเงินคู่ฉีก 975–981 ; สิทธินักแสดง ตัวแทนร่วม/ห้ามบิดเบือน ลิขสิทธิ์ 46–48,51/1 ; ค่าธรรมเนียมสิทธิบัตร/ยื่นซ้อน/รัฐใช้สิทธิ 52,77 เบญจ,80,88) ใช้ท่าไปแล้ว: tap+hmm+deed+peek, count+focus+letter+sway, grip+shock+gavel+tiptoe, both+relief+calendar+hop, scratch+hmm+box+peek, elbow+think+box+tiptoe, palm+shock+key+stomp, ok+relief+stamp+hop, elbow+smile+mic+tiptoe, wave+hopeful+reel+lean, fist+shock+scissors+stomp, thumb+relief+pen+bob, hip+focus+globe+sway, cover+think+paper+lean, stop+shock+envelope+stomp, thumb+relief+receipt+bob, rub+think+bulb+lean, nod+hmm+coin+duck, grip+shock+pen+tiptoe, bow+relief+shield+hop
- ชุด 432–436 (อนุญาโต: สืบพยาน/ถอน/แก้คำชี้ขาด 30 วัน/ค่าใช้จ่าย ม.30,38,39,46 และปฏิเสธบังคับคำชี้ขาด ม.43–44 ; ศูนย์ไกล่เกลี่ยภาคประชาชน/สินบนผู้ไกล่เกลี่ย ม.67–72 ; โรงแรม: ตรวจ/ปรับทางปกครอง ม.45–49,55,58 ; ภาษีที่ดิน: คณะกรรมการอุทธรณ์/ฟ้องศาล/บทลงโทษ ม.79–85,87,88) ใช้ท่าไปแล้ว: tap+focus+jar+lean, pinch+hmm+ledger+bob, scratch+shock+ledger+stomp, shrug+relief+coin+hop, wave+smile+bell+bob, elbow+smile+handshake+breathe, stop+shock+envelope+stomp, fold+relief+stamp+hop, hip+hmm+deed+breathe, cross+think+gavel+tiptoe, pinch+shock+calendar+stomp, thumb+relief+receipt+hop, fold+think+globe+tiptoe, hip+focus+shield+sway, stop+shock+scale+stomp, both+relief+globe+hop, rub+focus+key+peek, open+hmm+badge+tiptoe, cover+shock+receipt+stomp, nod+relief+key+hop
- ชุด 427–431 (ภาษีที่ดิน: สำรวจ/บัญชีรายการ ม.26–31,34 และยกเว้น/รวมแปลงติดกัน ม.8,36,42 ; ไกล่เกลี่ยคดีอาญาชั้นสอบสวน ม.39–46, ขั้นตอนนัด/ถอนตัว ม.49–60, บันทึกข้อตกลง/ยุติคดี ม.37,57,61–66) ใช้ท่าไปแล้ว: elbow+hmm+plan+lean, shrug+hmm+map+tiptoe, grip+shock+badge+stomp, nod+relief+ledger+bob, tap+think+bell+tilt, hip+hmm+bell+duck, fist+shock+badge+stomp, shrug+relief+hourglass+hop, thumb+smile+handshake+tiptoe, cross+relief+handshake+bob, up+shock+receipt+stomp, point+relief+stamp+hop, rub+hmm+scroll+tiptoe, count+think+deed+peek, palm+shock+plan+stomp, pray+relief+chart+hop, nod+focus+chat+lean, both+hopeful+chat+tiptoe, scratch+shock+hourglass+stomp, ok+relief+door+breathe
- ⚠️ ก่อนเริ่มทุกชุด: `git pull` ก่อน แล้วเช็กว่ามาตราที่จะใช้ยังไม่ถูก cite ในคู่มืออื่น (ชุด 327–331 เคยทำซ้ำกับของที่มีแล้วจนต้องลบ)
- ชุด 327–331 (ขอขยายระยะเวลา ม.23, คู่ความตายระหว่างคดี/ทายาทเข้าแทน 1 ปี ม.42–44, เพิกถอนกระบวนพิจารณาผิดระเบียบ 8 วัน ม.27, คำขอเหตุฉุกเฉิน ม.266–270, อุทธรณ์คำสั่งระหว่างพิจารณา ม.226–228) ใช้ท่าไปแล้ว: up+shock+money+sway, wave+wink+umbrella+peek, point+laugh+shield+hop, cross+hmm+mag+lean, thumb+relief+shield+lean, chin+sleepy+pen+sway, open+firm+sign+hop, cover+wink+coin+bob, scratch+think+clip+bob, bow+star+sign+spin, up+smile+pen+shake, open+cry+phone+breathe, cheer+sad+cup+shake, palm+smile+mag+spin, cover+star+pen+peek, bow+hmm+shield+breathe, wave+shock+none+hop, cross+relief+clip+peek, point+wink+cup+sway, scratch+firm+pen+lean
- ชุด 332–336 (คัดค้านผู้พิพากษา ม.11–14, ไกล่เกลี่ยในศาล/มาศาลด้วยตนเอง ม.19–20, นับวันครบกำหนดตรงวันหยุด ม.22 + ป.พ.พ. 193/3, 193/5, 193/8, ละเมิดอำนาจศาล ม.30–33, ป่วยขอเลื่อนคดี ม.40–41) ใช้ท่าไปแล้ว: chin+relief+none+lean, thumb+sleepy+clip+hop, palm+cry+pen+bob, wave+wink+cal+sway, up+think+cup+spin, open+smile+money+breathe, cheer+shock+phone+shake, scratch+firm+sign+bob, cover+hmm+clip+peek, bow+relief+sign+spin, cross+sad+pen+shake, open+laugh+coin+breathe, point+shock+umbrella+sway, cross+think+mag+lean, wave+laugh+cup+hop, cheer+star+clip+peek, thumb+wink+phone+sway, chin+relief+pen+lean, palm+cry+cal+bob, cover+sleepy+clip+hop
  - gx.py เพิ่ม CALGRID(ปฏิทินเดือน วงวัน/วันหยุดแดง), THERMO(ปรอทวัดไข้), DUCKLING(ลูกเป็ด); ปกชุดนี้ examples/b38.py + run38.py
  - ป.วิ.พ. ที่ใช้แล้วเพิ่ม: 11, 13, 14, 19, 20, 22, 30, 31, 33, 40, 41
  - สิ่งที่พัฒนา: `SANDGLASS` (นาฬิกาทรายทรายไหล) + `PINBOARD` (บอร์ดก๊อกโน้ตปักหมุด) + `CAPY` (คาปิบารามีส้มบนหัว) ใน gx.py; ปก `b37.py` ใช้ฟังก์ชัน gx ใน hero ได้ (import ใน b37)
  - หัวข้อ ≤85 ตั้งแต่ร่างแรก (ผ่านหมด) ; ระวัง center layout: ของฝั่งขวา x 200–260 ชนตัวคน/น้องม้วน → ใช้ STICKER เล็กแทนบอร์ด
  - ยังว่าง ป.วิ.พ.: 1–22, 24–26, 28–41, 45–54, 63–69, 80–83, 89, 91–137 (บางส่วน), 139–171, 188, 195, 201, 208–223, 230, 233, 236, 239–246, 250, 265, 286
- ชุด 337–341 (มอบฉันทะไปศาลแทน ม.64, ขอหมายเรียกพยาน ม.106–107, ค่าฤชาธรรมเนียมเมื่อยอมความ/ประวิงคดี ม.105, 163, 166, 168, 169, ขอศาลชี้ข้อกฎหมายก่อน ม.24, ฟ้องลูกค้าผู้เยาว์ ม.45, 56 + ป.พ.พ. 21) ใช้ท่าไปแล้ว: bow+hmm+cal+breathe, open+sad+clip+shake, cover+laugh+mag+peek, cross+think+sign+spin, wave+star+shield+peek, point+shock+money+sway, thumb+sleepy+phone+lean, cross+laugh+umbrella+hop, palm+relief+shield+lean, wave+wink+none+hop, cover+hmm+umbrella+sway, up+shock+mag+bob, chin+cry+phone+spin, scratch+smile+mag+bob, cheer+firm+none+breathe, palm+wink+shield+shake, bow+think+cup+spin, open+sad+clip+breathe, up+cry+phone+peek, chin+star+cal+shake
  - ปกชุดนี้ examples/b39.py (มีฟังก์ชัน doc() เอกสารหัวสีขนาดใหญ่) ; ตำแหน่งน้องม้วนใน layout center อยู่ราว x≈170 อย่าวางสัตว์ทับ
  - ป.วิ.พ. ที่ยังว่างน่าใช้ต่อ: 21, 25, 26, 28, 29, 32, 34–39, 46–54, 63, 65–69, 80–83, 89, 91, 92, 96, 100, 109–111, 114–116, 119, 120, 128–130, 132, 139, 140, 149, 154, 164, 170, 171
- ชุด 342–346 (รวม/แยกคดี ม.28–29, ทนายถอนตัว/ตาย ม.65 + 45, คำบอกกล่าวให้รับรองข้อเท็จจริง ม.100, พยานไม่มาศาล ม.109–111, เอกสารภาษาต่างประเทศ/แก้คำผิด/ใบมอบอำนาจ ม.46–47) ใช้ท่าไปแล้ว: cross+sleepy+phone+hop, point+laugh+shield+lean, thumb+smile+pen+peek, cheer+relief+none+sway, cover+shock+clip+hop, wave+hmm+cup+sway, cross+sad+money+lean, thumb+wink+mag+bob, palm+firm+sign+spin, scratch+star+shield+bob, chin+laugh+money+breathe, cheer+hmm+cup+shake, open+think+money+peek, bow+cry+cal+spin, up+sleepy+mag+shake, cover+smile+coin+breathe, point+relief+cup+peek, wave+shock+clip+hop, bow+think+coin+sway, up+cry+pen+lean
  - ปก examples/b40.py ; coverLines บรรทัดแรกควร ≤ 15 ตัวอักษรไทยโดยประมาณ (17 ล้นที่ 390)
  - ป.วิ.พ. ที่ยังว่างน่าใช้ต่อ: 21, 25, 26, 35–39, 63, 66–69, 80–83, 89, 91, 92, 96, 114, 116, 119, 120, 128–130, 132, 139, 140, 149, 154, 164, 170, 171
- ชุด 347–351 (รอคดีอาญา ม.39, ปฏิเสธเบิกความเรื่องลับ ม.92, อำนาจผู้แทนนิติบุคคล ม.66, ยื่นเอกสารอิเล็กทรอนิกส์/ขอด้วยวาจา ม.68, 69, 21, ศาลตรวจสิ่งของ/ผู้เชี่ยวชาญ ม.128–130) ใช้ท่าไปแล้ว: cross+wink+cal+lean, thumb+sad+money+hop, chin+hmm+umbrella+sway, point+sleepy+none+bob, palm+laugh+cal+shake, scratch+firm+clip+spin, cheer+star+money+bob, open+shock+sign+breathe, cover+smile+pen+spin, cross+think+clip+shake, bow+firm+umbrella+breathe, wave+sleepy+cup+peek, up+relief+money+sway, cheer+cry+mag+hop, thumb+star+phone+lean, chin+shock+umbrella+peek, point+sad+umbrella+sway, chin+hmm+none+hop, cross+wink+money+lean, wave+think+coin+bob
  - ปก examples/b41.py ; coverLines บรรทัดสองก็ล้นได้ (≤ 14 ตัวอักษรไทยโดยประมาณ)
  - ป.วิ.พ. ที่ยังว่างน่าใช้ต่อ: 25, 26, 35–38, 63, 67, 80–83, 89, 91, 96, 114, 116, 119, 120, 132, 139, 140, 149, 154, 164, 170, 171
- ชุด 352–356 (จำหน่ายคดี ม.132, ค่าฤชาธรรมเนียม/ค่าขึ้นศาล ม.149, วางเงินค่าใช้จ่ายบังคับคดี ม.154, นั่งพิจารณานอกศาล/วันหยุด/ศาลเลื่อนเอง ม.35, 37, 38, พิจารณาลับ/ห้ามเผยแพร่ ม.36) ใช้ท่าไปแล้ว: palm+laugh+sign+spin, open+wink+pen+shake, scratch+firm+cup+breathe, thumb+hmm+none+bob, cover+sleepy+cal+shake, bow+smile+pen+spin, point+sad+phone+peek, cheer+star+umbrella+breathe, up+cry+money+hop, chin+shock+mag+sway, open+relief+none+lean, thumb+think+sign+peek, cheer+smile+cup+spin, cover+sleepy+none+peek, thumb+star+coin+shake, chin+sad+money+breathe, scratch+wink+shield+spin, palm+hmm+coin+bob, bow+laugh+money+breathe, cross+sad+sign+shake
  - ปก examples/b42.py ; มีคู่มือ pay-into-court-stop-interest (ม.135–136) อยู่แล้ว อย่าทำซ้ำ
  - ป.วิ.พ. ที่ยังว่าง: 25, 26, 63, 67, 80–83, 89, 91, 96, 114, 116, 119, 120, 139, 140, 164, 170, 171 (เหลือน้อย ชุดหน้าอาจย้ายไปกฎหมายอื่นในคลัง เช่น ป.พ.พ. ส่วนที่ยังไม่ใช้)
- ชุด 357–361 ย้ายมาใช้ ป.พ.พ. หุ้นส่วน (ออกแล้วขอให้งดใช้ชื่อ 1047, โอนส่วนกำไร/บำเหน็จผู้จัดการ 1041, 1046, หุ้นส่วนไม่ปรากฏชื่อ 1048, 1049, 1065, เจ้าหนี้ส่วนตัวของหุ้นส่วน 1072, ควบห้าง/เจ้าหนี้คัดค้าน 1073–1076) ใช้ท่าไปแล้ว: open+think+money+lean, thumb+firm+phone+hop, palm+shock+sign+sway, cheer+star+coin+peek, point+cry+cal+sway, up+relief+coin+lean, wave+think+clip+bob, open+wink+phone+hop, cross+laugh+money+bob, bow+hmm+coin+breathe, scratch+laugh+none+shake, cover+sad+umbrella+spin, chin+sleepy+money+spin, cover+smile+cal+shake, thumb+hmm+mag+breathe, wave+relief+pen+peek, cheer+star+pen+hop, palm+firm+money+peek, cross+sad+none+sway, up+smile+cal+lean
  - ปก examples/b43.py ; badge ปกยาวได้ไม่เกิน 3 ตัว (4 หลักโดนตัด)
  - ป.พ.พ. ที่ยังว่าง: 480, 493, 501, 536, 642, 706, 735, 740–743, 751–755 (จำนำสิทธิ), 773, 781–796 (คลังสินค้า/ใบประทวน), 962, 965, 966, 1004, 1005, 1010, 1011 (ตั๋วเงิน), 1014, 1017, 1018, 1039, 1059, 1064, 1069, 1078, 1080, 1083, 1085, 1086, 1089–1094 (หุ้นส่วน/ห้างจำกัด)
- ชุด 362–366 หจก. หุ้นส่วนจำกัดความรับผิด (แสดงว่าลงหุ้นเกิน 1085 + ลงหุ้นเป็นเงิน/ทรัพย์ 1083, ลดทุนต้องจดทะเบียน 1086, ค้าขายแข่ง/โอนหุ้นได้ 1090–1091, ตาย/ทายาทเข้าแทน 1092–1093, ล้มละลาย/ผู้ชำระบัญชี 1094, 1089) ใช้ท่าไปแล้ว: point+cry+clip+bob, open+think+sign+hop, wave+wink+phone+sway, bow+star+mag+lean, scratch+star+money+breathe, thumb+laugh+coin+bob, point+wink+cal+shake, cover+cry+phone+spin, chin+hmm+cup+spin, bow+relief+cal+shake, cheer+sleepy+pen+breathe, cover+laugh+shield+peek, cross+sad+shield+hop, palm+firm+money+lean, up+smile+sign+sway, scratch+relief+cal+peek, wave+star+sign+lean, open+think+mag+hop, cross+cry+money+sway, chin+sleepy+pen+bob
  - ปก examples/b44.py ; คลังสินค้า/จำนำสิทธิ มีคู่มือแล้ว (warehouse-*, pledge-rights-and-bills)
  - ป.พ.พ. ที่ยังว่าง: 480, 493, 501, 536, 642, 706, 735, 740–743, 962, 965, 966, 1004, 1005, 1010, 1011, 1014, 1017, 1018, 1039, 1059, 1064, 1069, 1078, 1080 ; หมวดบริษัทจำกัด 1096+ ยังไม่ได้เช็กว่าเหลือมาตราไหน
- ชุด 367–371 (เช็คขาดอายุความ หนี้เดิมยังอยู่ 1004–1005, เช็คหาย/ถูกขโมย 1010–1011, ใบหุ้นแบบผู้ถือ 1134–1137, ใบมอบฉันทะ+คะแนนลับ 1188, 1191–1192, หุ้นกู้/หุ้นบุริมสิทธิ/หนังสือเสนอหุ้นใหม่ 1229, 1223, 1142) ใช้ท่าไปแล้ว: chin+sleepy+cal+spin, bow+star+cup+breathe, wave+relief+phone+peek, palm+shock+coin+shake, up+firm+mag+hop, scratch+sad+shield+lean, cheer+smile+none+sway, cover+cry+umbrella+peek, point+wink+umbrella+bob, thumb+shock+pen+breathe, cover+cry+sign+spin, bow+think+money+shake, cheer+relief+mag+shake, palm+laugh+umbrella+spin, cover+star+none+peek, chin+sleepy+phone+breathe, thumb+think+coin+shake, point+cry+money+spin, cross+shock+cup+bob, cover+wink+mag+breathe
  - ปก examples/b45.py (มี chq() วาดเช็ค) ; ป.พ.พ. หมวดหุ้นส่วนบริษัทเกือบหมดแล้ว เหลือ 480, 493, 501, 536, 642, 706, 735, 740–743, 962, 965, 966, 1014, 1017, 1018, 1039, 1059, 1064, 1069, 1078, 1080, 1242, 1248 → ชุดหน้าควรดูกฎหมายอื่นในคลัง (เช่น พ.ร.บ.ที่มีในคลังแต่ยังใช้น้อย)
- ชุด 372–376 ย้ายมาใช้ พ.ร.บ.ล้มละลาย (ชื่อกฎหมายใน cite: "พระราชบัญญัติล้มละลาย พุทธศักราช 2483") ฝั่งร้านเป็นเจ้าหนี้: ค่าเช่าตามส่วน/ดอกเบี้ยหลังพิทักษ์/เงินต่างประเทศ 98–100, ตรวจและโต้แย้งคำขอรับชำระหนี้ 104–106, 108, ประนอมหนี้ 48, 52, 53, 55, 57, 59, บังคับคดีชนล้มละลาย 110–112, 62, ธุรกิจลูกหนี้ดำเนินต่อ 120 ใช้ท่าไปแล้ว: open+laugh+shield+lean, chin+hmm+cal+bob, thumb+firm+clip+sway, up+wink+none+hop, point+think+phone+spin, cross+wink+shield+breathe, open+star+cup+shake, thumb+sleepy+cal+bob, bow+shock+pen+shake, palm+relief+cup+peek, wave+sleepy+clip+breathe, cheer+cry+money+spin, cover+smile+sign+sway, scratch+sad+none+lean, palm+shock+cup+hop, wave+think+phone+peek, up+firm+sign+hop, chin+laugh+money+bob, cheer+hmm+pen+lean, thumb+star+none+sway
  - ปก examples/b46.py ; coverLines บรรทัดแรก ≤ 14–15 ตัว (คำว่า "พิทักษ์ทรัพย์" ยาว ใช้ "ล้มละลาย" แทนบนปก)
  - พ.ร.บ.ล้มละลาย ยังว่างอีกมาก เช่น 7, 44, 49, 51, 58, 61, 64–66, 68–71, 76, 92, 93, 97, 101, 103, 117, 118, 121–129 ; เครื่องหมายการค้าเหลือแต่มาตราธุรการ ; ดูลิขสิทธิ์/สิทธิบัตร/ธุรกรรมอิเล็กทรอนิกส์ที่ยังว่างได้
- ชุด 377–381 พ.ร.บ.ล้มละลาย ต่อ (รอบแบ่งทรัพย์/กันส่วน/ต่ำกว่า 1 บาท/คู่สมรส 124, 125, 128, 129, ตรวจและคัดค้านบัญชีส่วนแบ่ง 126–127, ผู้ค้ำ/ลูกหนี้ร่วมยื่นล่วงหน้า 101, เจ้าพนักงานไม่ยอมรับสัญญา 122 + 92, ซื้อทรัพย์จากกอง/ถูกหมายเรียก 123, 117) ใช้ท่าไปแล้ว: cross+wink+phone+breathe, point+sleepy+mag+bob, open+laugh+coin+spin, up+sad+cal+shake, bow+cry+mag+breathe, cheer+relief+pen+shake, cross+laugh+coin+spin, open+sleepy+none+peek, wave+shock+cup+sway, scratch+think+shield+peek, palm+smile+none+lean, cover+hmm+phone+hop, thumb+star+none+hop, chin+hmm+pen+lean, bow+smile+coin+bob, palm+think+sign+sway, point+laugh+shield+breathe, up+wink+phone+shake, chin+sad+none+spin, cover+relief+clip+bob
  - ปก examples/b47.py ; พ.ร.บ.ล้มละลาย ที่ยังว่าง: 7, 44, 49, 51, 58, 61, 64–66, 68–71, 76, 93, 97, 103, 118, 121 และมาตรา 131+ (ยังไม่ได้เช็ก)
- ชุด 382–386 ฟื้นฟูกิจการ (พ.ร.บ.ล้มละลาย หมวด 3/1 และ 3/2 SME): เกณฑ์ SME 90/91–90/94, คำร้อง/ค่าขึ้นศาล/ไต่สวน 90/95, 90/97, 90/100, โต้แย้งคำขอ+เจ้าหนี้มีประกัน 90/28, 90/29, 90/32, ไม่ยื่นหมดสิทธิ+หนี้ระหว่างแผน 90/61–90/62, แผน/มติ/ศาลเห็นชอบ/แก้แผน/รายงาน/ยกเลิก 90/42, 90/46, 90/58, 90/63, 90/66, 90/70 ใช้ท่าไปแล้ว: open+cry+umbrella+breathe, cross+laugh+money+spin, cheer+sleepy+cal+peek, bow+relief+pen+shake, wave+shock+shield+peek, scratch+sleepy+none+lean, up+laugh+cal+hop, open+think+mag+sway, palm+hmm+clip+lean, thumb+smile+cup+sway, point+star+mag+hop, wave+sad+coin+bob, cover+wink+cup+bob, chin+shock+pen+shake, palm+star+cal+spin, cross+sad+sign+breathe, bow+relief+coin+spin, cheer+firm+pen+shake, cross+cry+phone+peek, thumb+wink+cup+breathe
  - ปก examples/b48.py ; ถ้า mk อ้าง T(slug) ของเรื่องในชุดเดียวกัน ต้อง build เรื่องนั้นก่อน ; ฟื้นฟูกิจการยังว่างอีกมาก (90/3–90/11, 90/13–90/25, 90/30–90/59 บางส่วน, 90/64–90/89, 90/96–90/112)
- ชุด 387–391 ฟื้นฟูกิจการ ต่อ (ขอศาลผ่อนข้อจำกัด/คุ้มครองเจ้าหนี้มีประกัน/อายุความ 90/13–90/15, หักกลบ+หนี้ต่างประเทศ 90/33, 90/31, ส่งแผน/ขอแก้แผน/ลำดับมติ 90/43–90/45, 90/48, ปลดผู้บริหารแผน 90/65, 90/67, 90/68, ผลยกเลิกฟื้นฟู/พิทักษ์เด็ดขาดต่อ 90/73, 90/75–90/77) ใช้ท่าไปแล้ว: open+laugh+phone+hop, scratch+sleepy+cup+sway, up+think+none+lean, point+firm+clip+peek, wave+hmm+sign+bob, bow+smile+umbrella+lean, cover+sleepy+money+sway, point+shock+pen+hop, palm+sad+umbrella+bob, chin+star+shield+breathe, wave+smile+sign+shake, scratch+relief+clip+spin, thumb+cry+phone+breathe, cheer+wink+money+spin, cross+relief+coin+shake, chin+sad+pen+peek, up+laugh+money+sway, open+firm+phone+lean, palm+think+mag+peek, cover+hmm+cup+hop
  - ปก examples/b49.py ; badge ห้ามใส่ "90/13" (ยาวเกิน ใช้เลขท้าย) ; หมวดฟื้นฟูยังว่าง 90/3–90/11, 90/16–90/25, 90/34–90/41, 90/47, 90/49–90/57, 90/69, 90/71, 90/72, 90/74, 90/80+
- ชุด 392–396 ฟื้นฟูกิจการช่วงต้น (ประกาศ/คัดค้านคำร้อง/ไต่สวนต่อเนื่อง 90/9–90/11, เจ้าหนี้รวมกัน ≥10 ล้านยื่นเอง/ค่าขึ้นศาล/ห้ามยื่น/ถอนไม่ได้ 90/3–90/8, ประชุมเลือกผู้ทำแผน/สิทธิออกเสียง/มอบฉันทะ/ค้านเสียง/2 ใน 3 90/17, 90/18, 90/22, 90/23, ผู้บริหารชั่วคราว/สิทธิผู้ถือหุ้นระงับ/อำนาจย้ายไปผู้ทำแผน 90/20, 90/21, 90/24, 90/25, ผู้ทำแผนทวงหนี้ 14 วัน/เพิกถอนการให้เปรียบ 3 เดือน-1 ปี/ฉ้อฉล 90/38–90/41) ใช้ท่าไปแล้ว: cheer+think+cal+lean, thumb+shock+mag+sway, bow+firm+pen+peek, wave+relief+shield+spin, up+star+coin+bob, palm+hmm+money+breathe, open+wink+cal+shake, cross+smile+clip+hop, point+laugh+sign+breathe, chin+think+phone+bob, scratch+wink+mag+lean, cheer+relief+umbrella+peek, cover+star+phone+sway, bow+sad+cup+spin, wave+firm+clip+hop, thumb+smile+pen+shake, palm+shock+shield+lean, cross+sleepy+money+peek, open+cry+coin+bob, up+relief+cal+spin
  - สิ่งที่พัฒนา: gx.py เพิ่ม `TIMELINE` (เส้นเวลามีหมุดวันตามมาตรา), `ALPACA` (อัลปากาขนฟู ผ้าพันคอ), `HANDOVER` (กล่องส่งมอบดวงตรา/สมุดบัญชี/กุญแจ) ; เนื้อหาทุกเรื่องมีแบบฟอร์มเติมช่อง [ ] ลอกไปใช้ได้ (คำคัดค้าน, ข้อตกลงเจ้าหนี้ร่วม, มอบฉันทะ, ข้อความตอบลูกค้า, หนังสือปฏิเสธหนี้) + ตัวอย่างนับวัน + เช็กลิสต์ ☐
  - ปก examples/b50.py + run50.py ; ตัวบทในคลังถูกตัดท้าย: 90/7, 90/17, 90/20, 90/39 ; setup_fast.sh แก้แล้ว (ไม่มี rsync ก็ใช้ cp, คัดลอก gx.py ไป work)
  - ฟื้นฟูยังว่าง: 90/1, 90/2, 90/16, 90/19, 90/30, 90/34–90/37, 90/47, 90/49–90/57, 90/59, 90/64, 90/69, 90/71, 90/72, 90/74, 90/78–90/90
- ชุด 397–401 ฟื้นฟูกิจการ ต่อ (ถามลูกหนี้ในที่ประชุม/คำชี้แจง 7 วัน/หมายเรียก-หมายจับ 90/19, 90/34, 90/35, 90/37, ประชุมแผนสะดุด/1 ใน 10/ผู้ทำแผนไม่มา-ไม่ยอมแก้/คนใหม่ 45 วัน 90/47, 90/49–90/54, สิทธิออกเสียงเมื่อถูกโต้แย้ง/กรรมการเจ้าหนี้ 3–7/ศาลนัด ≥3 วัน/ข้อคัดค้านแผน 90/30, 90/55–90/57, หนี้เท็จ/ถ้อยคำเท็จ/ผู้บริหารปกปิด/เจ้าหนี้เป็นผู้เสียหาย 90/80, 90/81, 90/84, 90/89, 90/90, ซื้อเสียง/รับเงินแลกโหวต/ข้อมูลลับ/ผู้ทำแผนทุจริต 90/85–90/88) ใช้ท่าไปแล้ว: wave+think+mag+hop, point+hmm+clip+sway, chin+firm+sign+shake, open+smile+cup+peek, scratch+laugh+cal+bob, up+sleepy+phone+lean, cover+cry+pen+breathe, bow+wink+shield+hop, thumb+relief+sign+spin, cheer+smile+money+lean, palm+star+cal+peek, cross+think+umbrella+bob, chin+shock+clip+sway, wave+sad+mag+breathe, point+sleepy+coin+shake, open+star+pen+spin, cross+wink+cup+lean, palm+cry+money+hop, up+firm+umbrella+peek, cheer+laugh+shield+bob
  - สิ่งที่พัฒนา: gx.py เพิ่ม `GAVEL` (ค้อนศาลขยับ), `HIPPO` (ฮิปโปมีฟัน หูชมพู), `MINIBUB` (บับเบิลคำพูดของตัวประกอบในฉาก) ; เนื้อหาเพิ่ม 'สคริปต์พูดในที่ประชุม' และ 'ข้อความปฏิเสธ' ที่ส่งได้ทันที + เริ่มหมวดบทกำหนดโทษ (ร้านเป็นผู้เสียหาย)
  - ปก examples/b51.py + run51.py ; ระวัง T() อ้างวน (397↔400): สร้าง json ชั่วคราวที่มีแค่ title ใน src ก่อน build ; CHAT ใช้ (side,text)
  - ฟื้นฟูยังว่าง: 90/1, 90/2, 90/16, 90/36, 90/59, 90/64, 90/69, 90/71, 90/72, 90/74, 90/78, 90/82, 90/83 → ชุดหน้าอาจไปหมวด 3/2 SME (90/91+) ที่ยังว่าง หรือกฎหมายอื่น
- ชุด 402–406 ฟื้นฟู SME (แผน 10 รายการ/≤3 ปี/5 เกณฑ์ศาล/ค้าน 3 วัน 90/96, 90/99, 90/101, 90/103, พักชำระหนี้ 8 ข้อ/เช่าซื้อค้าง 2 งวด/โทษลูกหนี้จ่ายนอกการค้าปกติ 90/104, 90/105, 90/123, ประกาศเห็นชอบ/แผนผูกมัดใคร/หนี้ตกหล่น/อำนาจผู้บริหารแผน 90/106–90/110, รายงาน 3 เดือน/พ้นตำแหน่ง/เลือกคนใหม่ 2/3/ชั่วคราว 90/111–90/115, สำเร็จ/ครบไม่สำเร็จ 14 วัน/ยกเลิก/บุริมสิทธิหนี้ผู้บริหารแผน/ถอน-ยกคำร้อง 90/98, 90/102, 90/116–90/121) ใช้ท่าไปแล้ว: wave+laugh+coin+peek, point+think+cal+hop, bow+star+mag+lean, thumb+hmm+umbrella+sway, palm+firm+shield+bob, cheer+shock+phone+peek, chin+smile+clip+spin, open+sad+sign+hop, up+wink+pen+breathe, cover+think+money+bob, cross+laugh+mag+sway, scratch+star+cup+lean, bow+relief+clip+shake, wave+shock+cal+lean, thumb+sleepy+sign+peek, palm+laugh+phone+spin, cheer+hmm+cal+sway, point+relief+money+peek, up+cry+shield+shake, chin+wink+coin+hop
  - สิ่งที่พัฒนา: gx.py เพิ่ม `COMPARE2` (การ์ดเทียบ 2 คอลัมน์), `SLOTH` (สลอธห้อยกิ่ง), `PIGGY` (กระปุกหมูมีป้าย) ; เนื้อหาทุกเรื่องมีข้อ 'ต่างจากฟื้นฟูทั่วไปอย่างไร' + ลิงก์คู่มือฝั่งทั่วไป
  - ปก examples/b52.py + run52.py ; SME ยังว่าง: 90/122, 90/124–90/128 (บทกำหนดโทษ SME) ; ฟื้นฟูทั่วไปยังว่าง: 90/1, 90/2, 90/16, 90/36, 90/59, 90/64, 90/69, 90/71, 90/72, 90/74, 90/78, 90/79, 90/82, 90/83
- ชุด 407–411 (โทษฟื้นฟู SME 90/122, 90/124–90/128 ; ฟื้นฟูทั่วไป ใครมีอำนาจแต่ละช่วง+โทษไม่ส่งมอบ 90/36, 90/59, 90/64, 90/69, 90/71, 90/72, 90/74, 90/83 ; ล้มละลาย แบ่งครั้งที่สุด/ปิดคดี/เปิดคดีต่อ 131–134 ; ยกเลิกการล้มละลาย 135–138 ; ร้องคัดค้านเจ้าพนักงาน 14 วัน/กรรมการเจ้าหนี้เห็นชอบ/ฟ้อง 6 เดือน/หน้าที่โจทก์ 145–148, 151, 152, 155) ใช้ท่าไปแล้ว: thumb+laugh+clip+lean, wave+cry+pen+peek, scratch+relief+sign+hop, open+think+shield+sway, chin+sad+phone+spin, cheer+star+mag+bob, bow+hmm+money+peek, point+wink+cal+breathe, cover+smile+coin+lean, palm+think+clip+bob, up+shock+sign+shake, cross+star+cup+hop, open+relief+umbrella+spin, thumb+firm+mag+peek, wave+wink+money+lean, chin+laugh+pen+sway, cheer+firm+phone+shake, bow+cry+clip+hop, scratch+smile+shield+breathe, palm+sleepy+cal+bob
  - สิ่งที่พัฒนา: gx.py เพิ่ม `CASEBOX` (กล่องสำนวน ปิด/เปิดฝา), `TALLY` (กระดานตัวเลขที่ต้องจำ), `RACCOON` ใหม่ (ทับของเดิม) ; เนื้อหาเพิ่มข้อ 'ตัวเลขที่ต้องจำ' + แผนที่อำนาจทีละช่วง
  - ปก examples/b53.py + run53.py ; หัวข้อยาวเกิน 95 ตัว lint ไม่ผ่าน ; พ.ร.บ.ล้มละลาย ยังว่าง: 7, 44, 49, 51, 58, 61, 64–66, 68–71, 76, 93, 97, 103, 107, 118, 121, 139–144, 150, 154, 156–181 (โทษลูกหนี้ล้มละลาย 161–170 น่าทำต่อ) ; ฟื้นฟูทั่วไปเหลือแค่ 90/1, 90/2, 90/16, 90/78, 90/82
- ชุด 412–416 บทกำหนดโทษ พ.ร.บ.ล้มละลาย (ลูกหนี้รับเชื่อ ≥2,000 ไม่บอก/ชื่ออื่น/ผู้รับผิดเหมือนลูกหนี้/เจ้าพนักงานเป็นพนักงานสอบสวน 160, 165, 175 ; ก่อนถูกฟ้อง 1 ปี ขายของเชื่อ/ทำลายบัญชี/ไม่มีบัญชี 3 ปี 164, 166, 167 ; คนนอกซ่อนทรัพย์/หนีต่างประเทศ/หลบหมาย/ค้านการยึด 14 วัน 158, 168, 169, 173 ; เงินแลกประนอมหนี้/เจ้าหนี้รับปรับ 5 เท่า/หนี้เท็จ/อ้างเป็นเจ้าหนี้ 163, 170–172, 174 ; เงินค้างจ่าย 5 ปี+2 เดือน/แจ้งความไม่ถึง/ค่าธรรมเนียม/ต่างประเทศ 157, 176–179) ใช้ท่าไปแล้ว: point+shock+cup+bob, up+hmm+phone+hop, cover+laugh+sign+peek, bow+think+shield+lean, wave+star+clip+sway, cross+sad+mag+breathe, thumb+wink+cal+bob, open+firm+pen+peek, scratch+laugh+money+lean, chin+cry+umbrella+hop, palm+smile+cal+shake, cheer+sleepy+coin+spin, up+sad+clip+peek, point+laugh+money+sway, bow+shock+phone+breathe, wave+relief+pen+bob, open+wink+mag+hop, cover+firm+cup+lean, thumb+think+coin+peek, chin+relief+sign+bob
  - สิ่งที่พัฒนา: gx.py เพิ่ม `SUITCASE` (กระเป๋าเดินทาง), `FLAMINGO` (ฟลามิงโกขาเดียว), `NAMESWAP` (ป้ายร้านชื่อใหม่แปะทับชื่อเก่า) ; เนื้อหาเพิ่ม 'ก่อนให้เครดิตลูกค้าใหม่ควรถามอะไร' (ป้องกันก่อนเกิด)
  - ปก examples/b54.py + run54.py ; พ.ร.บ.ล้มละลาย ยังว่าง: 1–5, 7, 11–18 (บางส่วน), 29, 35, 44, 49, 51, 58, 61, 64–66, 68–90 (ปลด/ประนอมหลังล้มละลาย บางส่วน), 93, 97, 103, 107, 118, 121, 139–144, 150, 154, 156, 159, 161, 162, 180, 181 — เช็กก่อนว่ามาตราไหนถูกใช้ด้วยรูปแบบอื่น ; หมวดนี้ใกล้หมด ชุดหน้าอาจย้ายไป ป.พ.พ. ที่ยังว่าง (บรรทัด 126)
- ชุด 417–421 ป.พ.พ. (บุริมสิทธิผู้ขาย/ผู้รักษาสังหาฯ/ลำดับ/ขายต่อหมดสิทธิ 269, 270, 278, 280–282 ; ผู้ให้เช่า/เช่าช่วง/3 งวด/เงินประกัน/โรงแรม/รับขน/ของคนนอก 261–268 ; ผู้รับเหมาบนอสังหาฯ/จดก่อนลงมือ/ก่อนจำนอง/ผู้ขายที่ดิน 273–276, 279, 283–289 ; คำเสนอทางโทรศัพท์/คำสนองมาช้า/ตกลงไม่ครบ/ต้องทำเป็นหนังสือ 356, 358, 360, 366, 367 ; ลูกหนี้เสียประโยชน์เงื่อนเวลา/เงื่อนไขสุดแต่ใจลูกหนี้ 185, 187, 190, 193) ใช้ท่าไปแล้ว: cross+laugh+coin+peek, wave+think+money+lean, up+star+shield+bob, bow+sad+cal+sway, palm+wink+phone+breathe, cheer+hmm+sign+hop, chin+shock+cup+peek, scratch+relief+money+spin, thumb+star+pen+lean, open+hmm+clip+shake, point+cry+cal+peek, cover+relief+shield+hop, up+laugh+phone+spin, bow+wink+mag+sway, wave+firm+cup+breathe, cross+smile+pen+bob, cheer+think+umbrella+shake, chin+star+coin+lean, palm+cry+sign+hop, open+laugh+cal+peek
  - สิ่งที่พัฒนา: gx.py เพิ่ม `QUOTESLIP`, `SCAFFOLD` (บ้านต่อเติม+นั่งร้าน), `TOUCAN` ; เนื้อหาเพิ่ม 'ประโยคที่ควรใส่ในสัญญา/ใบส่งของ' ; panel ฝั่ง right ให้วาง DOC ที่ x≥118 y≥70 (บับเบิลบังมุมซ้ายบน)
  - ปก examples/b55.py + run55.py ; ป.พ.พ. ยังว่าง: 1–149 (ส่วนใหญ่ บุคคล/นิติบุคคล), 177, 194, 197, 201, 209–211 (เจ้าหนี้ผิดนัด), 245, 252, 297, 301, 304, 309–313 (ลูกหนี้ร่วม/เจ้าหนี้ร่วม), 317–319, 323, 330, 332, 335, 337, 343, 347, 373, 389–450 (บางส่วน), 642, 706, 727, 735, 740–743, 751–755, 773, 781–796, 962–985, 1004+ (บางส่วน)
- ชุด 422–426 ป.พ.พ. (เจ้าหนี้ผิดนัด ลูกค้าไม่มารับ/ส่งแบบช้า 209–211, 323, 330 ; จ่ายผิดคน/ผู้ถือใบเสร็จ/ถูกอายัดแล้วจ่าย/หนี้ตามเขาสั่ง 309–313, 317–319 ; หักกลบหลังถูกอายัด/ต่างสถานที่/สิทธิยึดไม่ได้โอนไม่ได้ 304, 343, 347 ; ข้อยกเว้นความรับผิดโมฆะ/พ้นวิสัยเลิกสัญญา/กำหนดเวลาให้เลือกเลิก/สิทธิเลิกระงับ/หลายคนต้องเลิกพร้อมกัน 373, 389, 390, 392–394 ; ตัวการรับผิดในละเมิดของตัวแทน/ฝ่าฝืนกฎคุ้มครองสันนิษฐานผิด/แพ่งไม่ผูกอาญา 422, 424, 427) ใช้ท่าไปแล้ว: up+cry+cup+lean, point+smile+cal+spin, cross+hmm+money+peek, bow+star+clip+bob, scratch+think+pen+sway, wave+laugh+mag+peek, thumb+sad+shield+lean, palm+firm+coin+hop, chin+wink+money+breathe, open+cry+phone+bob, cover+hmm+cal+spin, cheer+relief+clip+lean, point+star+umbrella+sway, up+firm+sign+peek, bow+laugh+coin+shake, wave+cry+cal+hop, open+smile+shield+peek, cross+wink+phone+lean, chin+hmm+money+hop, thumb+relief+mag+spin
  - สิ่งที่พัฒนา: gx.py เพิ่ม `RECEIPTSLIP` (ใบเสร็จขอบหยัก), `TRIO` (คนกลุ่มเล็ก), `SNAIL` ; เนื้อหาเพิ่มข้อ 'สถานการณ์กลับด้าน' (ร้านเป็นอีกฝ่าย) ; หัวข้อชนกับคู่มือเดิม (shared-order-split, set-off-debt) → เปลี่ยนมุม
  - ปก examples/b56.py + run56.py
- ชุด 322–326 (พยานบุคคลเบิกความ/บันทึกถ้อยคำ, คืนค่าขึ้นศาล/ค่าบังคับคดี, วางเงินต่อศาล, ชี้สองสถาน/แถลงปิดคดี, คำแก้อุทธรณ์/อำนาจศาลอุทธรณ์) ใช้ท่าไปแล้ว: wave+worried+mic+sway, tap+think+card+sway, palm+shock+notebook+stomp, nod+relief+pen+hop, ok+hopeful+cash+bob, palm+think+cash+sway, grip+shock+coin+stomp, thumb+relief+table+hop, nod+focus+pen+tiptoe, tap+think+bottle+sway, grip+shock+envelope+stomp, thumb+relief+gavel+hop, rub+hopeful+coin+lean, count+think+coin+sway, grip+shock+receipt+stomp, fold+relief+scale+duck, count+focus+clip+lean, tap+think+wrench+sway, palm+shock+gavel+stomp, fist+relief+mic+hop
- ชุด 317–321 (ขาดนัดพิจารณาวันสืบพยาน, ผู้เชี่ยวชาญ/ตรวจสถานที่/สืบพยานไว้ก่อน, ต้นฉบับอยู่กับอีกฝ่าย/คัดค้านเอกสาร, แก้คำพิพากษาพิมพ์ผิด/ถึงที่สุด, ขออนุญาตฎีกา) ใช้ท่าไปแล้ว: cover+shock+calendar+tilt, grip+shock+car+stomp, palm+think+gavel+lean, fold+relief+envelope+duck, nod+focus+helmet+sway, tap+think+tile+sway, palm+shock+mag+stomp, pray+relief+camera+hop, elbow+focus+folder+lean, count+think+receipt+sway, palm+shock+fire+stomp, thumb+relief+stamp+hop, rub+hmm+pen+tilt, nod+focus+pen+sway, palm+shock+gavel+stomp, cheer+relief+calendar+hop, pray+hopeful+scroll+breathe, count+focus+cup+sway, palm+think+scale+lean, cheer+relief+gavel+hop
  - สิ่งที่พัฒนา: `SCROLL` (ม้วนคำพิพากษามีตรา) + `SAFEBOX` (ตู้เซฟเอกสาร) + `RACCOON` (แรคคูนหน้ากากดำ หางลาย) ใน gx.py; ปก `b35.py`
  - ใช้แล้ว: ป.วิ.พ. 97–99, 101–103, 122–127, 143, 144, 146, 147, 202–206, 247–249, 251, 252
  - ยังว่าง ป.วิ.พ.: 63–69, 80–83, 89, 91, 92, 96, 100, 105–121, 128–137, 139, 140, 150–160, 182–188, 226–228, 233–246 ; ชุดถัดไปอาจเปลี่ยนไปกฎหมายอื่น (เช่น คุ้มครองผู้บริโภค 18/21/1/57 ทวิ/60, การแข่งขันทางการค้า 85–92)
- ชุด 312–316 (เลือกศาลฟ้อง, การส่งหมายถึงร้าน/ปิดหมาย 15 วัน, ต้นฉบับ-สำเนา/ห้ามสืบแก้เอกสาร/พยานรู้เห็นเอง, คำพิพากษา/ค่าฤชาธรรมเนียม, อุทธรณ์ 1 เดือน/≤5 หมื่น/ทุเลา) ใช้ท่าไปแล้ว: wave+worried+envelope+peek, nod+think+tyre+sway, grip+shock+pen+stomp, pray+hopeful+calendar+duck, point+think+map+sway, tap+focus+map+lean, palm+shock+globe+stomp, fold+relief+folder+duck, chin+hmm+receipt+lean, count+focus+brick+sway, rub+shock+coin+stomp, both+relief+scale+hop, open+worried+folder+tilt, pinch+think+flower+sway, palm+shock+pen+stomp, thumb+relief+mic+hop, fist+firm+calendar+tiptoe, palm+think+ac+sway, grip+shock+calendar+stomp, fold+relief+lock+duck
  - สิ่งที่พัฒนา: `JSCALE` (ตาชั่งเอียงมีป้าย) + `STAIRS` (บันไดชั้นศาล) + `PENGUIN` (เพนกวินถือซอง) ใน gx.py; ปก `b34.py`
  - ระวัง: ป.วิ.พ. มาตรา 2–5 ในคลังเป็นของ พ.ร.บ.ให้ใช้ ไม่ใช่ตัวประมวล → อย่าอ้าง ม.4 ; ชื่อหัวข้อ ≤95 และ say ≤26 ยังเป็นจุดที่พลาดบ่อย ให้เขียนสั้นตั้งแต่แรก
  - ใช้แล้ว: ป.วิ.พ. 4 ทวิ, 4 ตรี, 7, 8, 10, 70, 73, 73 ทวิ, 74, 76–79, 93–95, 104, 141, 142, 145, 161, 162, 167, 224, 225, 229, 231, 232
- ชุด 307–311 (ภาระพิสูจน์/บัญชีระบุพยาน, โจทก์ร่วม/ใบแต่งทนาย/อำนาจทนาย, คดีกลุ่มชั้นพิจารณา/อายุความ, รางวัลทนาย ≤30%/ค่าธรรมเนียม/อุทธรณ์, ทิ้งฟ้อง-ถอนฟ้อง-แก้คำฟ้อง) ใช้ท่าไปแล้ว: elbow+hopeful+handshake+bob, wave+think+gas+sway, nod+focus+pen+tiptoe, hip+relief+key+breathe, rub+hmm+coin+tilt, elbow+think+box+sway, count+focus+receipt+tiptoe, fist+hopeful+gavel+hop, count+focus+clip+lean, palm+think+sign+sway, grip+shock+calendar+stomp, fold+relief+folder+duck, tap+focus+hourglass+lean, count+think+phone+sway, palm+shock+mag+stomp, fold+relief+calendar+duck, open+think+pen+breathe, pinch+shock+wrench+tilt, palm+hopeful+handshake+lean, nod+relief+pen+hop
  - สิ่งที่พัฒนา: `EVIBAG` (ถุงหลักฐานมีป้ายเลข) + `PCT` (วงเปอร์เซ็นต์) + `KOALA` (โคอาล่าเกาะกิ่ง) ใน gx.py; ปก `b33.py`
  - ระวัง: lint หา ป.วิ.พ. 222/43 ไม่เจอ (sec2 เจอ) → อย่าอ้าง 222/43 ; ชื่อฉาก cfoffice/cfcourt ซ้ำของเก่า
  - ใช้แล้ว: ป.วิ.พ. 55, 59–62, 84, 84/1, 85–88, 90, 172, 174–176, 178, 180, 181, 222/20, 222/22, 222/23, 222/30, 222/33, 222/34, 222/37, 222/38, 222/45, 222/47–222/49
  - ยังว่าง: ป.วิ.พ. 1–54 (เขตศาล การส่งเอกสาร), 63–83, 89, 91–137 (พยาน), 139–170 (คำพิพากษา), 182–188 (ชี้สองสถาน), 202–252 (อุทธรณ์ฎีกา) ฯลฯ
- ชุด 302–306 (คดีกลุ่ม: อยู่หรือออก/สิทธิสมาชิก, ถอนฟ้อง-ยอมความ-เข้าแทนที่โจทก์, ชนะแล้วยื่นขอรับชำระหนี้ ; หาทรัพย์ลูกหนี้หลังชนะคดี ; แบ่งแยกที่ดิน/สอบเขต) ใช้ท่าไปแล้ว: palm+hmm+scale+tilt, count+think+pie+sway, up+focus+gavel+lean, fist+hopeful+pen+duck, rub+think+mag+peek, tap+think+coffee+sway, grip+hmm+calendar+stomp, both+relief+mag+hop, cheer+joy+coin+hop, ok+smile+dryer+sway, elbow+focus+clip+tiptoe, palm+relief+scale+breathe, chin+think+envelope+sway, nod+focus+envelope+bob, pinch+firm+pen+stomp, thumb+relief+folder+hop, wave+focus+map+lean, point+think+map+sway, grip+shock+flag+stomp, thumb+relief+deed+hop
  - สิ่งที่พัฒนา: `PLOTS` (ที่ดินแบ่งแปลงมีหมุด) + `TRIPOD` (กล้องรังวัด) + `FOX` (จิ้งจอกหางพุ่ม หน้ากากขาว) ใน gx.py; ปก `b32.py`
  - ใช้แล้ว: ป.วิ.พ. 222/15–222/19, 222/24–222/29, 222/35, 222/36, 222/39–222/42, 222/44, 222/46, 271, 273, 277 ; ประมวลกฎหมายที่ดิน 69, 70, 75, 79
  - ยังว่าง: ป.วิ.พ. 222/2–222/6, 222/11, 222/20–222/23, 222/30–222/34, 222/37, 222/38, 222/43, 222/45, 222/47–222/49 ; ประมวลกฎหมายที่ดิน 76, 84 และหมวดต้นๆ 1–58
- ชุด 297–301 (ขาดนัดยื่นคำให้การ/ขาดนัดพิจารณา, คดีมโนสาเร่/รวบรัด, วิธีการชั่วคราวก่อนพิพากษาฝั่งจำเลย, อายัดที่ดิน 30 วัน/จดไถ่ถอน, ฟ้องคดีแบบกลุ่ม) ใช้ท่าไปแล้ว: cover+worried+envelope+tilt, palm+shock+ac+lean, grip+think+scale+stomp, fold+hopeful+calendar+duck, ok+smile+receipt+bob, count+think+tile+sway, wave+focus+notebook+tiptoe, thumb+relief+gavel+hop, hip+focus+shield+breathe, palm+think+globe+sway, grip+shock+lock+stomp, cheer+joy+calendar+hop, both+hopeful+megaphone+bob, nod+think+phone+sway, elbow+focus+folder+tiptoe, cheer+relief+coin+hop, point+firm+deed+lean, tap+calm+deed+sway, grip+shock+lock+stomp, thumb+relief+stamp+hop
  - สิ่งที่พัฒนา: `COURTHOUSE` (อาคารศาลมีเสา) + `CROWD` (กลุ่มคนตัวเล็ก) + `PANDA` (แพนด้ากอดไผ่) ใน gx.py; ปก `b31.py`
  - ใช้แล้ว: ป.วิ.พ. 190, 190 ทวิ–จัตวา, 191, 192, 193 ตรี, 193 จัตวา, 194, 196, 198, 198 ทวิ, 198 ตรี, 199 ทวิ, 200, 222/1, 222/7–222/10, 222/12–222/14, 253, 253 ทวิ, 256, 258–262, 264 ; ประมวลกฎหมายที่ดิน 71, 74, 77, 80, 83
  - ยังว่าง: ป.วิ.พ. 222/2–222/6, 222/11, 222/15–222/49 (คดีกลุ่มต่อ), 271, 273, 277 ; ประมวลกฎหมายที่ดิน 69, 70, 75, 76, 79, 84 ฯลฯ
  - ระวัง: coverLines บรรทัดเดียวยาว 10 ตัวอักษรไทยเกินที่ 390px ได้ (เช่น "ร้านเสียหายเหมือนกัน")
- ชุด 292–296 (สินค้าถูกสั่งทดสอบ/ห้ามขายชั่วคราว, แผนเรียกคืน 7 วัน/ประกาศ, ผลคัดค้านเครื่องหมาย/เป็นที่สุด, โอนแบรนด์แล้วจดคล้าย/ตรารับรอง, ขึ้นทะเบียนธุรกิจบริการอิเล็กทรอนิกส์/e-KYC) ใช้ท่าไปแล้ว: count+firm+box+lean, elbow+focus+clip+tiptoe, shrug+shock+megaphone+spin, pray+hopeful+calendar+duck, thumb+worried+battery+tilt, wave+think+box+sway, palm+focus+flask+breathe, up+relief+report+hop, pinch+hopeful+key+peek, open+think+cookie+lean, rub+shock+folder+tilt, ok+calm+badge+breathe, fist+firm+stamp+bob, nod+think+jar+sway, grip+sad+calendar+stomp, cheer+joy+certificate+hop, tap+focus+phone+spin, count+think+laptop+sway, grip+shock+folder+stomp, thumb+relief+idcard+hop
  - สิ่งที่พัฒนา: `FACESCAN` (มือถือสแกนหน้า) + `RECALL` (กล่องเรียกคืนมีลูกศรวน) + `OTTER` (นากถือเปลือกหอย หนวด แก้ม) ใน gx.py; ปก `b30.py`
  - เปลี่ยนกฎหมาย: ภาษีที่ดิน/โรงแรม/ควบคุมอาคาร/ล้มละลายใกล้หมด → ใช้ คุ้มครองผู้บริโภค 29/x, เครื่องหมายการค้า, ธุรกรรมอิเล็กทรอนิกส์ 33/1–34/4
  - ใช้แล้ว: คบ. 20/1, 29/1, 29/8, 29/9, 29/11, 29/14–29/17, 56/4, 56/6 ; TM 32, 33, 34, 39, 41, 51/1, 52/1, 81, 90, 106, 112 ; ธุรกรรมฯ 33/1, 34/1–34/4
  - ยังว่าง (ใช้ได้): คบ. 18, 21/1, 57 ทวิ, 60 ; การแข่งขันทางการค้า 85–92 (เช็กตัวบทก่อน) ; ป.วิ.พ. ยังเหลือเยอะ (ใช้ไป 86/546) ; ประมวลกฎหมายที่ดิน 9/194
  - เช็กชื่อฉากซ้ำด้วยสคริปต์ค้น guide-scenes.js + panels/cards/guides ทั้งหมดก่อนรัน
- ชุด 287–291 (ภาษีที่ดินร้านสปา/จ่ายไปรษณีย์/คืนเงิน, รีสอร์ตถูกเตือน-พักใช้-อุทธรณ์, ร้านเป็นเจ้าหนี้/ประชุม-กรรมการเจ้าหนี้, อาคารพาณิชย์โทษสองเท่า, อู่ยึดหน่วงรถที่ถูกยึด/งดบังคับคดีกลับมา) ใช้ท่าไปแล้ว: grip+worried+bell+tilt, ok+calm+folder+breathe, palm+shock+envelope+stomp, fold+hopeful+gavel+peek, pinch+smile+receipt+hop, open+calm+leaf+sway, rub+focus+envelope+lean, both+joy+coin+duck, elbow+think+ledger+bob, count+focus+brick+lean, up+proud+gavel+spin, thumb+relief+clip+hop, hip+firm+plan+stomp, tap+think+plan+sway, pinch+shock+cone+tilt, cover+hopeful+folder+duck, wave+think+wrench+breathe, grip+focus+wrench+lean, shrug+smile+envelope+tiptoe, pray+calm+hourglass+bob
  - สิ่งที่พัฒนา: `CHEQUE` (เช็คธนาคาร) + `DOUBLE` (ป้าย ×2 ซ้อนเงา) + `HEDGEHOG` (เม่นมีหนาม แก้ม ตาวาว) ใน gx.py; ปก `b29.py`
  - ระวัง: ชื่อฉากต้องแก้ทั้งใน S("...") ของ mk (เครื่องหมายคำพูดคู่) และ P('...') ใน g — ccyard ซ้ำกับฉากเก่าแล้วหน้าเว็บโชว์ภาพเรื่องอื่น lint ไม่จับ
  - coverLines อย่าตัดกลางคำ (เช่น "พักใบ / อนุญาต") — แก้ JSON ด้วย python เพราะ sed ไม่ตรงรูปแบบ
  - ใช้แล้ว: ภาษีที่ดินฯ 39, 48, 49, 51, 53, 55, 67, 71, 72 ; โรงแรม 17, 18, 40–43 ; ล้มละลาย 32, 33, 38–41 ; ควบคุมอาคาร 27, 28, 69–71 ; ป.วิ.พ. 280, 291, 322
  - ยังว่าง: ภาษีที่ดินฯ 8, 34, 36, 50, 63 ; ล้มละลาย 44 ; ควบคุมอาคาร 65, 66 (อัตราโทษในคลังตัด)
- ชุด 282–286 (ทำลายเครื่องจักร/ทรัพย์สาธารณะ, กดค่าแรง 10 คน/ชักจูงคนจิตอ่อนแอขาย, สิทธิผู้มีส่วนได้เสียบังคับคดี/ยึดเกิน, อุทธรณ์คำสั่งควบคุมอาคาร 30 วัน, พิทักษ์ทรัพย์: หมายค้น จดหมาย คดีค้าง ไต่สวนเปิดเผย) ใช้ท่าไปแล้ว: chin+firm+wrench+tilt, pinch+focus+wrench+hop, rub+shock+gear+stomp, thumb+hopeful+camera+lean, ok+focus+folder+tiptoe, nod+think+mag+breathe, hip+shock+tag+stomp, pray+hopeful+gavel+peek, tap+hmm+envelope+peek, count+hmm+mag+tilt, palm+focus+gavel+breathe, pray+calm+notebook+bob, open+hmm+coin+spin, elbow+focus+clip+sway, cover+sad+bag+duck, fist+relief+receipt+bob, chin+hopeful+plan+duck, wave+calm+badge+lean, grip+shock+cone+spin, both+relief+envelope+hop
  - สิ่งที่พัฒนา: `ENVFLY` (ซองจดหมายลอยตามเส้นโค้ง) + `DAYRING` (วงนับวันถอยหลัง) + `SQUIRREL` (กระรอกถือลูกโอ๊ก) ใน gx.py; ปก `b28.py` (มีกระรอก 2 ปก)
  - ระวัง: แก้ coverLines แล้วต้อง restart mini2 ก่อนรัน covertitle_check ไม่งั้นยังเห็นค่าเก่า
  - ใช้แล้ว: ป.อ. 344, 346, 359, 360 ; ป.วิ.พ. 285, 287, 288, 294, 295 ; ควบคุมอาคาร 45, 48, 52 ; ล้มละลาย 20, 21, 25, 26, 36, 42, 43
  - ยังว่าง: ป.วิ.พ. 280, 286, 291, 322 ; ล้มละลาย 32, 33, 38–41, 44 ; ควบคุมอาคาร 27, 28, 65, 66, 69–71
- ชุด 277–281 (ภาษีที่ดินร้าน/แบบประเมิน, ภาษีที่ดินค้าง/ยึด, ผู้จัดการโฮสเทล, ผู้ควบคุมงานก่อสร้าง/ใบแทน, พิทักษ์ทรัพย์เด็ดขาด 24ชม./7วัน) ใช้ท่าไปแล้ว: fold+shock+money+breathe, grip+sad+hourglass+bob, palm+wink+stamp+lean, up+joy+coin+duck, point+calm+cal+hop, tap+think+folder+sway, both+proud+mag+tiptoe, cheer+relief+receipt+peek, point+calm+helmet+hop, tap+think+plan+sway, both+shock+helmet+lean, up+relief+folder+duck, wave+smile+key+sway, nod+happy+badge+bob, count+focus+clip+tiptoe, shrug+relief+wrench+peek, fold+worried+ledger+breathe, palm+shock+key+bob, count+focus+hourglass+tiptoe, up+hopeful+gavel+peek
  - สิ่งที่พัฒนา: `BELL` (กริ่งเคาน์เตอร์) + `CRANE` (ทาวเวอร์เครน) + `OWL` (นกฮูกมีขนอก แก้ม ตาวาว) ใน gx.py; ปก `b27.py` (ปกโฮสเทลมีนกฮูก)
  - ระวัง: `calendar6` มีป้าย "6 เดือน" ติดมา อย่าใช้แทนวันที่ ให้ใช้ SEAL แทน
  - ใช้แล้ว: ภาษีที่ดินฯ 7,9,10,32,33,35,44,45,58–62,64–66 ; โรงแรม 26,28,30–34,37,38 ; ควบคุมอาคาร 29–31,35–39 ; ล้มละลาย 19,23,28,30,31,34,37
- ชุด 272–276 (เจ้าพนักงานบังคับคดีมาที่ร้าน, ทรัพย์ชื่อคนอื่น/ห้ามยึดเกิน, ผลของการยึด/ยึดหุ้น-ใบอนุญาต, อายัดเงินลูกค้าของลูกหนี้, วิ่งราว vs ชิงทรัพย์) ใช้ท่าไปแล้ว: pray+star+bell+tiptoe, hip+calm+key+spin, point+hmm+umbrella+hop, cheer+wink+folder+breathe, palm+think+stamp+sway, tap+relief+shield+tilt, both+sad+lamp+peek, ok+laugh+cal+bob, cover+joy+key+lean, grip+shock+receipt+tiptoe, fold+calm+mag+duck, wave+firm+coin+breathe, elbow+proud+receipt+spin, chin+wink+phone+hop, rub+star+money+lean, up+hmm+clip+peek, open+sad+bag+tilt, thumb+shock+phone+stomp, pinch+relief+shield+sway, fist+think+lamp+breathe
  - สิ่งที่พัฒนา: `MONEYFLOW` (เหรียญไหลตามลูกศร) + `SIREN` (ไฟไซเรนกระพริบ) + `GOAT`; ปก `b26.py`
  - ระวัง: layout right คนอยู่ x≈60 → อย่าวาง DOC ที่ x 12 (โดนคนบัง) ให้ใช้ x≥100
  - ป.วิ.แพ่ง ที่ยังว่าง: 280, 285–288, 291, 294–295, 322 ; ป.อาญา ที่ยังว่าง: 344, 346, 359–360
- ชุด 267–271 (รับของโจร/ร้านมือสอง, บุกรุกที่ร้าน/ย้ายหมุด, แกล้งพังเคลมประกัน/ทำลายของจำนำ, งด/ถอนการบังคับคดี, ยึดสต็อก-รถ-ตั๋วเงิน-แบรนด์-สิทธิเช่า) ใช้ท่าไปแล้ว: wave+shock+mag+tiptoe, grip+hmm+bag+lean, both+firm+receipt+bob, pray+relief+phone+sway, fold+star+map+peek, tap+sad+stamp+duck, elbow+wink+key+breathe, cheer+hmm+pen+tilt, rub+calm+umbrella+hop, hip+shock+lamp+stomp, point+joy+clip+tiptoe, ok+sad+shield+spin, up+firm+hourglass+tilt, cover+think+cal+breathe, chin+relief+money+duck, palm+laugh+bell+hop, thumb+star+folder+lean, open+hmm+coin+sway, pinch+proud+umbrella+peek, fist+calm+map+bob
  - สิ่งที่พัฒนา: (1) `gx.py` เพิ่ม `TAPE` (เทปกั้นลายทแยงมีข้อความ) + `STICKER` (สติกเกอร์วงกลมขอบหยัก) (2) เริ่มใช้ ป.อาญา (357, 362, 363, 347, 349, 351) และ ป.วิ.แพ่ง (289–297, 303–310) ในหมวดนี้ (3) ปก `b25.py`
  - ชื่อกฎหมายใน cite: "ประมวลกฎหมายอาญา" / "ประมวลกฎหมายวิธีพิจารณาความแพ่ง" (ตรงตามที่ guide เดิมใช้)
  - ป.อาญา ที่ยังว่าง (เกี่ยวกับร้าน): 336 (วิ่งราว), 339 (ชิงทรัพย์), 344, 346, 359–360; ป.วิ.แพ่ง ที่ยังว่าง: 278–288, 291, 294–295, 298–300, 305, 307, 311–315, 317–322 (อายัด/ขายทอดตลาด/เงินที่ได้จากการขาย) — อ่านตัวบทด้วย sec2.py "วิธีพิจารณาความแพ่ง"
- ชุด 262–266 (ผู้รับไม่รับของ/ขนส่งหลายทอด, ประกันสินค้าระหว่างขนส่ง, ประกันไฟไหม้ร้าน/ลดเบี้ย, สัตว์บุกสวน/ใช้กำลังป้องกันสิทธิ, ซ่อมร้านเช่า/ช่างหาวัสดุ) ใช้ท่าไปแล้ว: hip+relief+phone+sway, both+wink+bag+breathe, tap+shock+cup+lean, cheer+calm+receipt+peek, grip+star+umbrella+tiptoe, fold+hmm+map+bob, rub+joy+pen+spin, point+firm+clip+stomp, up+laugh+shield+peek, cover+sad+money+hop, wave+relief+folder+tiptoe, elbow+star+hourglass+sway, chin+shock+key+duck, palm+proud+lamp+tilt, open+wink+bell+bob, pray+calm+cal+peek, ok+hmm+stamp+hop, pinch+sad+map+lean, fist+joy+coin+tiptoe, thumb+calm+mag+tilt
  - สิ่งที่พัฒนา: (1) `gx.py` เพิ่ม `ROUTE` (เส้นทางมีหมุดและชื่อจุด) + `CRACK` (รอยแตก) (2) ใช้มาตราว่างกลุ่มรับขน/ประกันภัย/ป้องกันสิทธิ/เช่า-จ้าง (3) ปก `b24.py`
  - บทเรียน: หัวข้อ (title) ให้ร่างไม่เกิน ~85 ตัวอักษรตั้งแต่แรก (ชุดนี้เกิน 95 ถึง 5 เรื่อง เสียรอบแก้), say ≤ 26 ความกว้าง, ชื่อฉากซ้ำ `shmeeting` → `shstaffroom`
  - มาตรา ป.พ.พ. ที่ยังว่าง: 480, 493, 501, 536, 642, 706, 727, 751–755, 773 (ส่วนใหญ่ซ้ำแนวที่ทำแล้ว) → ชุดต่อไปควรใช้กฎหมายอื่น เช่น ป.วิ.แพ่ง (ยังไม่ถูกอ้างเลยในหมวดนี้: การฟ้องคดีมโนสาเร่ บังคับคดี ยึดทรัพย์ลูกหนี้), ภาษีที่ดินฯ, พ.ร.บ.ล้มละลาย, พ.ร.บ.โรงแรม (ร้านที่พัก), ป.อาญา (ฉ้อโกง/ยักยอกในร้าน) — เช็ก unused ก่อนเสมอด้วยสคริปต์ใน HANDOFF
- ชุด 257–261 (ขอบอำนาจตัวแทนขาย, เลิกตัวแทน/ตัวแทนค้าต่าง, ร้านรับฝากคิดเงิน/ยึดหน่วง, เรียกผู้ค้ำ, คำมั่นจะขาย/ยึดหน่วงราคา/ไม่ตรงตัวอย่าง) ใช้ท่าไปแล้ว: cheer+think+phone+bob, tap+calm+folder+spin, grip+proud+map+peek, hip+wink+coin+lean, rub+hmm+key+tiptoe, point+sad+receipt+sway, both+relief+pen+hop, fold+joy+stamp+duck, open+laugh+umbrella+breathe, chin+firm+bag+tiptoe, pray+shock+lamp+sway, wave+proud+key+stomp, elbow+calm+shield+hop, palm+sad+clip+lean, ok+think+coin+peek, up+wink+hourglass+bob, thumb+relief+cal+spin, cover+joy+receipt+tilt, pinch+hmm+money+breathe, fist+star+bag+lean
  - สิ่งที่พัฒนา: (1) `gx.py` เพิ่ม `HANGTAG` (ป้ายแขวนแกว่ง cm-bob) + `RIBBON` (ริบบิ้นแบนเนอร์) (2) ใช้มาตรา ป.พ.พ. ที่ยังว่างกลางเล่ม (ตัวแทน/ฝากทรัพย์/ค้ำประกัน/ซื้อขาย) (3) ปก `b23.py`
  - ระวังชื่อฉากซ้ำ: `soyard` ซ้ำแล้ว (เปลี่ยนเป็น socarlot) — ตั้งชื่อฉากให้มีคำเฉพาะเรื่องเสมอ
  - มาตรา ป.พ.พ. ที่ยังว่าง (ใช้ต่อได้): 451–452 (ป้องกันสิทธิ/จับสัตว์ที่มาทำเสียหาย), 480, 493, 501, 536, 549, 556, 580, 595, 609, 611, 629, 631, 633 (ผู้รับตราส่งไม่รับของ), 642, 706, 727, 751–755, 773, 862, 864, 868, 871, 876, 883–886, 889 (ประกันภัย)
- ชุด 252–256 (ผลการจดทะเบียนห้าง/บริษัท, จดสัญญาอนุญาตเครื่องหมาย, แบรนด์กลายเป็นคำสามัญ+หนังสือจากกรม, คำสั่งโฆษณา/#โฆษณา, ลายเซ็นอิเล็กทรอนิกส์พื้นฐาน) ใช้ท่าไปแล้ว: cover+think+cal+hop, grip+joy+folder+lean, ok+proud+stamp+tiptoe, hip+firm+key+peek, palm+wink+sign+sway, pinch+relief+pen+bob, both+laugh+shield+duck, wave+think+map+spin, point+joy+umbrella+tiptoe, elbow+hmm+mag+lean, fold+sad+bell+breathe, tap+star+receipt+hop, up+proud+phone+peek, rub+shock+sign+tilt, chin+calm+lamp+stomp, fist+wink+money+sway, bow+joy+phone+breathe, thumb+hmm+pen+spin, open+relief+clip+tiptoe, pray+proud+receipt+duck
  - สิ่งที่พัฒนา: (1) `gx.py` เพิ่ม `CHAT` (มือถือพร้อมบับเบิลแชตอ่านได้) + `CHIP` (แท็กเล็ก #โฆษณา ®) (2) ชุดนี้ข้ามกฎหมายหลายฉบับ (ป.พ.พ./เครื่องหมายการค้า/คุ้มครองผู้บริโภค/ธุรกรรมอิเล็กทรอนิกส์) (3) ปก `b22.py`
  - ระวัง: ชื่อฉาก (scene) ต้องไม่ซ้ำทั้ง repo — `rgoffice` ซ้ำ ต้องเปลี่ยนเป็น `rgbackroom`; CHAT/บับเบิลห้ามอยู่ y<84 (โดน say บัง); ZOOM ข้อความ ≤5 ตัวอักษร
  - มาตราที่ยังว่าง (ใช้ต่อได้): ป.พ.พ. 1142, 1246–1248; คุ้มครองผู้บริโภค 53–55 (โทษฉลาก/คนรับจ้างพิมพ์ฉลาก), 60–63; ลิขสิทธิ์ 46–48, 53, 57–59, 72, 77–78; สิทธิบัตร 7–8, 13, 23, 25, 52, 55, 64–71, 79–81, 83, 88; แข่งขันทางการค้า 53, 71, 85–92; เครื่องหมายการค้า 11, 32, 34, 39, 41
- ชุด 247–251 (ขอผู้ตรวจ/ประชุมผู้ถือหุ้นสะดุด/ปิดปีบัญชี-ทุนสำรอง/ตั้งผู้ชำระบัญชี/ปิดจบชำระบัญชี) ใช้ท่าไปแล้ว: cheer+shock+mag+sway, palm+hmm+folder+tiptoe, point+relief+key+breathe, cover+star+clip+lean, wave+calm+bell+tilt, grip+sad+cal+hop, fold+proud+phone+bob, thumb+wink+umbrella+stomp, chin+joy+coin+tiptoe, hip+think+receipt+sway, both+calm+money+peek, ok+shock+folder+breathe, pray+laugh+key+lean, up+sad+stamp+spin, elbow+wink+pen+duck, tap+proud+cup+bob, rub+relief+map+peek, open+firm+bag+lean, pinch+joy+lamp+tilt, fist+sad+hourglass+hop
  - สิ่งที่พัฒนา: (1) `gx.py` เพิ่ม `ZOOM` (แว่นขยายซูมตัวเลขสำคัญ) + `SEAL` (ตรายางเอียง อนุมัติ/จดแล้ว) (2) เนื้อหามีโครงรายงานประจำปี/รายงานชำระบัญชีพร้อมตัวเลข และหนังสือร้องขอผู้ตรวจ (3) ปก `b21.py`
  - ระวัง: STEPS ห้ามวางที่ y<100 ฝั่งที่มี bubble/caption (ตอน 3 แบบ center caption บังแถบ)
  - มาตรา ป.พ.พ. บริษัท/หุ้นส่วนที่ยังว่าง: 1013–1024 (ผลการจดทะเบียน/ประกาศราชกิจจาฯ/สมุดบัญชีเป็นพยาน), 1142, 1229–1235 (ควบรวม), 1242, 1246–1248
- ชุด 242–246 (ตั้งบริษัท/ประชุมตั้งบริษัท/ค่าหุ้นค้าง/ประชุมกรรมการ/ลงหุ้นด้วยแรง-ทรัพย์) ใช้ท่าไปแล้ว: thumb+think+folder+hop, cross+joy+pen+lean, hip+relief+mag+bob, wave+proud+sign+tiptoe, palm+shock+cal+lean, chin+star+clip+breathe, fist+calm+coin+peek, pinch+wink+stamp+sway, open+hmm+receipt+bob, tap+sad+money+spin, both+star+key+duck, elbow+laugh+bell+breathe, grip+calm+phone+tiptoe, bow+think+umbrella+shake, ok+wink+lamp+hop, rub+proud+hourglass+tilt, fold+joy+bag+peek, pray+hmm+shield+stomp, up+relief+cup+tilt, cheer+firm+map+sway
  - สิ่งที่พัฒนา: (1) `gx.py` เพิ่ม `STEPS` (แถบขั้นตอนบอกว่าอยู่ขั้นไหน ใช้ต่อเนื่อง 3 ตอน), `VOTE` (ป้ายนับเสียง), `TABLE` (โต๊ะประชุม+เก้าอี้ว่างสื่อองค์ประชุม) (2) เนื้อหามีตัวอย่างหนังสือเรียกค่าหุ้น/มอบอำนาจ/ข้อตกลงลงหุ้น (3) ปก `b20.py`
  - **สำคัญ**: seed `krisdika-core-2021.json` เก่ากว่าตัวบทจริงบางมาตรา (เช่น ม.1097 seed=3 คน, จริง=2 คนตามฉบับที่ 23) → อ่านตัวบทล่าสุดด้วย `fast/sv2.py W มาตรา...` (อ่านจาก laws/ป.พ.พ.-v2.txt) แล้วบอกผู้ใช้ว่าคลังยังเป็นฉบับเก่า
  - มาตรา ป.พ.พ. ที่ยังว่าง (เลือกใช้ต่อ): 1013–1024 (ทะเบียนหุ้นส่วนบริษัท), 1142, 1170, 1172, 1177, 1179–1181, 1183–1184, 1186, 1188, 1191–1193 (ประชุมใหญ่), 1198–1199, 1202, 1204, 1206, 1212–1219 (บัญชี/ทุนสำรอง), 1229–1235, 1242, 1244–1274 (ควบรวม/ชำระบัญชี) — ตรวจด้วยสคริปต์หา unused ใน HANDOFF ชุดนี้
- ชุด 237–241 (ตั๋วแลกเงิน: ออกตั๋ว/รับรองเบี่ยงบ่าย/ข้อต่อสู้ผู้ทรง/แก้หน้า/ไล่เบี้ยได้เท่าไร) ใช้ท่าไปแล้ว: point+think+pen+tiptoe, cheer+proud+stamp+bob, grip+wink+map+breathe, both+joy+receipt+lean, fold+laugh+hourglass+shake, hip+sad+mag+hop, elbow+relief+shield+stomp, rub+firm+lamp+peek, tap+hmm+folder+duck, palm+calm+key+spin, ok+cry+bag+tilt, pray+star+clip+sway, pinch+proud+umbrella+breathe, wave+joy+cal+duck, fist+think+receipt+peek, bow+shock+coin+tiptoe, chin+wink+money+stomp, thumb+sad+phone+tilt, open+star+bell+lean, cover+laugh+cup+hop
  - สิ่งที่พัฒนา: (1) `gx.py` เพิ่ม `BILL` (ตั๋วแลกเงินมีต้นขั้วรอยปรุ+หมายเหตุ) และ `FLOW` (ลูกศรประบอกเส้นทางตั๋ว/เงิน มีป้าย) (2) เนื้อหามีตัวอย่างคำนวณจริง (ดอกเบี้ย 5%) + ร่างตั๋วครบ 8 รายการ (3) ปก `b19.py` มีตัวช่วย `bl()` วาดตั๋ว
  - ระวัง: FLOW อย่าวางทับหัวคน (x 40–90 ฝั่งซ้าย / 290–340 ฝั่งขวา)
- ชุด 232–236 (จำนอง/จำนำสิทธิ/ตั๋วเงิน/เช็ครับรอง) ใช้ท่าไปแล้ว: palm+star+mag+breathe, cover+hmm+pen+hop, thumb+relief+shield+peek, chin+laugh+money+sway, up+cry+coin+spin, open+wink+cal+lean, wave+sleepy+umbrella+bob, bow+smile+phone+shake, fist+proud+key+lean, pray+firm+folder+tilt, grip+shock+bell+duck, rub+joy+cup+stomp, elbow+calm+bag+sway, both+hmm+receipt+tiptoe, scratch+wink+hourglass+bob, ok+relief+map+breathe, hip+star+stamp+peek, tap+laugh+key+hop, fold+calm+clip+tilt, pinch+shock+lamp+stomp
  - สิ่งที่พัฒนาในชุดนี้: (1) ตัวช่วยฉากใหม่ `examples/gx.py` → `GLOW` (แสงนุ่มรอบเอกสารสำคัญ) + `SKYWIN` (หน้าต่างบอกเวลา day/dusk/night) (2) ทุกเรื่องมี "ตัวอย่างข้อความ/หนังสือ" ที่คัดลอกไปใช้ได้ + เช็กลิสต์ (3) ปกพาสเทลไฟล์ `examples/b18.py` + `run18.py` (ต้องตั้ง tagc เอง) 
  - มาตราที่ยังว่างในคลัง (ใช้ต่อได้ หลังชุด 241): 740–743, 962, 965–966, 975–981 (ตั๋วสำรับ), 985, 1004, 1005, 1010, 1011
  - mini2: ต้องรัน `ROOT=/home/claude/vellum-check ADMIN=1 PORT=3410 node /tmp/mini2.mjs` และรีสตาร์ตหลังเพิ่ม JSON
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
  - ถ้าผู้ใช้ไม่ได้ระบุหมวด ให้**ทำหมวดค้าขายและแบรนด์ต่อ** (เรื่องถัดไปคือเรื่องที่ 392) และแตกหัวข้อย่อยให้หลากหลาย เช่น ร้านอาหาร ร้านออนไลน์ ร้านเสริมสวย ร้านซ่อม โรงงานเล็ก แบรนด์ เครื่องหมายการค้า และนำเข้า-ส่งออก
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
