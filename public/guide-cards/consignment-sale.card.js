// ภาพการ์ดของคู่มือ consignment-sale
VCCards({
cardconsign: function (k) { return '<defs><linearGradient id="ccs' + k + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e8f0"/><stop offset="1" stop-color="#e2c8d8"/></linearGradient>' +
      '<filter id="ccq' + k + '" x="-20%" y="-20%" width="150%" height="160%"><feDropShadow dx="1.5" dy="3" stdDeviation="2" flood-color="#3a1a2a" flood-opacity=".3"/></filter></defs>' +
      '<rect width="136" height="160" fill="url(#ccs' + k + ')"/><path d="M0 70h136" stroke="#c8a8b8" stroke-width="3"/>' +
      '<g filter="url(#ccq' + k + ')"><path d="M58 34h40l6 36h-52z" fill="#2e8a6e"/></g><path d="M68 34q10-18 20 0" stroke="#2e8a6e" stroke-width="3" fill="none"/><rect x="74" y="44" width="10" height="7" rx="1" fill="#f2d27a"/>' +
      '<path d="M100 40l12 12" stroke="#7a5a3a" stroke-width="1"/><g transform="rotate(30 116 60)" filter="url(#ccq' + k + ')"><path d="M108 52h24v14h-24l-6-7z" fill="#f2b33d"/></g>' +
      '<g class="sc-bob"><g transform="rotate(-8 100 120)" filter="url(#ccq' + k + ')"><rect x="74" y="104" width="54" height="30" rx="3" fill="#fffdf6"/><rect x="78" y="98" width="46" height="12" rx="2" fill="#7fc49a"/></g></g>'; }
});
