// Smoke test 3: exam-week "list-only" paper behaviour.
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const rawHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const wordsJs = fs.readFileSync(path.join(__dirname, "words-en.js"), "utf8");

function ymd(offsetDays){
  const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() + offsetDays);
  const p = n => String(n).padStart(2,"0");
  return d.getFullYear() + "-" + p(d.getMonth()+1) + "-" + p(d.getDate());
}
const LIST = [{w:"apple",lvl:2},{w:"banana",lvl:2},{w:"cherry",lvl:2}];

function run(examOffset){
  return new Promise((resolve) => {
    const seed = "<script>localStorage.setItem('ls.sets'," +
      JSON.stringify(JSON.stringify([{ id:"exam1", name:"Exam", enabled:true,
        examDate: ymd(examOffset), words: LIST }])) + ");<\/script>";
    const html = rawHtml.replace('<script src="words-en.js"></script>', seed + '<script>' + wordsJs + '</script>');

    const store = {};
    const localStorage = {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    };
    const errors = [];
    const dom = new JSDOM(html, {
      runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
      url: "http://localhost/",
      beforeParse(window) {
        window.localStorage = localStorage;
        window.speechSynthesis = { getVoices: () => [], cancel(){}, speak(){}, onvoiceschanged: null };
        window.SpeechSynthesisUtterance = function(t){ this.text=t; };
        window.AudioContext = function(){ return {
          currentTime:0, destination:{},
          createOscillator:()=>({frequency:{},connect(){},start(){},stop(){}}),
          createGain:()=>({gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}})
        };};
        window.requestAnimationFrame = () => 0;
        window.HTMLCanvasElement.prototype.getContext = () => ({ clearRect(){},save(){},translate(){},rotate(){},fillRect(){},restore(){} });
        window.confirm = () => true; window.alert = () => {};
        window.addEventListener("error", (e) => errors.push(String(e.error && e.error.stack || e.message)));
      },
    });
    setTimeout(() => resolve({ window: dom.window, errors }), 250);
  });
}

function makeProfileAndPlay(win){
  const doc = win.document;
  doc.querySelector(".profile-card.add").click();
  doc.getElementById("pfName").value = "Kid";
  doc.getElementById("pfDob").value = "2017-06-01";
  doc.getElementById("pfSave").click();
  doc.querySelectorAll(".profile-card:not(.add)")[0].click();
  doc.getElementById("progPlayBtn").click();
  return doc;
}

(async () => {
  const results = [];
  const check = (name, cond) => results.push([name, !!cond]);
  const wordsInList = new Set(LIST.map(w => w.w));

  // --- Scenario A: exam in 3 days -> list-only ---
  {
    const { window, errors } = await run(3);
    check("A: no boot errors", errors.length === 0);
    const doc = makeProfileAndPlay(window);
    check("A: examFocusDays returns 3", window.examFocusDays() === 3);
    // buildPaper is a global function; call it directly and inspect picks.
    let ok = true, allParent = true, count = 0;
    for (let i = 0; i < 20; i++) {
      const paper = window.buildPaper();
      count = paper.length;
      if (paper.length !== 10) ok = false;
      for (const w of paper) { if (!wordsInList.has(w.w)) ok = false; if (w._src !== "parent") allParent = false; }
    }
    check("A: paper has 10 words", count === 10);
    check("A: every word comes from the exam list (list-only)", ok);
    check("A: every word is a parent/star word", allParent);
    check("A: exam banner shown on game screen", !doc.getElementById("examBanner").classList.contains("hidden"));
    check("A: banner mentions exam week", /exam week/i.test(doc.getElementById("examBanner").textContent));
  }

  // --- Scenario B: exam in 20 days -> NOT list-only (mixed) ---
  {
    const { window } = await run(20);
    makeProfileAndPlay(window);
    check("B: examFocusDays is null (outside final week)", window.examFocusDays() === null);
    let sawBuiltin = false, len = 0;
    for (let i = 0; i < 30; i++) {
      const paper = window.buildPaper();
      len = paper.length;
      if (paper.some(w => w._src !== "parent")) sawBuiltin = true;
    }
    check("B: paper still has 10 words", len === 10);
    check("B: built-in ladder words still appear (not list-only)", sawBuiltin);
    check("B: banner hidden outside final week",
      window.document.getElementById("examBanner").classList.contains("hidden"));
  }

  let pass = 0;
  for (const [name, ok] of results) { console.log((ok ? "PASS  " : "FAIL  ") + name); if (ok) pass++; }
  console.log(`\n${pass}/${results.length} checks passed`);
  process.exit(pass === results.length ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
