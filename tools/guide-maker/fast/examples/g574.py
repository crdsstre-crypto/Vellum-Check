import sys; sys.path.insert(0,"/home/claude/tools"); sys.path.insert(0,"/home/claude/work")
from pk import *; from fgk import *; from gx import *
o=""
o+=P('rgcheckin','[ภาพประกอบนิทาน ค่ำที่เคาน์เตอร์ต้อนรับบ้านพัก กระดิ่ง บัตรทะเบียนผู้พัก บัตรประชาชนบนเคาน์เตอร์ กุญแจห้อง โทนน้ำตาลไม้กับเหลืองโคม แสงโคมอุ่น] กระดิ่ง บัตรทะเบียน กุญแจ นกฮูก หญิงต้อนรับ (น้องม้วนขวา)',
 [bg('rc1','#fde68a','#fef3c7','#78716c'), '<g transform="translate(222 108)"><rect width="110" height="12" fill="#92400e"/><rect y="12" width="110" height="20" fill="#b45309"/></g><path d="M246 108a8 8 0 0 1 16 0z" fill="#ca8a04"/><rect x="272" y="96" width="28" height="12" rx="2" fill="#fff" stroke="#92400e"/>', ''.join(f'<path d="M{306+i*10} 70v12" stroke="#78350f" stroke-width="2"/><circle cx="{306+i*10}" cy="86" r="3" fill="#ca8a04"/>' for i in range(3)), OWL(340,142,.4),
  LETTER(122,64,'ลงทะเบียนทันที',['บัตรทะเบียนทันทีที่เข้าพัก','ทะเบียนผู้พักใน 24 ชม. (ม.35)','อายุ < 18 พักลำพัง ผู้จัดการเซ็น'],'#92400e',124,-2,1,12),
  FLOOR('#451a03',.08), DUST(7,3474,'#fff',.4), vignette('rc1'), FG('r','#451a03',.12)]+person('W',60,'#f59e0b','#e8b88f','calm'))
o+=P('rgsend','[ภาพประกอบนิทาน เช้าวันจันทร์ ตู้ไปรษณีย์ ซองสำเนาทะเบียนผู้พัก ปฏิทินสัปดาห์ ลังเอกสารเก็บหนึ่งปี โทนแดงไปรษณีย์กับฟ้าใส แสงเช้า] ตู้ไปรษณีย์ ซอง ลังเอกสาร ชายส่งเอกสาร (น้องม้วนซ้าย)',
 [bg('rc2','#e0f2fe','#fee2e2','#a8a29e'), '<g transform="translate(232 72)"><rect width="30" height="54" rx="6" fill="#dc2626"/><rect x="4" y="10" width="22" height="4" fill="#1f2937"/></g>', envelope(276,80,1,'#fff','#fecaca',-6,'#dc2626'), '<rect x="292" y="112" width="40" height="26" fill="#d6a46a" stroke="#92400e"/><text x="312" y="130" text-anchor="middle" font-size="9" fill="#78350f" font-family="sans-serif" font-weight="900">1 ปี</text>',
  LETTER(56,64,'เก็บและส่ง',['เก็บอย่างน้อย 1 ปี (ม.35)','ส่งสำเนานายทะเบียนทุกสัปดาห์','หาย → ขอคัดสำเนา (ม.37)'],'#dc2626',146,-2,1,12),
  FLOOR('#7f1d1d',.05), DUST(6,3475,'#fff',.4), vignette('rc2')]+person('M',318,'#ef4444','#d8a882','calm'))
o+=P('rgfake','[ภาพประกอบนิทาน กลางคืนที่เคาน์เตอร์ แว่นขยายส่องบัตรประชาชน ชื่อในบัตรทะเบียนไม่ตรง เครื่องหมายคำถาม โทนม่วงเข้มกับเขียวมิ้นต์ แสงไฟเคาน์เตอร์] แว่นขยาย บัตร เครื่องหมายคำถาม หญิงตรวจ (น้องม้วนกลาง)',
 [bg('rc3','#3b0764','#a7f3d0','#57534e'), '<g transform="translate(236 84)"><rect width="50" height="32" rx="4" fill="#fff"/><circle cx="14" cy="16" r="7" fill="#cbd5e1"/><rect x="26" y="10" width="18" height="4" fill="#94a3b8"/></g><g transform="translate(296 96)"><circle r="13" fill="none" stroke="#a7f3d0" stroke-width="4"/><path d="M9 9l12 12" stroke="#a7f3d0" stroke-width="5"/></g>', '<text x="320" y="78" font-size="26" fill="#fde68a" font-family="sans-serif" font-weight="900">?</text>',
  STEPCARD(10,84,'1','แขกกรอกเท็จ','คุก ≤ 1 ด. (ม.61)','#7c3aed',ICON('mag','#7c3aed')), ARROW(70,102,'#a7f3d0'),
  STEPCARD(80,84,'2','เว้นช่องว่าง','ปรับ ≤ 10,000 (ม.57)','#0f766e',ICON('pen','#0f766e')),
  NOTEBAR(10,128,'ดูบัตรประชาชน/พาสปอร์ตทุกครั้ง','#7c3aed',132,-2),
  FLOOR('#000',.14), DUST(7,3476,'#a7f3d0',.45), vignette('rc3')]+person('W',292,'#a78bfa','#e8b88f','calm'))
open('/home/claude/work/s574.js','w').write(o)
