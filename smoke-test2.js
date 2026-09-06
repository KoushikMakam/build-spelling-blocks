// End-to-end flow test: correct answer advances & scores; wrong answer triggers practice.
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const rawHtml = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const wordsJs = fs.readFileSync(path.join(__dirname, "words-en.js"), "utf8");

// Seed settings + a young profile BEFORE the engine script runs, and inline the word bank.
const seed = `<script>
localStorage.setItem('ls.settings', JSON.stringify({showWord:true,autoSpeak:false,escalate:false,repeats:3,voice:''}));
localStorage.setItem('ls.profiles', JSON.stringify([{id:'pT',name:'Kid',dob:'2020-01-01',avatar:'🦖',color:'#38b000'}]));
localStorage.setItem('ls.active','pT');
</script>`;
let html = rawHtml.replace('<script src="words-en.js"></script>', '<script>' + wordsJs + '</script>');
html = html.replace('</head>', seed + '</head>');

const errors = [];
const dom = new JSDOM(html, {
  runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, url: "http://localhost/",
  beforeParse(window) {
    window.speechSynthesis = { getVoices: () => [], cancel(){}, speak(){}, onvoiceschanged:null };
    window.SpeechSynthesisUtterance = function(t){ this.text=t; };
    window.AudioContext = function(){ return { currentTime:0, destination:{},
      createOscillator:()=>({frequency:{},connect(){},start(){},stop(){}}),
      createGain:()=>({gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}) };};
    window.requestAnimationFrame = (cb)=>{ return 0; };
    window.HTMLCanvasElement.prototype.getContext = () => ({clearRect(){},save(){},translate(){},rotate(){},fillRect(){},restore(){}});
    window.confirm = () => false; // hint: choose "reveal first letter" path when tested
    window.alert = () => {};
    window.addEventListener("error",(e)=>errors.push(e.error&&e.error.stack||e.message));
  }
});
const { window } = dom;

// Speed up: make setTimeout resolve fast so onCorrect/nextWord chains complete.
const realST = window.setTimeout;

setTimeout(() => {
  const doc = window.document;
  const results = [];
  const check = (n,c)=>results.push([n,!!c]);
  const LSget = (k)=>{ try{return JSON.parse(window.localStorage.getItem(k));}catch(e){return null;} };

  function currentWordFromHint(){
    // showWord true & level<4 → hintword spans contain the letters (case may vary by level)
    const spans = [...doc.querySelectorAll("#hintword span")];
    return spans.map(s=>s.textContent.toLowerCase()).join("");
  }
  function typeWord(w){
    const keyEls={};
    doc.querySelectorAll("#keyboard .key").forEach(k=>{ if(k.dataset.ch && /^[a-z']$/.test(k.dataset.ch)) keyEls[k.dataset.ch]=k; });
    for(const ch of w){ const c=ch.toLowerCase(); if(keyEls[c]) keyEls[c].click(); }
  }

  // Boot → pick profile (auto via active) shows progress; start playing
  doc.querySelectorAll(".profile-card:not(.add)")[0].click();
  doc.getElementById("progPlayBtn").click();
  check("game active", doc.getElementById("screen-game").classList.contains("active"));

  const w1 = currentWordFromHint();
  check("could read target word (showWord)", w1.length >= 1);
  const scoreBefore = parseInt(doc.getElementById("score").textContent,10);

  // Type correct word and submit
  typeWord(w1);
  check("typed full word", doc.querySelectorAll("#tray .brick").length === w1.length);
  doc.getElementById("submitBtn").click();

  // The submit chain uses setTimeout; wait for it.
  realST(() => {
    const scoreAfter = parseInt(doc.getElementById("score").textContent,10);
    check("score increased after correct", scoreAfter > scoreBefore);
    const wordNum = parseInt(doc.getElementById("wordnum").textContent,10);
    check("advanced to word 2", wordNum === 2);

    // Now force a WRONG answer on word 2 → practice mode
    const w2 = currentWordFromHint();
    // type a deliberately wrong word (append 'z')
    typeWord("z");
    // pad to at least 1 letter already done; submit wrong
    doc.getElementById("submitBtn").click();
    realST(() => {
      check("practice banner shown after wrong", !doc.getElementById("practiceArea").classList.contains("hidden"));
      check("practice target matches word", doc.getElementById("practiceTarget").textContent.toLowerCase() === w2.toLowerCase());

      // Complete practice: build w2 correctly 'repeats' (3) times, spaced so the
      // submit/review animation (and the submitting lock) clears between reps.
      const repeats = 3;
      function doRep(i){
        if(i>=repeats){
          realST(() => {
            const movedOn = parseInt(doc.getElementById("wordnum").textContent,10) >= 3
                            || doc.getElementById("screen-paper").classList.contains("active");
            check("moved past word after practice", movedOn);
            finish();
          }, 1500);
          return;
        }
        typeWord(w2);
        doc.getElementById("submitBtn").click();
        realST(()=>doRep(i+1), 1400);
      }
      doRep(0);

      function finish(){
        let pass=0;
        results.forEach(([n,o])=>{ console.log((o?"PASS":"FAIL")+"  "+n); if(o)pass++; });
        if(errors.length){ console.log("\n--- errors ---"); errors.forEach(e=>console.log(e)); }
        console.log(`\n${pass}/${results.length} checks passed`);
        process.exit(pass===results.length && errors.length===0 ?0:1);
      }
    }, 1300);
  }, 2800);
}, 500);

