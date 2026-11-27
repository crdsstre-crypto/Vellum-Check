#!/bin/bash
export HANDOFF=${HANDOFF:-/home/claude/tools/M_SNIPPET.md}
N=$1; S=$2; cd /home/claude/src/Vellum-Check-main
python3 -I /home/claude/tools/mk$N.py server/library/guides/$S.json >/dev/null || exit 1
python3 -I /home/claude/work/g$N.py || exit 1
python3 -I /home/claude/work/c${N}gen.py || exit 1
rm -f public/guide-panels/$S.panels.js public/guide-cards/$S.card.js public/guide-covers/$S.cover.css
python3 -I /home/claude/tools/apply2.py $N $S | tail -1 || exit 1
node -e "global.VCPanels=o=>{for(const n in o)o[n]('x')};require('./public/guide-panels/$S.panels.js')" || exit 1
python3 -I /home/claude/tools/lint.py $S | tee /tmp/lint.txt; grep -q "LINT OK" /tmp/lint.txt || exit 1
sed -i -E "s#(href\*=\"|/guide/)[a-z0-9-]+#\1$S#g" /home/claude/tools/shot.py
(ROOT=$PWD ADMIN=1 PORT=3401 node /home/claude/tools/mini.mjs > /tmp/srv.log 2>&1 &) ; sleep 2
cd /home/claude/tools && timeout 150 python3 shot.py | tail -1; pkill -f mini.mjs
python3 -c "
from PIL import Image;a=Image.open('/home/claude/work/d_all.png');a=a.crop((0,0,680,1340));a.resize((a.width//2,a.height//2)).save('/home/claude/work/both.png')"
