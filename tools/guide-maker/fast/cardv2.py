import re,sys,json
# safe zone: x 24-114 (mobile crop), y 66-160 (desktop crop); mascot bottom-left x<58,y>96
def T(x,y,s,sz,col,w=900,anchor='middle'):
  return '<text x="%s" y="%s" text-anchor="%s" font-size="%s" font-weight="%s" fill="%s" font-family="sans-serif">%s</text>'%(x,y,anchor,sz,w,col,s)
C={}
def card(slug,name,bg1,bg2,glow,dot,hero,accent=''):
  C[slug]=(name,bg1,bg2,glow,dot,hero,accent)
F='{F}'
# 52
card('borrow-gold-goods','cardgoldbar','#fff4d6','#f2d488','#fff8e0','#e8b84a',
 '<g filter="{F}"><path d="M52 132l8-16h30l8 16z" fill="#e8b23a"/><path d="M68 132l8-16h30l8 16z" fill="#f2c24a"/><path d="M60 114l8-16h30l8 16z" fill="#f6d06a"/></g><path d="M64 112l5-10h24" stroke="#fff6d0" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M56 130l5-10M72 130l5-10" stroke="#fff2c0" stroke-width="1.6"/>',
 '<g class="sc-bob"><g filter="{F}"><circle cx="102" cy="80" r="13" fill="#fffdf6"/></g><path d="M96 80a6 6 0 1 1 6 6" stroke="#2e8a6e" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M99 83l3 3-3 3" stroke="#2e8a6e" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>')
# 53
card('life-insurance-claim','cardlifepolicy','#fde8ee','#f4b8c8','#fff4f6','#e88aa4',
 '<g filter="{F}"><rect x="54" y="72" width="54" height="68" rx="5" fill="#fffdf8"/></g><rect x="54" y="72" width="54" height="12" rx="5" fill="#2f4a7a"/><rect x="54" y="80" width="54" height="4" fill="#2f4a7a"/><rect x="62" y="92" width="38" height="3" rx="1.5" fill="#e0d6cc"/><rect x="62" y="99" width="30" height="3" rx="1.5" fill="#e0d6cc"/><path d="M81 132l-12-11a7 7 0 0 1 12-8 7 7 0 0 1 12 8z" fill="#e5484d"/>',
 '<g class="sc-bob"><g filter="{F}"><rect x="86" y="140" width="28" height="14" rx="7" fill="#fffdf6"/></g><path d="M89 147h5l2-4 3 8 2-4h8" stroke="#e5484d" stroke-width="1.8" fill="none" stroke-linejoin="round"/></g>')
# 54
card('installment-sale','cardinstallment','#fff1e0','#f6d0a4','#fffaf0','#e8a85a',
 '<g filter="{F}"><rect x="58" y="62" width="40" height="80" rx="6" fill="#f4f8fc"/></g><path d="M58 92h40" stroke="#c8d4e0" stroke-width="2"/><rect x="90" y="70" width="3" height="14" rx="1.5" fill="#9aa8b8"/><rect x="90" y="100" width="3" height="20" rx="1.5" fill="#9aa8b8"/><path d="M96 66l10-8" stroke="#8a6a4a" stroke-width="1.4"/><g transform="rotate(-24 108 58)"><path d="M102 52h14v12h-14l-5-6z" fill="#e5484d"/><circle cx="101" cy="58" r="1.6" fill="#fff"/></g>',
 '<g class="sc-bob"><g filter="{F}"><rect x="78" y="128" width="36" height="20" rx="4" fill="#fffdf6"/></g><rect x="82" y="135" width="28" height="6" rx="3" fill="#e6e6e6"/><rect x="82" y="135" width="17" height="6" rx="3" fill="#2e8a6e"/></g>')
