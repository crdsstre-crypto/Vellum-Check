// ภาพการ์ดของคู่มือ swap-trade
VCCards({
cardswaploop: function (k) { return '<defs><linearGradient id="csw' + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2f6ea"/><stop offset="1" stop-color="#ffe2c4"/></linearGradient>' +
      '<filter id="cwz' + k + '" x="-20%" y="-20%" width="150%" height="160%"><feDropShadow dx="1.5" dy="3" stdDeviation="2" flood-color="#2a3a2a" flood-opacity=".3"/></filter></defs>' +
      '<rect width="136" height="160" fill="url(#csw' + k + ')"/>' +
      '<g filter="url(#cwz' + k + ')"><rect x="20" y="28" width="30" height="50" rx="5" fill="#2a2a3a"/><rect x="78" y="82" width="44" height="30" rx="4" fill="#4a4a5a"/></g><rect x="24" y="33" width="22" height="38" rx="2" fill="#9ac0e0"/><circle cx="100" cy="97" r="9" fill="#2a2a3a" stroke="#9aa" stroke-width="2.4"/><rect x="84" y="77" width="10" height="6" rx="1" fill="#4a4a5a"/>' +
      '<path d="M58 40q40-6 50 30" stroke="#2e8a6e" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M102 66l6 10 5-11z" fill="#2e8a6e"/><path d="M72 110q-40 6-44-26" stroke="#e58a3a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M34 88l-6-10-5 11z" fill="#e58a3a"/>' +
      '<g class="sc-bob"><g filter="url(#cwz' + k + ')"><rect x="62" y="128" width="64" height="18" rx="9" fill="#fffdf6"/></g><text x="94" y="141" text-anchor="middle" font-size="9" font-weight="900" fill="#2e8a6e" font-family="sans-serif">+ ฿30,000</text></g>'; }
});
