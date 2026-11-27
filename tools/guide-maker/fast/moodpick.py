"""เลือกท่าน้องม้วน 4 ชุด (การ์ด + 3 ตอน) อัตโนมัติ ไม่ซ้ำแขนในเรื่อง และเลี่ยงแขน/หน้าที่ใช้ใน 3 เรื่องล่าสุด
ใช้: python3 moodpick.py <slug> [props ตามเรื่อง คั่นด้วย ,]  -> พิมพ์ 4 mood และบันทึกประวัติใน moods.json"""
import json,sys,os,random
H='/home/claude/tools/moods.json'
ARMS='wave point up thumb cross scratch chin cheer cover palm open bow'.split()
FACES='smile laugh star wink hmm think shock sad cry firm relief sleepy'.split()
MOVES='sway hop lean bob spin peek shake breathe'.split()
PROPS='none clip cal sign pen mag coin phone umbrella shield cup money'.split()
hist=json.load(open(H)) if os.path.exists(H) else []
slug=sys.argv[1]; props=(sys.argv[2].split(',') if len(sys.argv)>2 else [])
recent=[m for h in hist[-3:] for m in h['moods']]
ua=[m.split('+')[0] for m in recent]; uf=[m.split('+')[1] for m in recent]; um=[m.split('+')[3] for m in recent]
r=random.Random(slug)
def pick(pool,used,n,avoid=()):
  c=sorted(pool,key=lambda x:(used.count(x),r.random()))
  out=[]
  for x in c:
    if x in avoid or x in out: continue
    out.append(x)
    if len(out)==n: break
  return out
arms=pick(ARMS,ua,4); faces=pick(FACES,uf,4); moves=pick(MOVES,um,4)
pp=(props+pick(PROPS,[],8))[:4] if props else pick(PROPS,[],4)
moods=['+'.join(t) for t in zip(arms,faces,pp,moves)]
if 'thumb' in moods[3] and 'relief' in moods[3]: moods[3]=moods[3].replace('relief','star')
hist=[h for h in hist if h['slug']!=slug]+[{'slug':slug,'moods':moods}]
json.dump(hist[-12:],open(H,'w'),ensure_ascii=False)
print('\n'.join(moods))