# 55
card('forged-signature-loan','cardforgedpen','#2a2a4a','#1a1a34','#3a3a64','#5a5a8a',
 '<g transform="rotate(-6 80 100)"><g filter="{F}"><rect x="50" y="64" width="58" height="74" rx="3" fill="#fffdf6"/></g><rect x="58" y="74" width="40" height="2.6" rx="1.3" fill="#d8cfc0"/><rect x="58" y="82" width="34" height="2.6" rx="1.3" fill="#d8cfc0"/><rect x="58" y="90" width="38" height="2.6" rx="1.3" fill="#d8cfc0"/><path d="M58 122q6-12 12 0t12-4" stroke="#3a6ad8" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M56 128h44" stroke="#9aa8b8" stroke-width="1.2"/></g><path d="M96 124l14-16 4 3-14 16-6 3z" fill="#e2b04a"/>',
 '<g class="sc-bob"><g filter="{F}"><circle cx="100" cy="138" r="13" fill="#fff"/></g><circle cx="100" cy="138" r="10" fill="none" stroke="#e5484d" stroke-width="3.4"/><path d="M93 131l14 14" stroke="#e5484d" stroke-width="3.4"/></g>')
# 56
card('consignment-sale','cardconsign','#f6e8f4','#dcc0e0','#fff4fc','#c8a0d0',
 '<rect x="40" y="118" width="80" height="5" rx="2" fill="#c8a8c8"/><g filter="{F}"><path d="M58 116l5-34h34l5 34z" fill="#2e8a6e"/></g><path d="M68 84q0-14 12-14t12 14" stroke="#2a6a54" stroke-width="4" fill="none"/><rect x="74" y="92" width="12" height="8" rx="2" fill="#f2d06a"/><path d="M98 90l10 8" stroke="#8a6a4a" stroke-width="1.2"/><g transform="rotate(30 110 102)"><path d="M104 96h12v12h-12l-4-6z" fill="#f2b33d"/></g>',
 '<g class="sc-bob"><g filter="{F}"><circle cx="100" cy="140" r="11" fill="#f2c94c"/></g><text x="100" y="144.5" text-anchor="middle" font-size="12" font-weight="900" fill="#a8741a" font-family="sans-serif">฿</text></g>')
# 57
card('breach-damages','cardbrokenvow','#fdeae4','#f4c4b4','#fff6f2','#e89a84',
 '<g filter="{F}"><path d="M52 66h28l-6 18 8 14-8 14 4 26h-26z" fill="#fffdf6"/><path d="M84 66h26v72h-28l-4-26 8-14-8-14z" fill="#fffdf6"/></g><rect x="58" y="78" width="14" height="2.6" rx="1.3" fill="#d8cfc0"/><rect x="58" y="86" width="10" height="2.6" rx="1.3" fill="#d8cfc0"/><rect x="90" y="78" width="14" height="2.6" rx="1.3" fill="#d8cfc0"/><rect x="92" y="86" width="12" height="2.6" rx="1.3" fill="#d8cfc0"/>',
 '<g class="sc-bob"><g filter="{F}"><rect x="90" y="118" width="24" height="24" rx="3" fill="#fffdf6"/></g><rect x="90" y="118" width="24" height="7" rx="3" fill="#e5484d"/><text x="102" y="138" text-anchor="middle" font-size="10" font-weight="900" fill="#2a3a5a" font-family="sans-serif">30</text></g>')
# 58
card('tricked-or-threatened-contract','cardmaskpen','#ece4f6','#c8b8e4','#f8f4fe','#a890d0',
 '<g transform="rotate(-4 78 104)"><g filter="{F}"><rect x="50" y="66" width="56" height="72" rx="3" fill="#fffdf6"/></g><rect x="58" y="76" width="40" height="2.6" rx="1.3" fill="#d8cfc0"/><rect x="58" y="84" width="34" height="2.6" rx="1.3" fill="#d8cfc0"/><path d="M60 124q8-10 16 0" stroke="#3a6ad8" stroke-width="2.4" fill="none" stroke-linecap="round"/></g><g filter="{F}"><path d="M62 100q20-14 48 0q-2 14-14 14-10 0-10-6-0 6-10 6-12 0-14-14z" fill="#2a2a3a"/></g><ellipse cx="74" cy="104" rx="5" ry="3.4" fill="#ece4f6"/><ellipse cx="98" cy="104" rx="5" ry="3.4" fill="#ece4f6"/>',
 '<g class="sc-bob"><g filter="{F}"><path d="M102 128l12 20h-24z" fill="#f2c94c"/></g><rect x="101" y="134" width="2.4" height="7" fill="#5a3a1a"/><circle cx="102.2" cy="144" r="1.4" fill="#5a3a1a"/></g>')
