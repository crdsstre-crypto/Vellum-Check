#!/bin/bash
# ติดตั้งเครื่องมือทำคู่มือ ไปไว้ในตำแหน่งที่สคริปต์ต้องใช้ (รันจากโฟลเดอร์นี้: bash setup.sh)
# ต้อง clone repo ไว้ที่ /home/claude/vellum-check
set -e
H=$(cd "$(dirname "$0")" && pwd)
mkdir -p /tmp/art /tmp/pastel /tmp/newg /tmp/N1 /home/claude/out/fix2
cp $H/art/* /tmp/art/; cp $H/pastel/gen.py /tmp/pastel/; cp $H/newg/*.py /tmp/newg/
cp $H/chk15.mjs $H/shoot.py $H/listshot.py $H/covergrid.py $H/sec.py $H/mini2.mjs /tmp/
for f in $H/laws/*.txt; do b=$(basename "$f"); case "$b" in *-v2.txt) cp "$f" /home/claude/out/fix2/;; *-N1.txt) cp "$f" /tmp/N1/out.txt;; *) cp "$f" /home/claude/out/;; esac; done
pip list 2>/dev/null | grep -qi playwright || echo "!! ไม่มี playwright: ภาพหน้าจอจะใช้ไม่ได้"
(ROOT=/home/claude/vellum-check ADMIN=1 PORT=3410 nohup node /tmp/mini2.mjs > /tmp/mini2.log 2>&1 &)
sleep 3; echo "พร้อม: เซิร์ฟเวอร์จำลองที่ http://localhost:3410/guide"
