import json,sys
CAT={"category":"ค้าขายและแบรนด์","categoryIcon":"🏪","categoryNote":"เปิดร้าน ขายของออนไลน์ แบรนด์ ลิขสิทธิ์ และสัญญากับคู่ค้า","updated":"2026-11-27","reviewed":False,"reviewer":"","video":None}
def T(s): return '"'+json.load(open('server/library/guides/%s.json'%s))['title']+'"'
def S(title,scene,mood,layout,bubble,say,items): return {"title":title,"panel":{"scene":scene,"mood":mood,"layout":layout,"bubble":bubble,"say":say},"items":items}
def Q(q,a,cite): return {"q":q,"a":a,"cite":cite}
def R(*p): return [{"text":a,"note":b} for a,b in p]
def CTA(t): return {"text":t,"button":"ตรวจเอกสารของฉัน →","href":"/"}
def out(g): g.update(CAT); json.dump(g,open(sys.argv[1],'w'),ensure_ascii=False,indent=2); print('ok')
