#!/bin/bash
# ติดตั้งชุดเครื่องมือเร็ว (ใช้ทำคู่มือ 152–191) ให้อยู่ที่ path เดิมที่สคริปต์ต้องการ
R=/home/claude/vellum-check; F=$R/tools/guide-maker/fast
mkdir -p /home/claude/tools /home/claude/work /tmp/pc
cp $F/*.py $F/*.sh $F/*.md $F/*.mjs $F/*.json /home/claude/tools/ 2>/dev/null
cp $F/c206gen.py /home/claude/work/
cp $F/examples/enrich.py $F/examples/run9.py /tmp/pc/
# สำเนา repo สำหรับ build (publish.sh จะคัดลอกผลลัพธ์กลับเข้า repo จริงแล้ว commit/push ให้)
mkdir -p /home/claude/src && rsync -a --delete --exclude .git $R/ /home/claude/src/Vellum-Check-main/
pip install --break-system-packages -q pillow playwright >/dev/null 2>&1
echo "พร้อม: ดูวิธีใช้ใน tools/guide-maker/HANDOFF.md หัวข้อ 0"