# 59
card('minor-contract','cardschoolbag','#e4eefa','#b8ccec','#f4f8fe','#8aa8d8',
 '<g filter="{F}"><rect x="56" y="80" width="50" height="60" rx="12" fill="#e5484d"/></g><path d="M66 82q0-16 15-16t15 16" stroke="#b83236" stroke-width="5" fill="none"/><rect x="62" y="104" width="38" height="22" rx="6" fill="#c83a3e"/><rect x="77" y="98" width="8" height="8" rx="2" fill="#f2c94c"/>',
 '<g class="sc-bob"><g filter="{F}"><rect x="84" y="62" width="30" height="18" rx="9" fill="#fffdf6"/></g><text x="99" y="75" text-anchor="middle" font-size="10" font-weight="900" fill="#e5484d" font-family="sans-serif">&lt;20</text></g>')
# 60
card('claim-other-insurer','cardclaimdirect','#e0f2f8','#b0dcec','#f2fafe','#7ac0dc',
 '<g filter="{F}"><path d="M80 62l26 10v22q0 22-26 32-26-10-26-32v-22z" fill="#2a6a8a"/></g><path d="M68 92l9 9 16-18" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
 '<g class="sc-bob"><g filter="{F}"><path d="M72 146v-8q2-5 10-6l8-7h18l6 7v14z" fill="#e5484d"/></g><path d="M92 128h6v5h-10zM100 128h6l3 5h-9z" fill="#cfe6f4"/><circle cx="84" cy="147" r="4.4" fill="#2a2a32"/><circle cx="106" cy="147" r="4.4" fill="#2a2a32"/></g>')
# 61
card('found-lost-property','cardfoundwallet','#eaf4e0','#c4e0b0','#f6fbf0','#9ac884',
 '<g transform="rotate(-10 80 100)"><g filter="{F}"><rect x="50" y="84" width="62" height="40" rx="7" fill="#8a4a2a"/></g><rect x="58" y="76" width="28" height="16" rx="2" fill="#fffdf6"/><rect x="61" y="79" width="9" height="10" rx="1" fill="#e2b088"/><rect x="92" y="98" width="22" height="14" rx="5" fill="#6a3a1a"/><circle cx="99" cy="105" r="3" fill="#f2c94c"/></g>',
 '<g class="sc-bob"><g filter="{F}"><path d="M84 132h28v18h-28l-6-9z" fill="#f2b33d"/></g><circle cx="84" cy="141" r="2.2" fill="#fff"/><text x="99" y="145" text-anchor="middle" font-size="9.4" font-weight="900" fill="#5a3a1a" font-family="sans-serif">10%</text></g>')
# 62
card('friend-loan-unpaid','cardchatloan','#ece4fa','#cdbcef','#f8f4fe','#a890e0',
 '<g transform="rotate(-6 80 100)"><g filter="{F}"><rect x="56" y="62" width="48" height="84" rx="8" fill="#2a2a3a"/></g><rect x="60" y="70" width="40" height="68" rx="3" fill="#f4f8ff"/><rect x="63" y="76" width="28" height="11" rx="5" fill="#d8e4f0"/><rect x="69" y="92" width="28" height="11" rx="5" fill="#9adf7a"/><text x="83" y="100" text-anchor="middle" font-size="6.6" font-weight="900" fill="#1a4a1a" font-family="sans-serif">฿20,000</text><rect x="63" y="108" width="20" height="9" rx="4.5" fill="#d8e4f0"/><circle cx="68" cy="112.5" r="1.2" fill="#7a8a9a"/><circle cx="73" cy="112.5" r="1.2" fill="#7a8a9a"/><circle cx="78" cy="112.5" r="1.2" fill="#7a8a9a"/></g>',
 '<g class="sc-bob"><g filter="{F}"><circle cx="102" cy="134" r="12" fill="#f2b33d"/></g><text x="102" y="140" text-anchor="middle" font-size="16" font-weight="900" fill="#5a3a1a" font-family="sans-serif">?</text></g>')
