/* FOG sin cuenta: guarda los países en el propio dispositivo (localStorage).
   Misma interfaz que fog-shim.js (window.claude.use("db")), más botones para guardar y cargar una copia. */
(() => {
  "use strict";
  const KEY = "foglocal.data";
  const LS = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); return true; } catch(e){ return false; } } };
  let state = {};
  try { state = JSON.parse(LS.get(KEY) || "{}") || {}; } catch(e){ state = {}; }
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e){}
  const listeners = [];
  const clone = o => o === undefined ? undefined : JSON.parse(JSON.stringify(o));
  const split = p => { const i = p.indexOf("/"); return [p.slice(0, i), p.slice(i + 1)]; };
  const snap = p => { const [c, id] = split(p); const v = state[c] && state[c][id]; return { id, exists: v !== undefined, data: () => clone(v) }; };
  function emit(){ listeners.forEach(l => { try { l.cb(snap(l.path)); } catch(e){ console.error(e); } }); }
  function mutate(fn){ fn(state); LS.set(KEY, JSON.stringify(state)); emit(); return Promise.resolve(); }
  window.addEventListener("storage", e => { if (e.key === KEY){ try { state = JSON.parse(e.newValue || "{}") || {}; } catch(_){} emit(); } });

  const db = { doc(path){ const [c, id] = split(path); return {
    set: d => mutate(s => { (s[c] = s[c] || {})[id] = clone(d); }),
    update: p => mutate(s => { s[c] = s[c] || {}; s[c][id] = Object.assign(s[c][id] || {}, clone(p)); }),
    delete: () => mutate(s => { if (s[c]) delete s[c][id]; }),
    get: async () => snap(path),
    onSnapshot(cb){ const l = { path, cb }; listeners.push(l); setTimeout(() => cb(snap(path)), 0); return () => { const i = listeners.indexOf(l); if (i >= 0) listeners.splice(i, 1); }; }
  }; } };

  /* ---------- copia de seguridad ---------- */
  function msg(t){ const el = document.getElementById("fogcopymsg"); if (el) el.textContent = t; }
  async function saveCopy(){
    const codes = (state.mapa && state.mapa.visitados && state.mapa.visitados.codes) || [];
    const nc = ((state.mapa && state.mapa.ciudades && state.mapa.ciudades.list) || []).length;
    const txt = JSON.stringify({ app: "FOG", saved: new Date().toISOString(), data: state });
    const name = "FOG-mis-paises-" + new Date().toISOString().slice(0, 10) + ".json";
    const file = new File([txt], name, { type: "application/json" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] })){ await navigator.share({ files: [file], title: "Copia de FOG" }); msg(`Copia lista, ${codes.length} países y ${nc} ciudades. Guárdala en Archivos o mándatela por WhatsApp.`); return; }
    } catch(e){ if (e && e.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = name; document.body.append(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
    msg(`Copia descargada, ${codes.length} países y ${nc} ciudades.`);
  }
  function loadCopy(f){
    const r = new FileReader();
    r.onload = () => {
      try {
        const d = JSON.parse(r.result);
        let v = d && d.data && d.data.mapa && d.data.mapa.visitados;
        if (!v && d && Array.isArray(d.codes)) v = d;
        if (!v || !Array.isArray(v.codes)) throw new Error("formato");
        const cs = d && d.data && d.data.mapa && d.data.mapa.ciudades && Array.isArray(d.data.mapa.ciudades.list) ? d.data.mapa.ciudades.list : null;
        mutate(s => { s.mapa = s.mapa || {}; s.mapa.visitados = { codes: v.codes, updatedAt: new Date().toISOString() };
          if (cs) s.mapa.ciudades = { list: cs, updatedAt: new Date().toISOString() }; });
        msg(`Copia cargada, ${v.codes.length} países` + (cs ? ` y ${cs.length} ciudades.` : "."));
      } catch(e){ msg("Ese archivo no es una copia de FOG."); }
    };
    r.readAsText(f);
  }
  function addCopyUI(){
    const css = document.createElement("style");
    css.textContent = `.fogcopy{margin:28px 0 8px;padding:16px;border:1px solid var(--line,#CDD5D2);border-radius:14px;display:grid;gap:10px}
      .fogcopy p{margin:0;font-size:.85rem;color:var(--muted,#5B6B6F)}.fogcopy .fogrow{display:flex;gap:8px;flex-wrap:wrap}
      .fogcopy button{border:0;border-radius:999px;padding:10px 16px;font:600 14px inherit;font-family:inherit;cursor:pointer;background:var(--visit,#D9901A);color:#fff}
      .fogcopy button.sec{background:transparent;color:var(--ink,#1C2A2E);border:1px solid var(--line,#CDD5D2)}`;
    document.head.append(css);
    const box = document.createElement("section"); box.className = "fogcopy";
    box.innerHTML = `<p><b>Tus países se guardan en este móvil.</b> Si vas a cambiar de móvil o borrar la app, guarda antes una copia.</p>
      <div class="fogrow"><button type="button" id="fogsave">Guardar copia</button><button type="button" class="sec" id="fogload">Cargar copia</button></div>
      <input type="file" id="fogfile" accept=".json,application/json" hidden><p id="fogcopymsg" aria-live="polite"></p>`;
    (document.querySelector(".wrap") || document.body).append(box);
    box.querySelector("#fogsave").onclick = saveCopy;
    const inp = box.querySelector("#fogfile");
    box.querySelector("#fogload").onclick = () => inp.click();
    inp.onchange = () => { if (inp.files[0]) loadCopy(inp.files[0]); inp.value = ""; };
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", addCopyUI); else addCopyUI();

  window.claude = { use(name){ return name === "db" ? Promise.resolve(db) : Promise.reject(Object.assign(new Error("unavailable"), { code: "unavailable" })); } };
})();
