// app.js — Adri's Recomposition Tracker
const STORE_KEY = "adri_ft_data_v1";
const CFG_KEY = "adri_ft_cfg_v1";

let db = load();
let cfg = loadCfg();
let state = { view: "today", dayId: todayDayId() };

function todayDayId(){
  const map = ["sun","mon","tue","wed","thu","fri","sat"];
  return map[new Date().getDay()];
}
function todayStr(){ return new Date().toISOString().slice(0,10); }

function load(){
  try{ return JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); }catch(e){ return {}; }
}
function save(){
  localStorage.setItem(STORE_KEY, JSON.stringify(db));
}
function loadCfg(){
  try{ return JSON.parse(localStorage.getItem(CFG_KEY) || "{}"); }catch(e){ return {}; }
}
function saveCfg(){
  localStorage.setItem(CFG_KEY, JSON.stringify(cfg));
}

function entryFor(date, dayId, exId){
  db[date] = db[date] || {};
  db[date][exId] = db[date][exId] || { done:false, sets:{} };
  return db[date][exId];
}

function dayById(id){ return PROGRAM.days.find(d => d.id === id); }

function pctDoneForDay(date, day){
  if(!day.exercises.length) return 0;
  const d = db[date] || {};
  const doneCount = day.exercises.filter(ex => d[ex.id] && d[ex.id].done).length;
  return Math.round((doneCount / day.exercises.length) * 100);
}

function render(){
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(renderTopbar());
  if(state.view === "today") app.appendChild(renderToday());
  if(state.view === "dashboard") app.appendChild(renderDashboard());
  if(state.view === "settings") app.appendChild(renderSettings());
  app.appendChild(renderBottomNav());
}

function el(tag, cls, html){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(html !== undefined) e.innerHTML = html;
  return e;
}

function renderTopbar(){
  const wrap = el("div", "topbar");
  const left = el("div");
  left.appendChild(el("div", "eyebrow", "RECOMPOSITION PLAN"));
  left.appendChild(el("h1", "", "Adri's Tracker"));
  wrap.appendChild(left);

  const day = dayById(state.dayId) || dayById(todayDayId());
  const pct = pctDoneForDay(todayStr(), day);
  const dial = el("div", "range-dial");
  dial.style.setProperty("--pct", pct);
  dial.appendChild(el("div", "lbl", pct + "%"));
  wrap.appendChild(dial);
  return wrap;
}

function renderToday(){
  const frag = document.createDocumentFragment();

  const tabs = el("div", "day-tabs");
  PROGRAM.days.forEach(d => {
    const btn = el("button", "day-tab" + (d.id === state.dayId ? " active" : "") + (pctDoneForDay(todayStr(), d) === 100 && d.exercises.length ? " done" : ""), d.label.slice(0,3).toUpperCase());
    btn.onclick = () => { state.dayId = d.id; render(); };
    tabs.appendChild(btn);
  });
  frag.appendChild(tabs);

  const day = dayById(state.dayId);
  const heading = el("div", "day-heading");
  heading.appendChild(el("div", "title", day.title));
  heading.appendChild(el("div", "sub", day.label + (day.exercises.length ? " · " + day.exercises.length + " exercises" : " · rest day")));
  frag.appendChild(heading);

  if(day.id === "sun"){
    frag.appendChild(el("div", "rest-note", "Full rest. Recovery is part of the program, not a gap in it."));
    return frag;
  }

  if(day.id === "wed" || day.id === "sat"){
    day.exercises.forEach(ex => {
      const block = el("div", "cardio-block");
      block.appendChild(el("div", "big", ex.secs));
      block.appendChild(el("div", "", ex.name));
      const e = entryFor(todayStr(), day.id, ex.id);
      const btn = el("button", "check-btn" + (e.done ? " on" : ""), e.done ? "✓" : "");
      btn.style.marginTop = "12px";
      btn.onclick = () => { e.done = !e.done; save(); render(); };
      block.appendChild(document.createElement("br"));
      block.appendChild(btn);
      frag.appendChild(block);
    });
    frag.appendChild(el("div", "rest-note", PROGRESSION_NOTE));
    return frag;
  }

  day.exercises.forEach(ex => {
    const e = entryFor(todayStr(), day.id, ex.id);
    const card = el("div", "card");
    const top = el("div", "row-top");
    const left = el("div");
    left.appendChild(el("div", "name", ex.name));
    left.appendChild(el("div", "target", ex.target));
    top.appendChild(left);
    const btn = el("button", "check-btn" + (e.done ? " on" : ""), e.done ? "✓" : "");
    btn.onclick = () => { e.done = !e.done; save(); render(); };
    top.appendChild(btn);
    card.appendChild(top);

    const spec = el("div", "spec");
    spec.appendChild(el("span", "", ex.sets ? ex.sets + " sets" : ""));
    spec.appendChild(el("span", "", ex.reps ? ex.reps + " reps" : (ex.secs ? ex.secs : "")));
    spec.appendChild(el("span", "", "Rest " + ex.rest));
    card.appendChild(spec);

    const logRow = el("div", "log-row");
    const bandInput = el("input");
    bandInput.type = "text"; bandInput.placeholder = "Band / weight";
    bandInput.value = e.sets.band || "";
    bandInput.oninput = () => { e.sets.band = bandInput.value; save(); };
    const notesInput = el("input");
    notesInput.type = "text"; notesInput.placeholder = "Notes";
    notesInput.value = e.sets.notes || "";
    notesInput.oninput = () => { e.sets.notes = notesInput.value; save(); };
    logRow.appendChild(bandInput);
    logRow.appendChild(notesInput);
    card.appendChild(logRow);

    frag.appendChild(card);
  });

  frag.appendChild(el("div", "rest-note", PROGRESSION_NOTE));
  return frag;
}

