# sec2.py "<ส่วนชื่อกฎหมาย>" 28 "28 ทวิ" ... → พิมพ์ตัวบทมาตรา (เลขอารบิก)
import json,re,sys
seed=json.load(open('/home/claude/src/Vellum-Check-main/server/library/seed/krisdika-core-2021.json'))
th='๐๑๒๓๔๕๖๗๘๙'
def toth(s): return s.translate(str.maketrans('0123456789',th))
L=[l for l in seed['laws'] if sys.argv[1] in l['title']][0]; t=L['text']
for s in sys.argv[2:]:
  m=re.search(r'\nมาตรา\s+'+re.escape(toth(s))+r'(?![๐-๙/])(?!\s(?:ทวิ|ตรี|จัตวา|เบญจ|ฉ|สัตต|อัฏฐ|นว)\b)' if ' ' not in s else r'\nมาตรา\s+'+re.escape(toth(s)),t)
  if not m: print('##',s,'ไม่พบ');continue
  e=re.search(r'\nมาตรา\s+[๐-๙]',t[m.end():]); body=t[m.start():m.end()+(e.start() if e else 1500)]
  print('##',s, re.sub(r'\s+',' ',body)[:int(__import__("os").environ.get("W","1400"))]);print()
