// ภาพการ์ดของคู่มือ sue-debtors-debtor
VCCards({
cardchaindebt: function (k) { return '<defs><linearGradient id="ccd' + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e6ecf4"/><stop offset="1" stop-color="#bccbe0"/></linearGradient>' +
      '<filter id="cdq' + k + '" x="-20%" y="-20%" width="150%" height="160%"><feDropShadow dx="1.5" dy="3" stdDeviation="2" flood-color="#1a2a4a" flood-opacity=".3"/></filter></defs>' +
      '<rect width="136" height="160" fill="url(#ccd' + k + ')"/>' +
      '<g filter="url(#cdq' + k + ')"><circle cx="30" cy="40" r="16" fill="#2e8a6e"/><circle cx="68" cy="80" r="16" fill="#e58a3a"/><circle cx="106" cy="120" r="16" fill="#5a7ad8"/></g>' +
      '<text x="30" y="44" text-anchor="middle" font-size="9" font-weight="900" fill="#fff" font-family="sans-serif">เรา</text><text x="68" y="83.5" text-anchor="middle" font-size="7" font-weight="900" fill="#fff" font-family="sans-serif">ลูกหนี้</text><text x="106" y="123.5" text-anchor="middle" font-size="7" font-weight="900" fill="#fff" font-family="sans-serif">ลูกค้า</text>' +
      '<path d="M42 52l14 16M80 92l14 16" stroke="#3a4a6a" stroke-width="3" stroke-linecap="round"/>' +
      '<g class="sc-bob"><path d="M30 58q-8 50 58 66" stroke="#e5484d" stroke-width="3" fill="none" stroke-dasharray="5 4"/><path d="M84 118l8 6-9 3z" fill="#e5484d"/><g filter="url(#cdq' + k + ')"><rect x="6" y="96" width="38" height="16" rx="8" fill="#fffdf6"/></g><text x="25" y="107" text-anchor="middle" font-size="7" font-weight="900" fill="#e5484d" font-family="sans-serif">ทวงแทน</text></g>'; }
});