# 63
card('public-reward-promise','cardrewardposter','#fff0d8','#f6cfa0','#fffaf0','#e8b07a',
 '<g transform="rotate(-4 80 102)"><g filter="{F}"><rect x="52" y="64" width="58" height="76" fill="#fffdf6"/></g><circle cx="81" cy="68" r="3" fill="#e5484d"/>'+T(81,82,'ตามหา',9,'#c0392b')+'<circle cx="81" cy="102" r="12" fill="#f29a3a"/><path d="M71 96l2-9 5 6M91 96l-2-9-5 6" fill="#f29a3a"/><circle cx="77" cy="101" r="1.6" fill="#3a2a20"/><circle cx="85" cy="101" r="1.6" fill="#3a2a20"/><rect x="60" y="120" width="42" height="14" rx="3" fill="#e8f6ea"/>'+T(81,130.5,'฿5,000',9,'#2e8a4e')+'</g>',
 '<g class="sc-bob"><g filter="{F}"><circle cx="106" cy="68" r="10" fill="#f2c94c"/></g><path d="M106 61l2 4.2 4.6.6-3.3 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.3-3.2 4.6-.6z" fill="#fff6c8"/></g>')
# 64
card('pay-right-person','cardhandoffcash','#e2f2f6','#b4dce6','#f2fafc','#7ac0d0',
 '<g transform="rotate(-10 82 92)"><g filter="{F}"><rect x="52" y="76" width="60" height="32" rx="3" fill="#7ac07a"/></g><rect x="56" y="80" width="52" height="24" rx="2" fill="none" stroke="#e8f6e8" stroke-width="1.4"/><circle cx="82" cy="92" r="7.4" fill="#e8f6e8"/><text x="82" y="96" text-anchor="middle" font-size="9.4" font-weight="900" fill="#2e6a3e" font-family="sans-serif">฿</text></g><g filter="{F}"><rect x="62" y="112" width="40" height="34" rx="2" fill="#fffdf6"/></g><path d="M62 146l5-4 5 4 5-4 5 4 5-4 5 4 5-4 5 4" stroke="#fffdf6" fill="none"/>'+T(82,124,'ใบรับเงิน',6.6,'#2a3a5a')+'<rect x="68" y="129" width="28" height="2" fill="#c8ccd0"/>',
 '<g class="sc-bob"><g filter="{F}"><circle cx="104" cy="136" r="10" fill="#2e9a5a"/></g><path d="M99 136l4 4 6-8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>')
# 65
card('sue-debtors-debtor','cardchaindebt','#e6ecf4','#bccbe0','#f4f8fc','#8aa0c8',
 '<path d="M66 82l14 16M90 110l10 12" stroke="#3a4a6a" stroke-width="3" stroke-linecap="round"/><g filter="{F}"><circle cx="58" cy="72" r="14" fill="#2e8a6e"/><circle cx="84" cy="104" r="14" fill="#e58a3a"/><circle cx="104" cy="134" r="12" fill="#5a7ad8"/></g>'+T(58,75.5,'เรา',9,'#fff')+T(84,107,'ลูกหนี้',6.6,'#fff')+T(104,137,'ลูกค้า',6,'#fff'),
 '<g class="sc-bob"><path d="M70 74q34 6 38 46" stroke="#e5484d" stroke-width="2.6" fill="none" stroke-dasharray="4 3"/><path d="M104 118l4 6 4-7z" fill="#e5484d"/></g>')
# 66
card('co-owned-property','cardsplitkey','#ffe6cc','#d4e8fa','#ffffff','#e8c0a0',
 '<g filter="{F}"><path d="M54 132v-36l28-24 28 24v36z" fill="#e58a5a"/></g><path d="M82 72l28 24v36h-28z" fill="#5a8ac8"/><path d="M48 98l34-30 34 30" stroke="#8a4a3a" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="74" y="108" width="16" height="24" fill="#fffdf6"/><path d="M82 64v76" stroke="#fff" stroke-width="2" stroke-dasharray="4 3"/>',
 '<g class="sc-bob"><g filter="{F}"><rect x="84" y="136" width="30" height="14" rx="7" fill="#2f5aa8"/></g>'+T(99,146,'50:50',8,'#fff')+'</g>')
