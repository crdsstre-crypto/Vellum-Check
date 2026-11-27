#!/bin/bash
# stub card+css (เขียนทับด้วย pastel gen ทีหลัง) usage: stub.sh N cardname layout slug
N=$1; C=$2; L=$3; S=$4
cd /home/claude/work && python3 -c "
import sys; sys.path.insert(0,'/home/claude/tools')
from mkc import mkc
mkc($N,'$C',('#eef2f8','#d8e2f0','#ffffff','#64748b'),'<g filter=\"{F}\"><rect x=\"50\" y=\"80\" width=\"40\" height=\"50\" rx=\"2\" fill=\"#fff\"/></g>','')"
echo ".gd-cover[data-layout=\"$L\"] .gd-cover-art { border: 5px solid #e2e8f0; border-radius: 10px; } /* stub ($S) */" > /home/claude/work/css$N.css
