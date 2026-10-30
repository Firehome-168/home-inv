// 家用進銷存 商品型錄網頁 (版面 + 程式) ; 由 index.html 的型錄樣板產生 , 不要直接改 , 改樣板後執行 make_catalog_js.py
// catalog.html 只放資料 (window.CAT) , 載入這支 ; 商品、售價、庫存平常由雲端自動更新
(function () {
  const st = document.createElement("style"); st.textContent = ":root{--bg:#f4f5f2;--card:#fff;--ink:#1f2523;--muted:#66706c;--line:#dfe3df;--brand:#3b64a8;--brand-ink:#fff;--soft:#e6ecf6}\n@media (prefers-color-scheme: dark){:root{--bg:#121614;--card:#1c2220;--ink:#e7ece9;--muted:#9aa5a0;--line:#2e3633;--brand:#86a9e6;--brand-ink:#0d1412;--soft:#232b38}}\n*{box-sizing:border-box}\nhtml,body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.45 system-ui,-apple-system,\"PingFang TC\",\"Microsoft JhengHei\",\"Noto Sans TC\",sans-serif;-webkit-text-size-adjust:100%}\nbody{padding-bottom:calc(80px + env(safe-area-inset-bottom))}\nheader,main{max-width:720px;margin:0 auto;padding:0 16px}\nheader{padding-top:calc(14px + env(safe-area-inset-top));padding-bottom:6px}\nh1{font-size:22px;margin:0}\n.muted{color:var(--muted)}.small{font-size:13px}\ninput,textarea{width:100%;font:inherit;color:var(--ink);background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 11px;min-height:44px}\ntextarea{min-height:64px}\nlabel{display:block;font-size:13px;color:var(--muted);margin:10px 0 4px}\n.chips{display:flex;gap:6px;overflow-x:auto;padding:8px 0;scrollbar-width:none}\n.chip{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:16px;padding:5px 12px;font-size:14px;white-space:nowrap}\n.chip.on{background:var(--brand);color:var(--brand-ink);border-color:var(--brand)}\n.card{background:var(--card);border-radius:12px;padding:4px 14px;margin:0 0 12px;box-shadow:0 1px 2px rgba(0,0,0,.06),0 2px 8px rgba(0,0,0,.05)}\n.it{display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--line)}\n.it:last-child{border-bottom:0}\n.ph{width:64px;height:64px;border-radius:8px;object-fit:cover;flex:none;cursor:zoom-in;background:var(--line)}\n#zoom{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:9;padding:16px}\n#zoom.on{display:flex}\n#zoom img{max-width:100%;max-height:100%;border-radius:10px}\n.grow{flex:1;min-width:0}\n.ttl{font-weight:600}\n.price{font-weight:700;font-variant-numeric:tabular-nums;margin-right:4px}\n.q{width:36px;height:36px;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:18px;font-size:20px;line-height:1;padding:0}\n.q:disabled{opacity:.35}\n.n{min-width:24px;text-align:center;font-variant-numeric:tabular-nums;font-weight:700}\n.sold{color:var(--muted);font-size:14px}\n.bar{position:fixed;left:0;right:0;bottom:0;background:var(--card);border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom))}\n.bar .in{max-width:720px;margin:0 auto;display:flex;align-items:center;gap:10px}\n.btn{border:0;border-radius:10px;padding:11px 16px;font:inherit;font-weight:600;background:var(--brand);color:var(--brand-ink)}\n.btn:disabled{opacity:.5}\n.btn.ghost{background:var(--soft);color:var(--ink)}\n.btn.line{background:#06c755;color:#fff}\n.btnrow{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.btnrow .btn{flex:1}\n.empty{color:var(--muted);text-align:center;padding:18px 0}\na.btn{display:block;text-align:center;text-decoration:none}\n[hidden]{display:none!important}\n.seg{display:flex;gap:8px}.seg button{flex:1;border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:10px;padding:10px;font:inherit}\n.seg button.on{background:var(--brand);color:var(--brand-ink);border-color:var(--brand)}.seg button:disabled{opacity:.35}\n.toast{position:fixed;left:50%;bottom:calc(90px + env(safe-area-inset-bottom));transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:9px 16px;border-radius:20px;font-size:14px;opacity:0;transition:opacity .2s;pointer-events:none;max-width:90vw}\n.toast.on{opacity:1}";
  document.head.appendChild(st);
  document.body.insertAdjacentHTML("afterbegin", "<header><h1 id=\"ttl\"></h1><div class=\"small muted\" id=\"sub\"></div></header>\n<main>\n  <div id=\"note\" class=\"small\" style=\"white-space:pre-wrap\"></div>\n  <input id=\"q\" type=\"search\" placeholder=\"搜尋商品\" style=\"margin-top:8px\">\n  <div class=\"chips\" id=\"depts\"></div>\n  <div class=\"card\" id=\"list\"></div>\n  <section id=\"form\" class=\"card\" style=\"padding:14px\" hidden>\n    <h2 style=\"font-size:18px;margin:0 0 6px\">填寫訂單</h2>\n    <div id=\"sum\" class=\"small\"></div>\n    <label>姓名 *</label><input id=\"nm\" autocomplete=\"name\">\n    <label>電話 *</label><input id=\"ph\" type=\"tel\" inputmode=\"tel\" autocomplete=\"tel\">\n    <label>取貨方式</label><div class=\"seg\" id=\"ship\"><button type=\"button\" data-v=\"自取\">自取</button><button type=\"button\" data-v=\"宅配\">宅配</button></div>\n    <div id=\"shipHint\" class=\"small muted\" style=\"margin-top:4px\"></div>\n    <div id=\"addrBox\" hidden><label>收件地址 *</label><input id=\"ad\" autocomplete=\"street-address\"></div>\n    <label>付款方式</label><div class=\"seg\" id=\"pay\"><button type=\"button\" data-v=\"現金\">現金</button><button type=\"button\" data-v=\"轉帳\">轉帳</button></div>\n    <div id=\"bankBox\" hidden>\n      <div id=\"bank\" class=\"small\" style=\"white-space:pre-wrap;background:var(--soft);border-radius:10px;padding:10px;margin-top:8px\"></div>\n      <label>轉帳帳號末 5 碼 (轉帳後填寫，也可之後再用 LINE 告知)</label><input id=\"l5\" inputmode=\"numeric\" maxlength=\"5\">\n    </div>\n    <label>備註 (取貨時間等)</label><textarea id=\"nt\"></textarea>\n    <div class=\"btnrow\"><button class=\"btn line\" id=\"send\">用 LINE 傳送訂單</button></div>\n    <div class=\"btnrow\"><button class=\"btn ghost\" id=\"copy\">複製訂單文字</button><button class=\"btn ghost\" id=\"clr\">清空購物車</button></div>\n    <p class=\"small muted\" id=\"how\"></p>\n  </section>\n  <section class=\"card\" id=\"lineBox\" style=\"padding:14px;text-align:center\" hidden>\n    <h2 style=\"font-size:18px;margin:0 0 4px\">加店家 LINE 好友</h2>\n    <img id=\"lineQr\" alt=\"店家 LINE QR 碼\" style=\"display:block;width:220px;max-width:75%;margin:8px auto;background:#fff;padding:8px;border-radius:12px\">\n    <p class=\"small muted\" style=\"margin:4px 0 0;text-align:left\">用 LINE 掃描 QR 碼 (手機看這頁就按下面「加入店家 LINE 好友」) 加入好友。選好商品、填好姓名電話後，按「複製訂單」，到店家聊天室長按輸入框選「貼上」再送出。</p>\n    <div class=\"btnrow\"><a class=\"btn line\" id=\"lineAdd\" target=\"_blank\" rel=\"noopener\">加入店家 LINE 好友</a></div>\n    <div class=\"btnrow\"><button class=\"btn ghost\" id=\"lineCopy\">複製訂單 (到 LINE 貼上)</button></div>\n  </section>\n  <section class=\"card\" style=\"padding:14px\">\n    <div class=\"btnrow\" style=\"margin-top:0\"><button class=\"btn ghost\" id=\"shareCat\">分享這個型錄給朋友</button></div>\n    <div id=\"appBox\" hidden>\n      <p class=\"small\" style=\"margin:14px 0 6px\">也想記自己家裡的帳？免費安裝「家用進銷存」APP：購入、使用、庫存、收支都能記，資料只存在你自己的手機。</p>\n      <a class=\"btn ghost\" id=\"appLink\" target=\"_blank\" rel=\"noopener\">安裝家用進銷存 APP</a>\n      <p class=\"small muted\" style=\"margin:6px 0 0\">用手機開啟網址，iPhone 按 Safari 分享鈕「加入主畫面」，Android 按 Chrome 選單「安裝應用程式」(或「加到主畫面」)。</p>\n    </div>\n  </section>\n</main>\n<div class=\"bar\"><div class=\"in\"><div class=\"grow\"><b id=\"tot\"></b><div class=\"small muted\" id=\"cnt\"></div></div><button class=\"btn\" id=\"go\">填寫訂單</button></div></div>\n<div id=\"zoom\"><img alt=\"\"></div>\n<div class=\"toast\" id=\"toast\"></div>");
})();
'use strict';
const D = window.CAT;
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => (Math.round((n || 0) * 100) / 100).toLocaleString('zh-TW');
const roc = iso => (Number(iso.slice(0, 4)) - 1911) + '.' + iso.slice(5, 7) + '.' + iso.slice(8, 10);
const LS = 'catalog_' + D.title;
const byId = id => D.items.find(x => x.i === id);
const vis = () => D.items.filter(x => D.showSold !== false || x.q > 0);   // 已售完商品依型錄設定顯示
let cart = {}, dept = '', ship = '自取', pay = '現金', ordNo = '';
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), 2400); }
function save() { try { localStorage.setItem(LS, JSON.stringify({ cart, nm: $('#nm').value, ph: $('#ph').value, ad: $('#ad').value, ship, pay })); } catch (e) { } }
try { const s = JSON.parse(localStorage.getItem(LS) || '{}'); cart = s.cart || {}; $('#nm').value = s.nm || ''; $('#ph').value = s.ph || ''; $('#ad').value = s.ad || ''; ship = s.ship || '自取'; pay = s.pay || '現金'; } catch (e) { }
function clampCart() { for (const k of Object.keys(cart)) { const it = byId(Number(k)); if (!it || it.q <= 0) delete cart[k]; else if (cart[k] > it.q) cart[k] = it.q; } }
clampCart();