# 67
card('buyer-no-pickup','cardunclaimedbox','#f6ecdc','#e2cca8','#fdf8f0','#c8a878',
 '<g filter="{F}"><path d="M52 92l30-14 30 14v40l-30 14-30-14z" fill="#c8945a"/></g><path d="M52 92l30 14 30-14M82 106v40" stroke="#a8743a" stroke-width="1.8" fill="none"/><path d="M66 85l30 14" stroke="#e8c48a" stroke-width="5"/><g transform="rotate(-8 98 122)"><rect x="88" y="116" width="22" height="11" rx="2" fill="#fffdf6"/>'+T(99,124.5,'รอรับ',6,'#c0392b')+'</g>',
 '<g class="sc-bob"><g filter="{F}"><circle cx="102" cy="72" r="12" fill="#fffdf6"/></g><circle cx="102" cy="72" r="9" fill="none" stroke="#2a3a5a" stroke-width="1.8"/><path d="M102 66v6l4 3" stroke="#e5484d" stroke-width="2" fill="none" stroke-linecap="round"/></g>')
# 68
card('company-debt-director','cardcorpshield','#dfeaf6','#a8c0e0','#f2f6fc','#7a9ac8',
 '<g filter="{F}"><rect x="56" y="72" width="44" height="68" fill="#3a5a8a"/></g><g fill="#cfe6f4"><rect x="62" y="80" width="9" height="8"/><rect x="74" y="80" width="9" height="8"/><rect x="86" y="80" width="8" height="8"/><rect x="62" y="94" width="9" height="8"/><rect x="74" y="94" width="9" height="8"/><rect x="86" y="94" width="8" height="8"/><rect x="62" y="108" width="9" height="8"/><rect x="86" y="108" width="8" height="8"/></g><rect x="72" y="122" width="12" height="18" fill="#1a2a4a"/><rect x="58" y="62" width="40" height="11" rx="2" fill="#fffdf6"/>'+T(78,70.5,'บจก.',7,'#2a3a5a'),
 '<g class="sc-bob"><g filter="{F}"><path d="M102 116l13 5v9q0 10-13 15-13-5-13-15v-9z" fill="#2e8a6e"/></g><path d="M96 130l4 4 7-8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/></g>')
# 69
card('lost-cheque-crossing','cardcrossedcheque','#e4f6ec','#b4e0c8','#f4fcf8','#7ac4a0',
 '<g transform="rotate(-10 80 98)"><g filter="{F}"><rect x="42" y="76" width="80" height="42" rx="3" fill="#fbfdf8"/></g><rect x="42" y="76" width="80" height="9" rx="3" fill="#5aa07a"/><rect x="76" y="92" width="38" height="2.4" fill="#9ab"/><rect x="76" y="99" width="28" height="2.4" fill="#9ab"/><rect x="92" y="105" width="24" height="9" rx="1" fill="#fff" stroke="#9ab"/><path d="M60 85l-8 33M70 85l-8 33" stroke="#2f5aa8" stroke-width="3"/></g>',
 '<g class="sc-bob"><g filter="{F}"><rect x="76" y="128" width="38" height="18" rx="4" fill="#fffdf6" stroke="#e5484d" stroke-width="2"/></g>'+T(95,140.5,'ห้ามจ่าย',7.6,'#e5484d')+'</g>')
# 70
card('auction-bid','cardbidpaddle','#f6dce0','#dca0ac','#fdf2f4','#c87a8a',
 '<g transform="rotate(-10 78 96)"><rect x="74" y="104" width="8" height="40" rx="3" fill="#8a5a3a"/><g filter="{F}"><circle cx="78" cy="88" r="24" fill="#fffdf6"/></g><circle cx="78" cy="88" r="19.5" fill="none" stroke="#a8384a" stroke-width="2.4"/>'+T(78,96,'27',21,'#2a3a5a')+'</g>',
 '<g class="sc-bob"><g transform="rotate(-35 102 132)" filter="{F}"><rect x="90" y="124" width="26" height="12" rx="3" fill="#6a3a22"/><rect x="100" y="134" width="6" height="18" rx="2" fill="#a86c44"/></g></g>')
# 71
card('swap-trade','cardswaploop','#e2f6ea','#ffe2c4','#ffffff','#8ac8a0',
 '<g filter="{F}"><rect x="52" y="68" width="22" height="38" rx="4" fill="#2a2a3a"/><rect x="82" y="108" width="34" height="24" rx="4" fill="#4a4a5a"/></g><rect x="55" y="72" width="16" height="29" rx="2" fill="#9ac0e0"/><circle cx="99" cy="120" r="7" fill="#2a2a3a" stroke="#9aa" stroke-width="2"/><rect x="86" y="104" width="8" height="5" rx="1" fill="#4a4a5a"/><path d="M80 76q24-2 28 24" stroke="#2e8a6e" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M103 98l5 8 4-9z" fill="#2e8a6e"/><path d="M78 126q-18 2-20-16" stroke="#e58a3a" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M63 112l-5-8-4 9z" fill="#e58a3a"/>',
 '<g class="sc-bob"><g filter="{F}"><rect x="76" y="138" width="38" height="14" rx="7" fill="#fffdf6"/></g>'+T(95,148,'+฿30,000',7,'#2e8a6e')+'</g>')
