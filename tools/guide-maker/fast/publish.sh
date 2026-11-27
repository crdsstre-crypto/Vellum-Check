#!/bin/bash
# publish.sh N slug order cover prefix → คัดลอก 4 ไฟล์เข้า repo GitHub, commit, push, อัปเดต HANDOFF
N=$1; S=$2; SRC=/home/claude/src/Vellum-Check-main; R=/home/claude/vellum-check
F="server/library/guides/$S.json public/guide-panels/$S.panels.js public/guide-cards/$S.card.js public/guide-covers/$S.cover.css"
for f in $F; do cp $SRC/$f $R/$f; done
cd $R && git pull -q --rebase origin main 2>/dev/null; git add $F && git commit -qm "Add guide: $S (${CAT:-ค้าขายและแบรนด์} order $3)

${ATTRIB:?ตั้ง ATTRIB เป็นบรรทัด Co-Authored-By/Claude-Session ตามที่ระบบของแชตใหม่กำหนดก่อนรัน}" && git -c push.negotiate=true push -q origin main 2>&1 | tail -1
git log --oneline -1
cp /home/claude/work/g$N.py /home/claude/work/mk${N}c.py /home/claude/work/css$N.css /home/claude/tools/examples/ 2>/dev/null
[ -f /home/claude/tools/HANDOFF.md ] && python3 /home/claude/tools/fin.py $N $S $3 $4 $5 | tail -1; echo "published $S"