// 分享 : 手機用分享選單 (可選 LINE) , 電腦複製到剪貼簿
const touchDev = /Android|iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
async function shareText(text) {
  if (touchDev && navigator.share) { try { await navigator.share({ text }); return; } catch (e) { if (e.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(text); toast('已複製，可貼到 LINE'); } catch (e) { prompt('複製', text); }
}
const catUrl = /^https?:/.test(location.protocol) ? location.href.split('#')[0].split('?')[0] : (D.cat || '');
// 分享文字 : 訂購單 (客人在 × 後面填數量傳回 , 店家「貼上會員訂單」可直接轉入)
const shareMsg = () => [D.title + ' 訂購單', '請在「×」後面填數量，取貨、付款留一個，填好整段傳回：',
  ...vis().map(x => '・' + x.n + ' $' + fmt(x.p) + (x.u ? '/' + x.u : '') + (x.q > 0 ? ' × ___ (尚有 ' + fmt(x.q) + (x.u || '') + ')' : ' (已售完)')),
  '----', '姓名：', '電話：', '取貨：自取 / 宅配', '地址：', '付款：現金 / 轉帳', '備註：',
  D.fee ? '宅配運費 $' + fmt(D.fee) + (D.free > 0 ? '，商品滿 $' + fmt(D.free) + ' 免運' : '') + '；宅配需先轉帳' : '',
  '看照片、線上下單：', catUrl].filter(Boolean).join('\n');
if (catUrl) $('#shareCat').onclick = () => shareText(shareMsg());
else $('#shareCat').hidden = true;
const appUrl = D.app || (/^https?:/.test(location.protocol) ? location.href.split('#')[0].split('?')[0].replace(/[^/]*$/, '') : '');   // 型錄和 APP 放同一個資料夾
if (appUrl) { $('#appBox').hidden = false; $('#appLink').href = appUrl; }

let depts = [];
function head() {
  document.title = D.title + ' 商品型錄';
  $('#ttl').textContent = D.title;
  $('#sub').textContent = '更新日期 ' + roc(D.date) + (D.tm ? ' ' + D.tm : '') + ' · 共 ' + vis().length + ' 項商品';
  $('#note').textContent = D.note || '';
  $('#how').textContent = D.line && D.line[0] === '@' ? '按「用 LINE 傳送訂單」會開啟 ' + D.line + ' 的聊天室，訂單文字已填好，按送出即可。'
    : '按「用 LINE 傳送訂單」後，選擇' + (D.line ? '店家 (LINE ID：' + D.line + ') ' : '店家') + '的聊天室送出；也可以複製訂單文字自行貼上。';
  depts = [...new Set(vis().map(x => x.d))];
  // 店家 LINE : QR 碼圖片 / 加好友網址 (沒填網址時用 LINE ID 組)
  const lu = D.lineUrl || (D.line ? (D.line[0] === '@' ? 'https://line.me/R/ti/p/' + encodeURIComponent(D.line) : 'https://line.me/ti/p/~' + encodeURIComponent(D.line)) : '');
  $('#lineBox').hidden = !(D.lineQr || lu);
  $('#lineQr').hidden = !D.lineQr; if (D.lineQr) $('#lineQr').src = D.lineQr;
  $('#lineAdd').hidden = !lu; if (lu) $('#lineAdd').href = lu;
  if (dept && !depts.includes(dept)) dept = '';
}
head();

function lines() { return Object.keys(cart).map(k => ({ it: byId(Number(k)), n: cart[k] })).filter(l => l.it && l.n > 0); }
function chips() { $('#depts').innerHTML = depts.length > 1 ? ['', ...depts].map(d => '<button class="chip' + (dept === d ? ' on' : '') + '" data-d="' + esc(d) + '">' + esc(d || '全部') + '</button>').join('') : ''; }
function list() {
  const q = $('#q').value.trim().toLowerCase();
  const arr = vis().filter(x => (!dept || x.d === dept) && (!q || (x.n + ' ' + x.c).toLowerCase().includes(q)));
  $('#list').innerHTML = arr.map(x => {
    const n = cart[x.i] || 0, out = x.q <= 0;
    return '<div class="it">' + (x.im ? '<img class="ph" src="' + x.im + '" alt="" data-z="' + x.i + '">' : '') + '<div class="grow"><div class="ttl">' + esc(x.n) + '</div><div class="small muted">' +
      esc([x.c, x.u ? '每' + x.u : '', D.showQty && !out ? '尚有 ' + fmt(x.q) : ''].filter(Boolean).join(' · ')) + '</div>' +
      (x.r && x.r.length ? '<div class="small" style="color:var(--brand)">' + esc(x.r.join(' · ')) + '</div>' : '') + '</div>' +
      '<div class="price">$' + fmt(x.p) + '</div>' +
      (out ? '<span class="sold">已售完</span>' : '<button class="q" data-m="' + x.i + '"' + (n ? '' : ' disabled') + '>−</button><span class="n">' + n +
        '</span><button class="q" data-p="' + x.i + '"' + (n >= x.q ? ' disabled' : '') + '>＋</button>') + '</div>';
  }).join('') || '<div class="empty">沒有符合的商品</div>';
  total();
}
// 運費 : 宅配且商品定價合計未滿免運門檻
function feeOf(amt) { return ship === '宅配' && amt > 0 && !( D.free > 0 && amt >= D.free ) ? ( D.fee || 0 ) : 0; }
function total() {
  const ls = lines(), cnt = ls.reduce((s, l) => s + l.n, 0), amt = ls.reduce((s, l) => s + l.n * l.it.p, 0), fee = feeOf(amt);
  $('#tot').textContent = cnt ? '合計 $' + fmt(amt + fee) + (fee ? ' (含運費)' : '') : '尚未選購';
  $('#cnt').textContent = cnt ? ls.length + ' 項 · ' + fmt(cnt) + ' 件' : '點 ＋ 加入商品';
  $('#go').disabled = !cnt;
  $('#sum').innerHTML = ls.map(l => esc(l.it.n) + ' × ' + fmt(l.n) + ' = $' + fmt(l.n * l.it.p)).join('<br>') + (cnt ? '<br>商品合計 $' + fmt(amt) + ' <span class="muted">(定價)</span>' +
      (ship === '宅配' ? '<br>運費 $' + fmt(fee) + (fee && D.free > 0 ? ' <span class="muted">(再買 $' + fmt(D.free - amt) + ' 免運)</span>' : fee ? '' : ' <span class="muted">(免運)</span>') : '') +
      '<br><b>應付 $' + fmt(amt + fee) + '</b>' : '') +
    (ls.some(l => l.it.r && l.it.r.length) ? '<br><span class="muted">符合條件的優惠價，店家確認訂單時會再計算。</span>' : '');
  if (!cnt) $('#form').hidden = true;
}
$('#list').onclick = e => {
  const z = e.target.closest('[data-z]'); if (z) { $('#zoom img').src = byId(Number(z.dataset.z)).im; $('#zoom').classList.add('on'); return; }
  const b = e.target.closest('button'); if (!b) return;
  const id = Number(b.dataset.p || b.dataset.m), it = byId(id);
  cart[id] = Math.max(0, Math.min(it.q, (cart[id] || 0) + (b.dataset.p ? 1 : -1)));
  if (!cart[id]) delete cart[id];
  ordNo = '';
  save(); list();
};
function segUI() {
  if (ship === '宅配' && pay === '現金') pay = '轉帳';
  document.querySelectorAll('#ship button').forEach(b => b.classList.toggle('on', b.dataset.v === ship));
  document.querySelectorAll('#pay button').forEach(b => { b.classList.toggle('on', b.dataset.v === pay); b.disabled = ship === '宅配' && b.dataset.v === '現金'; });
  $('#addrBox').hidden = ship !== '宅配';
  $('#bankBox').hidden = pay !== '轉帳';
  $('#bank').textContent = D.bank || '轉帳帳號請洽店家';
  $('#shipHint').textContent = ship === '宅配' ? '宅配需先轉帳付款，確認入帳後出貨。運費 $' + fmt(D.fee) + (D.free > 0 ? '，商品滿 $' + fmt(D.free) + ' 免運' : '') : '';
  total();
}
$('#ship').onclick = e => { const b = e.target.closest('button'); if (b) { ship = b.dataset.v; ordNo = ''; save(); segUI(); } };
$('#pay').onclick = e => { const b = e.target.closest('button'); if (b && !b.disabled) { pay = b.dataset.v; save(); segUI(); } };
$('#ad').oninput = save;
$('#zoom').onclick = () => $('#zoom').classList.remove('on');
$('#depts').onclick = e => { const c = e.target.closest('.chip'); if (c) { dept = c.dataset.d; chips(); list(); } };
$('#q').oninput = list;
$('#go').onclick = () => { $('#form').hidden = false; $('#form').scrollIntoView({ behavior: 'smooth' }); };
$('#nm').oninput = $('#ph').oninput = save;

// 訂單文字格式 : 家用進銷存「貼上會員訂單」依 #編號 品名 x 數量 @ 單價 讀回
function orderText() {
  const ls = lines(); if (!ls.length) { toast('請先選購商品'); return ''; }
  const nm = $('#nm').value.trim(), ph = $('#ph').value.trim();
  if (!nm || !ph) { toast('請填寫姓名和電話'); (nm ? $('#ph') : $('#nm')).focus(); return ''; }
  const ad = $('#ad').value.trim().replace(/\s*\n\s*/g, ' '), l5 = $('#l5').value.trim();
  if (ship === '宅配' && !ad) { toast('請填寫收件地址'); $('#ad').focus(); return ''; }
  save();
  const nt = $('#nt').value.trim().replace(/\s*\n\s*/g, ' ');
  const amt = ls.reduce((s, l) => s + l.n * l.it.p, 0), cnt = ls.reduce((s, l) => s + l.n, 0), fee = feeOf(amt);
  if (!ordNo) ordNo = 'W' + new Date().toISOString().replace(/\D/g, '').slice(2, 12) + ph.replace(/\D/g, '').slice(-3);
  return ['【訂單】' + D.title, '單號：' + ordNo, '姓名：' + nm, '電話：' + ph, '取貨：' + ship, ship === '宅配' ? '地址：' + ad : '',
    '付款：' + pay, pay === '轉帳' && l5 ? '末5碼：' + l5 : '', nt ? '備註：' + nt : '', '----',
    ...ls.map(l => '#' + l.it.i + ' ' + l.it.n + ' x ' + l.n + ' @ ' + l.it.p + ' = ' + Math.round(l.n * l.it.p * 100) / 100),
    '----', '商品 ' + cnt + ' 件 $' + fmt(amt), ship === '宅配' ? '運費 $' + fmt(fee) : '', '應付 $' + fmt(amt + fee) + ' (定價，會員優惠另計)'].filter(Boolean).join('\n');
}
$('#send').onclick = () => {
  const t = orderText(); if (!t) return;
  location.href = D.line && D.line[0] === '@' ? 'https://line.me/R/oaMessage/' + encodeURIComponent(D.line) + '/?' + encodeURIComponent(t)
    : 'https://line.me/R/share?text=' + encodeURIComponent(t);
};
function copyOrder() {
  const t = orderText(); if (!t) { if (!lines().length) toast('請先按 ＋ 選購商品'); else { $('#form').hidden = false; $('#form').scrollIntoView({ behavior: 'smooth' }); } return; }
  const ok = () => toast('已複製訂單，請到店家 LINE 聊天室貼上傳送');
  const old = () => { const a = document.createElement('textarea'); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast('無法複製'); } a.remove(); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, old); else old();
}
$('#copy').onclick = copyOrder;
$('#lineCopy').onclick = copyOrder;
$('#clr').onclick = () => { if (confirm('清空購物車？')) { cart = {}; ordNo = ''; save(); list(); } };
chips(); list(); segUI();
// 自動更新 : 店家 APP 有變動就發布到雲端 , 開啟時讀最新的 (讀不到就用網頁內建的資料)
async function liveLoad() {
  const L = D.live; if (!L || !L.c || !/^https?:/.test(location.protocol)) return;
  try {
    const u = (L.emu ? 'http://' + L.emu : 'https://firestore.googleapis.com') + '/v1/projects/' + L.p + '/databases/(default)/documents/catalogs/' + L.c, k = L.k ? '?key=' + L.k : '';
    const get = async x => { const r = await fetch(u + x + k, { cache: 'no-store' }); if (!r.ok) throw new Error(r.status); return (await r.json()).fields; };
    const m = await get(''), n = Number(m.n.integerValue);
    const ps = await Promise.all(Array.from({ length: n }, (_, i) => get('/p/' + i)));
    const nd = JSON.parse(ps.map(f => f.j.stringValue).join(''));
    if (!nd || !Array.isArray(nd.items)) return;
    Object.assign(D, nd); clampCart(); head(); chips(); list(); segUI();
  } catch (e) { }
}
liveLoad();
