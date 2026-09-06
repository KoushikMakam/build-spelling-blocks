// Smoke test: load index.html in jsdom, boot the engine, exercise core logic.
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const rawHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const wordsJs = fs.readFileSync(path.join(__dirname, "words-en.js"), "utf8");
// Inline words-en.js so it's available synchronously at boot (browsers load <script src> in order;
// jsdom loads external scripts async, which would otherwise leave PACK.bank empty).
const html = rawHtml.replace('<script src="words-en.js"></script>', '<script>' + wordsJs + '</script>');

// Minimal localStorage
const store = {};
const localStorage = {
  getItem: (k) => (k in store ? store[k] : null),
  setItem: (k, v) => { store[k] = String(v); },
  removeItem: (k) => { delete store[k]; },
};

const errors = [];
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
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
    window.HTMLCanvasElement.prototype.getContext = () => ({
      clearRect(){},save(){},translate(){},rotate(){},fillRect(){},restore(){}
    });
    window.confirm = () => true;
    window.alert = (m) => { /* swallow */ };
    window.addEventListener("error", (e) => errors.push("window error: " + (e.error && e.error.stack || e.message)));
  },
});

const { window } = dom;

// Wait a tick for scripts to run
setTimeout(() => {
  const results = [];
  function check(name, cond) { results.push([name, !!cond]); }

  const doc = window.document;
  const LSget = (k) => { try { return JSON.parse(window.localStorage.getItem(k)); } catch(e){ return null; } };

  // words-en.js is inlined by the harness; should be present at boot.
  check("word bank loaded (>=80 words)", window.WORD_BANK_EN && window.WORD_BANK_EN.length >= 80);
  check("home screen exists", doc.getElementById("screen-home"));
  check("profile grid rendered add tile", doc.querySelector(".profile-card.add"));
  check("keyboard container present", doc.getElementById("keyboard"));
  check("no boot errors", errors.length === 0);

  // Simulate creating a profile via the exposed globals is not possible (IIFE-less but not global).
  // Instead, drive through the DOM: open profile editor, fill, save.
  doc.querySelector(".profile-card.add").click();
  check("profile overlay opens", doc.getElementById("profileOverlay").classList.contains("show"));
  doc.getElementById("pfName").value = "Test";
  doc.getElementById("pfDob").value = "2017-06-01";
  doc.getElementById("pfSave").click();
  const profiles = LSget("ls.profiles") || [];
  check("profile saved to storage", profiles.length === 1 && profiles[0].name === "Test");

  // Pick the profile -> should go to progress screen
  doc.querySelectorAll(".profile-card:not(.add)")[0].click();
  check("progress screen active after pick", doc.getElementById("screen-progress").classList.contains("active"));

  // Start playing
  doc.getElementById("progPlayBtn").click();
  check("game screen active after play", doc.getElementById("screen-game").classList.contains("active"));
  check("tray has slots for a word", doc.querySelectorAll("#tray .slot, #tray .brick").length > 0);
  check("on-screen keyboard built", doc.querySelectorAll("#keyboard .key").length >= 26);

  // Type letters via on-screen keys should add bricks
  const keys = {};
  doc.querySelectorAll("#keyboard .key").forEach(k => { if(k.dataset.ch) keys[k.dataset.ch] = k; });
  // Figure out the current word by reading the number of slots
  const slotCount = doc.querySelectorAll("#tray .slot").length;
  check("word has >=1 slot", slotCount >= 1);

  // Exercise input: type the current word's letters using on-screen keys.
  // Derive the word from the active profile's paper via global state isn't exposed,
  // so instead type letters matching the number of slots from the hint if visible,
  // else just verify typing adds bricks and clear works.
  const keyEls = {};
  doc.querySelectorAll("#keyboard .key").forEach(k => { if(k.dataset.ch && /^[a-z]$/.test(k.dataset.ch)) keyEls[k.dataset.ch] = k; });
  keyEls["a"].click(); keyEls["b"].click();
  check("typing adds bricks", doc.querySelectorAll("#tray .brick").length === 2);
  doc.getElementById("clearBtn").click();
  check("clear removes bricks", doc.querySelectorAll("#tray .brick").length === 0);

  // Backspace behaviour
  keyEls["c"].click(); keyEls["d"].click(); keyEls["e"].click();
  doc.getElementById("backspaceBtn").click();
  check("backspace removes last brick", doc.querySelectorAll("#tray .brick").length === 2);

  // Tap a specific brick to remove it (middle-letter fix)
  doc.querySelectorAll("#tray .brick")[0].click();
  check("tap-brick removes that brick", doc.querySelectorAll("#tray .brick").length === 1);

  // Parent PIN gate: first entry should prompt to set a new PIN
  doc.getElementById("homeBtn").click();
  doc.getElementById("parentBtn").click();
  check("PIN overlay opens on parent zone", doc.getElementById("pinOverlay").classList.contains("show"));
  doc.getElementById("pinInput").value = "123";
  doc.getElementById("pinOk").click();
  check("parent zone opens after setting PIN", doc.getElementById("parentOverlay").classList.contains("show"));
  check("PIN stored", LSget("ls.pin") === "123");

  // Word-set list shows the built-in ladder row
  check("set list shows built-in ladder", /Built-in ladder/.test(doc.getElementById("setList").textContent));

  // Report
  let pass = 0;
  results.forEach(([n, ok]) => { console.log((ok ? "PASS" : "FAIL") + "  " + n); if (ok) pass++; });
  if (errors.length) { console.log("\n--- errors ---"); errors.forEach(e => console.log(e)); }
  console.log(`\n${pass}/${results.length} checks passed`);
  process.exit(pass === results.length ? 0 : 1);
}, 500);