# 72
card('property-insurance-transfer','cardpolicyhandoff','#e2ecfa','#b8cdf0','#f4f8fe','#8aa8e0',
 '<g transform="rotate(-8 78 100)"><g filter="{F}"><rect x="52" y="64" width="52" height="70" rx="3" fill="#2f5aa8"/></g><rect x="60" y="73" width="36" height="4" rx="2" fill="#fff"/><rect x="60" y="82" width="26" height="3" rx="1.5" fill="#fff" opacity=".7"/><path d="M78 96l13 5v9q0 10-13 15-13-5-13-15v-9z" fill="#f2c94c"/><path d="M72 110l4 4 7-8" stroke="#2f5aa8" stroke-width="2.4" fill="none" stroke-linecap="round"/></g>',
 '<g class="sc-bob"><g filter="{F}"><circle cx="96" cy="138" r="8" fill="none" stroke="#9aa3ad" stroke-width="3.4"/></g><rect x="102" y="136" width="12" height="4.4" rx="1.5" fill="#9aa3ad"/><rect x="109" y="140" width="3" height="4" fill="#9aa3ad"/></g>')
# 73
card('spouse-gives-away-money','cardjointpiggy','#fce6ec','#f4b8c8','#fff6f8','#e890a8',
 '<g filter="{F}"><ellipse cx="82" cy="104" rx="30" ry="24" fill="#f29ac0"/><rect x="62" y="120" width="8" height="12" rx="3" fill="#e07aa8"/><rect x="94" y="120" width="8" height="12" rx="3" fill="#e07aa8"/></g><ellipse cx="54" cy="104" rx="7" ry="6" fill="#e07aa8"/><circle cx="62" cy="96" r="2.4" fill="#3a2a2a"/><rect x="74" y="80" width="16" height="4" rx="2" fill="#a84a7a"/><circle cx="78" cy="106" r="7" fill="none" stroke="#d4a42a" stroke-width="3"/><circle cx="90" cy="106" r="7" fill="none" stroke="#fff" stroke-width="3"/>',
 '<g class="sc-bob"><g filter="{F}"><rect x="80" y="134" width="34" height="16" rx="4" fill="#fffdf6" stroke="#e5484d" stroke-width="1.8"/></g>'+T(97,145.5,'ยินยอม?',7,'#e5484d')+'</g>')
# 74
card('divorce-property-split','cardscalehouse','#fdeee0','#f2c8a8','#fff8f2','#e0a080',
 '<g filter="{F}"><rect x="79" y="70" width="5" height="64" fill="#6a4a3a"/><rect x="66" y="132" width="32" height="6" rx="2" fill="#6a4a3a"/></g><path d="M54 80h56" stroke="#6a4a3a" stroke-width="3.4" stroke-linecap="round"/><circle cx="81.5" cy="70" r="4" fill="#c9a24a"/><path d="M54 80l-9 22h18zM110 80l-9 22h18z" fill="none" stroke="#6a4a3a" stroke-width="1.2"/><path d="M43 102h22q-11 7-22 0zM99 102h22q-11 7-22 0z" fill="#c9a24a"/><path d="M47 100v-8l7-6 7 6v8z" fill="#e58a5a"/><path d="M103 100v-8l7-6 7 6v8z" fill="#5a8ac8"/>',
 '<g class="sc-bob"><g filter="{F}"><rect x="86" y="140" width="28" height="13" rx="6.5" fill="#fffdf6"/></g>'+T(100,149.5,'½ : ½',7.4,'#c0504a')+'</g>')