function renderDashboard(){
  const frag = document.createDocumentFragment();
  frag.appendChild(el("div", "section-title", "This Week"));

  const dates = [];
  const now = new Date();
  for(let i=6;i>=0;i--){
    const dt = new Date(now); dt.setDate(now.getDate()-i);
    dates.push(dt.toISOString().slice(0,10));
  }

  let totalPct = 0, activeDays = 0;
  const bars = el("div", "week-bars");
  dates.forEach(dateStr => {
    const dow = new Date(dateStr).getDay();
    const map = ["sun","mon","tue","wed","thu","fri","sat"];
    const day = dayById(map[dow]);
    const pct = day.exercises.length ? pctDoneForDay(dateStr, day) : 0;
    if(day.exercises.length){ totalPct += pct; activeDays++; }
    const bar = el("div", "bar" + (pct===100 && day.exercises.length ? " done" : ""));
    bar.style.height = Math.max(6, pct * 0.6) + "px";
    bar.style.position = "relative";
    const lbl = el("div", "day-lbl", day.label.slice(0,2));
    bar.appendChild(lbl);
    bars.appendChild(bar);
  });
  frag.appendChild(bars);

  const grid = el("div", "stat-grid");
  const s1 = el("div", "stat");
  s1.appendChild(el("div", "num", activeDays ? Math.round(totalPct/activeDays)+"%" : "—"));
  s1.appendChild(el("div", "lbl", "Weekly completion"));
  grid.appendChild(s1);

  const s2 = el("div", "stat");
  const totalSessions = Object.keys(db).length;
  s2.appendChild(el("div", "num", String(totalSessions)));
  s2.appendChild(el("div", "lbl", "Logged sessions all-time"));
  grid.appendChild(s2);
  frag.appendChild(grid);

  frag.appendChild(el("div", "rest-note", "Progress here tracks consistency, not just load. For a recomposition plan starting from sedentary, showing up on the joint-friendly days matters as much as the reps."));
  return frag;
}

function renderSettings(){
  const frag = document.createDocumentFragment();
  frag.appendChild(el("div", "section-title", "Settings"));

  const f1 = el("div", "settings-field");
  f1.appendChild(el("label", "", "Google Apps Script Web App URL"));
  const input = document.createElement("input");
  input.value = cfg.scriptUrl || "";
  input.placeholder = "https://script.google.com/macros/s/.../exec";
  input.oninput = () => { cfg.scriptUrl = input.value; saveCfg(); };
  f1.appendChild(input);
  frag.appendChild(f1);

  const syncBtn = el("button", "btn-primary", "Sync now");
  const status = el("div", "sync-status", cfg.lastSync ? ("Last synced " + cfg.lastSync) : "Not synced yet");
  syncBtn.onclick = async () => {
    if(!cfg.scriptUrl){ status.textContent = "Add your Apps Script URL first."; return; }
    status.textContent = "Syncing...";
    try{
      const res = await fetch(cfg.scriptUrl, {
        method: "POST",
        body: JSON.stringify({ data: db }),
        headers: { "Content-Type": "text/plain;charset=utf-8" }
      });
      if(!res.ok) throw new Error("Sync failed");
      cfg.lastSync = new Date().toLocaleString();
      saveCfg();
      status.textContent = "Last synced " + cfg.lastSync;
    }catch(e){
      status.textContent = "Sync failed — check the URL and that the script is deployed as 'Anyone' access.";
    }
  };
  frag.appendChild(syncBtn);
  frag.appendChild(status);

  const resetBtn = el("button", "btn-primary", "Clear local data");
  resetBtn.style.background = "transparent";
  resetBtn.style.border = "1px solid var(--line)";
  resetBtn.style.color = "var(--text-dim)";
  resetBtn.onclick = () => {
    if(confirm("Clear all locally logged workouts? This can't be undone.")){
      db = {}; save(); render();
    }
  };
  frag.appendChild(resetBtn);

  return frag;
}

function renderBottomNav(){
  const nav = el("div", "bottom-nav");
  [["today","TODAY"],["dashboard","PROGRESS"],["settings","SETTINGS"]].forEach(([id,label]) => {
    const btn = el("button", "nav-btn" + (state.view===id ? " active" : ""), label);
    btn.onclick = () => { state.view = id; render(); };
    nav.appendChild(btn);
  });
  return nav;
}

render();

if("serviceWorker" in navigator){
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(()=>{});
  });
}
