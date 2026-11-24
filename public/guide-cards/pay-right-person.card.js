// ภาพการ์ดของคู่มือ pay-right-person
VCCards({
cardhandoffcash: function (k) { return '<defs><linearGradient id="chc' + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2f2f6"/><stop offset="1" stop-color="#b4dce6"/></linearGradient>' +
      '<filter id="chq' + k + '" x="-20%" y="-20%" width="150%" height="160%"><feDropShadow dx="1.5" dy="3" stdDeviation="2" flood-color="#1a3a4a" flood-opacity=".3"/></filter></defs>' +
      '<rect width="136" height="160" fill="url(#chc' + k + ')"/><circle cx="118" cy="22" r="26" fill="#fff" opacity=".3"/>' +
      '<path d="M8 96q20-6 34 0" stroke="#e8b896" stroke-width="12" stroke-linecap="round" fill="none"/><path d="M128 74q-20 6-34 0" stroke="#e2b088" stroke-width="12" stroke-linecap="round" fill="none"/>' +
      '<g transform="rotate(-12 68 82)" filter="url(#chq' + k + ')"><rect x="38" y="68" width="60" height="30" rx="3" fill="#7ac07a"/><rect x="42" y="72" width="52" height="22" rx="2" fill="none" stroke="#e8f6e8" stroke-width="1.4"/><circle cx="68" cy="83" r="7" fill="#e8f6e8"/><text x="68" y="86.5" text-anchor="middle" font-size="9" font-weight="900" fill="#2e6a3e" font-family="sans-serif">฿</text></g>' +
      '<g class="sc-bob"><g filter="url(#chq' + k + ')"><rect x="42" y="114" width="52" height="30" rx="3" fill="#fffdf6"/></g><text x="68" y="126" text-anchor="middle" font-size="7" font-weight="900" fill="#2a3a5a" font-family="sans-serif">ใบรับเงิน</text><text x="68" y="138" text-anchor="middle" font-size="7" font-weight="900" fill="#e5484d" font-family="sans-serif">✓ ชำระแล้ว</text></g>'; }
});