AC={'cardgoldbar':(102,80),'cardlifepolicy':(100,147),'cardinstallment':(96,138),'cardforgedpen':(100,138),'cardconsign':(100,140),'cardbrokenvow':(102,130),'cardmaskpen':(102,138),'cardschoolbag':(99,71),'cardclaimdirect':(93,138),'cardfoundwallet':(95,141),'cardchatloan':(102,134),'cardrewardposter':(106,68),'cardhandoffcash':(104,136),'cardsplitkey':(99,143),'cardunclaimedbox':(102,72),'cardcorpshield':(102,130),'cardcrossedcheque':(95,137),'cardbidpaddle':(103,138),'cardswaploop':(95,145),'cardpolicyhandoff':(103,139),'cardjointpiggy':(97,142),'cardscalehouse':(100,146)}
def js(name,bg1,bg2,glow,dot,hero,accent):
  p=name[4:7] if name.startswith('card') else name[:3]
  ids=dict(g='v%sg'%p,r='v%sr'%p,f='v%sf'%p)
  fl="url(#%s' + k + ')"%ids['f']
  hero=hero.replace('{F}',fl); accent=accent.replace('{F}',fl)
  defs=("<defs><linearGradient id=\"%s' + k + '\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"%s\"/><stop offset=\"1\" stop-color=\"%s\"/></linearGradient>"
   "<radialGradient id=\"%s' + k + '\" cx=\".5\" cy=\".5\" r=\".5\"><stop offset=\"0\" stop-color=\"%s\" stop-opacity=\".95\"/><stop offset=\"1\" stop-color=\"%s\" stop-opacity=\"0\"/></radialGradient>"
   "<filter id=\"%s' + k + '\" x=\"-30%%\" y=\"-30%%\" width=\"160%%\" height=\"170%%\"><feDropShadow dx=\"1.2\" dy=\"3\" stdDeviation=\"2.2\" flood-color=\"#1a1a2a\" flood-opacity=\".22\"/></filter></defs>")%(ids['g'],bg1,bg2,ids['r'],glow,glow,ids['f'])
  deco=("<rect width=\"136\" height=\"160\" fill=\"url(#%s' + k + ')\"/>"
   "<circle cx=\"122\" cy=\"20\" r=\"34\" fill=\"#fff\" opacity=\".22\"/><circle cx=\"10\" cy=\"150\" r=\"26\" fill=\"#fff\" opacity=\".14\"/>"
   "<circle cx=\"88\" cy=\"92\" r=\"44\" fill=\"url(#%s' + k + ')\"/>"
   "<g fill=\"%s\" opacity=\".55\"><circle cx=\"30\" cy=\"74\" r=\"1.6\"/><circle cx=\"112\" cy=\"96\" r=\"1.4\"/><circle cx=\"40\" cy=\"58\" r=\"1.1\"/><path d=\"M118 118l1.2 2.8 2.8 1.2-2.8 1.2-1.2 2.8-1.2-2.8-2.8-1.2 2.8-1.2z\"/></g>"
   "<ellipse cx=\"88\" cy=\"128\" rx=\"24\" ry=\"4.4\" fill=\"#1a1a2a\" opacity=\".08\"/>")%(ids['g'],ids['r'],dot)
  ax,ay=AC.get(name,(None,None))
  hero='<g transform="translate(88 92) scale(.74) translate(-82 -102)">'+hero+('' if ax else accent)+'</g>'
  if ax: hero+='<g transform="translate(%s %s)">'%(46-ax,70-ay)+accent+'</g>'
  body=defs+deco+hero
  body=body.replace("'","\\'").replace("\\' + k + \\'","' + k + '")
  out="    %s: function (k) { return '%s'; },"%(name,body)
  import importlib.util as U,sys as _s;_a=_s.argv;_s.argv=['x','/nonexist'];sp=U.spec_from_file_location('rs','/home/claude/tools/restyle.py');rs=U.module_from_spec(sp);sp.loader.exec_module(rs);_s.argv=_a
  out=rs.pat.sub(lambda m:rs.deco(m.group(1),m.group(2),m.group(3)),out).replace('translate(88 92) scale(.74) translate(-82 -102)','translate(88 90) scale(.8) translate(-82 -102)')
  return out

if __name__=='__main__':
  import os
  out=sys.argv[1]
  for slug,(name,*rest) in C.items():
    f=open(os.path.join(out,slug+'.card.js'),'w'); f.write('// ภาพการ์ดของคู่มือ '+slug+'\nVCCards({\n'+js(name,*rest)+'\n});\n'); f.close()
  print(len(C))
