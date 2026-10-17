/* FOG Pro: license gate. One purchase code, checked by its SHA-256 hash (the code itself is not in this file).
   Buyers receive the code on the Stripe confirmation page after paying. */
(() => {
  "use strict";
  const CODE_HASH = "c0887484c9e25505f64df14c11661e9542e817db2ff8fd5daf0384c0ec25c2df";
  const BUY_URL = "https://buy.stripe.com/28E14h9Dc4vh0zL5SQ0sU00";
  const K = "fog.pro.unlocked";
  const LS = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} } };
  const css = document.createElement("style");
  css.textContent = `.foglic{position:fixed;inset:0;z-index:80;display:grid;place-items:center;background:var(--bg,#F5FBF8);padding:24px}
  .foglic .box{background:var(--card,#fff);color:var(--ink,#0E3B33);border:1px solid var(--line,#D2E6DE);border-radius:16px;padding:28px 26px;max-width:400px;width:100%;display:grid;gap:14px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.08)}
  .foglic h2{font-size:40px;letter-spacing:-.02em;margin:0}.foglic p{margin:0;color:var(--muted,#4F6E66);font-size:14px}
  .foglic input{font:inherit;font-size:16px;padding:12px 14px;border-radius:8px;border:1px solid var(--line,#D2E6DE);text-align:center;width:100%;box-sizing:border-box}
  .foglic button,.foglic a.b{border:0;border-radius:999px;background:var(--visit,#F5A623);color:#fff;font:700 15px inherit;font-family:inherit;padding:12px 20px;cursor:pointer;text-decoration:none;display:block}
  .foglic a.b.sec{background:transparent;color:var(--ink,#0E3B33);border:1px solid var(--line,#D2E6DE)}
  .foglic .err{color:#B3261E;min-height:1.2em;font-size:13px}`;
  document.head.append(css);
  async function sha(t){ const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)); return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join(""); }
  const norm = s => s.trim().toUpperCase().replace(/\s+/g, "");
  function gate(){
    const d = document.createElement("div"); d.className = "foglic";
    d.innerHTML = `<div class="box"><h2>FOG</h2>
      <p>Enter the license code you received after your purchase. You only need to do it once on each device.</p>
      <input id="foglk" placeholder="FOG-XXXX-XXXX-XXXX" autocomplete="off" autocapitalize="characters" spellcheck="false">
      <button type="button" id="fogact">Unlock</button>
      <p class="err" id="fogerr" aria-live="polite"></p>
      <a class="b sec" href="${BUY_URL}" target="_blank" rel="noopener">Buy FOG, 4 EUR</a></div>`;
    document.body.append(d);
    const err = d.querySelector("#fogerr");
    const go = async () => {
      const v = norm(d.querySelector("#foglk").value);
      if (!v){ err.textContent = "Paste your license code."; return; }
      try {
        if ((await sha(v)) === CODE_HASH){ LS.set(K, CODE_HASH); d.remove(); }
        else err.textContent = "That code is not valid. Check it and try again.";
      } catch(e){ err.textContent = "Your browser could not check the code. Open FOG in Safari or Chrome."; }
    };
    d.querySelector("#fogact").onclick = go;
    d.querySelector("#foglk").addEventListener("keydown", e => { if (e.key === "Enter") go(); });
  }
  function start(){ if (LS.get(K) !== CODE_HASH) gate(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
