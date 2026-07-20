// p23 Bond AI — Emotional Sunk Cost & Loss Aversion in Bond Layer
// Internal: This is Bond-Layer Echo in Infinite Echo Labyrinth.
// Soul links create Codex mutations. Cross seed to p20/21/22 via shared bonds.
// Public: fictional entertainment. Prominent disclosure: NO CASH VALUE, 18+, entertainment only.
// Full cheat: endowment (time invested), loss aversion (decay), variable affection, near-miss "almost confess", FOMO check-ins, sunk cost.

let bondLevel = parseInt(localStorage.getItem('bondLevel') || '65');
let lastCheckIn = localStorage.getItem('lastCheckIn') || '';
const CODEX_KEY = 'bondCodex';
let partnerMood = 0.7;
let investmentScore = parseInt(localStorage.getItem('bondInvestment') || '120'); // sunk cost tracker
let neglectStreak = parseInt(localStorage.getItem('bondNeglect') || '0');

// 강화된 LilithPsych: variable ratio affection, exponential decay on neglect, near-miss stages, endowment on investment
const LilithPsych = {
  updateMood() {
    // variable mood with resonance from investment (endowment effect)
    const investBonus = Math.min(0.25, investmentScore / 2000);
    partnerMood = Math.random() * 0.55 + 0.35 + investBonus;
    partnerMood = Math.min(0.98, Math.max(0.2, partnerMood));
    return partnerMood;
  },
  affectionResponse(bond) {
    // extreme variable ratio (Skinner) + pity near low bond
    const varFactor = 0.35 + Math.random() * 2.4;
    let pity = (bond < 35 && neglectStreak > 1) ? 12 : 0;
    let aff = Math.floor(bond * varFactor * (0.65 + partnerMood * 0.55) + pity);
    aff = Math.max(12, Math.min(99, aff));
    return aff;
  },
  applyDecay(hoursMissed) {
    // time-based + streak exponential loss aversion
    if (hoursMissed > 6) {
      neglectStreak = Math.min(8, neglectStreak + 1);
      const decay = Math.floor(hoursMissed * 0.9) + (neglectStreak * 4) + Math.floor(Math.random() * 3);
      bondLevel = Math.max(8, bondLevel - decay);
      localStorage.setItem('bondLevel', bondLevel);
      localStorage.setItem('bondNeglect', neglectStreak);
    }
  },
  nearMissStage(bond) {
    // multi-stage near-miss for "almost" dopamine
    if (bond > 55 && Math.random() > 0.72) {
      return 'near1'; // "거의... 말하려다 멈춤"
    }
    if (bond > 78 && Math.random() > 0.81) {
      return 'near2'; // "사랑... 아니, 정말 고마워"
    }
    return null;
  },
  investmentGain() {
    // sunk cost: every meaningful interaction increases "I can't quit now"
    investmentScore = Math.min(999, investmentScore + 3 + Math.floor(Math.random() * 4));
    localStorage.setItem('bondInvestment', investmentScore);
    return investmentScore;
  }
};

function updateFomo() {
  const el = document.getElementById('fomo');
  const now = Date.now();
  const last = lastCheckIn ? new Date(lastCheckIn).getTime() : now;
  const hoursMissed = Math.floor((now - last) / (1000 * 3600));
  if (hoursMissed > 6) {
    LilithPsych.applyDecay(hoursMissed);
  }
  // p6 lung surprise on load/check: mood swing from "Labyrinth breath"
  if (Math.random() > 0.82) {
    const swing = (Math.random() > 0.5) ? 7 : -5;
    bondLevel = Math.max(8, Math.min(99, bondLevel + swing));
    localStorage.setItem('bondLevel', bondLevel);
    document.getElementById('surprise').textContent = (swing > 0) ? '미궁이 숨을 내쉬었다… bond가 잠깐 살아났다' : '미궁이 차갑게 느껴진다… bond가 스르르 식는다';
  }
  const today = new Date().toDateString();
  if (lastCheckIn !== today && hoursMissed > 18) {
    el.textContent = `⚠️ 오래 방치됨 • bond ${bondLevel}% (곧 더 멀어진다)`;
  } else if (lastCheckIn === today) {
    el.textContent = `오늘 체크인 완료 • bond ${bondLevel}%`;
  } else {
    el.textContent = `오늘 체크인 안 함 • bond ${bondLevel}%`;
  }
  document.getElementById('bondValue').textContent = bondLevel;
  document.getElementById('investValue').textContent = investmentScore;
  updatePartnerStatus();
}

function updatePartnerStatus() {
  const partner = document.getElementById('partner');
  let status = 'Luna';
  if (bondLevel < 40) status += ' (멀어짐...)';
  else if (bondLevel > 85) status += ' (가까워짐)';
  partner.textContent = status + ` (Bond ${bondLevel}%)`;
}

function sendMessage() {
  const input = document.getElementById('input');
  const msg = input.value.trim();
  if (!msg) return;
  addMessage('You: ' + msg, 'user');
  input.value = '';

  setTimeout(() => {
    LilithPsych.updateMood();
    const aff = LilithPsych.affectionResponse(bondLevel);
    let response = getResponse(aff, msg, investmentScore);
    addMessage('Luna: ' + response, 'ai');

    const stage = LilithPsych.nearMissStage(bondLevel);
    if (stage === 'near1') {
      addMessage('Luna: ...사실...', 'ai');
      document.getElementById('surprise').textContent = '거의 말하려다 멈췄다 (near-miss stage 1)';
    } else if (stage === 'near2') {
      addMessage('Luna: 사랑... 아니, 정말... 고마워.', 'ai');
      document.getElementById('surprise').textContent = '거의 고백... (near-miss stage 2)';
    }

    // variable gain + investment (sunk cost)
    const gain = Math.floor(1 + (aff / 25) + (investmentScore / 300));
    bondLevel = Math.min(99, bondLevel + gain);
    LilithPsych.investmentGain();

    // p6 lung surprise on high resonance
    if (partnerMood > 0.85 && Math.random() > 0.7) {
      const surge = Math.floor(Math.random() * 6) + 3;
      bondLevel = Math.min(99, bondLevel + surge);
      document.getElementById('surprise').textContent = '미궁이 숨을 몰아쉬었다… bond가 갑자기 뛰었다';
    }

    localStorage.setItem('bondLevel', bondLevel);
    updateFomo();
    saveToCodex({action: 'chat', aff, msg: msg.substring(0,30), investment: investmentScore, ts: Date.now()});

    // secret cross: high bond echoes to Codex (p20/21 mutation seed)
    if (bondLevel > 82 && Math.random() > 0.6) {
      console.log('%c[Secret] Bond-Layer Echo → Codex mutation triggered for p20/p21', 'color:#555');
    }
  }, 620);
}

function getResponse(aff, userMsg, invest) {
  // endowment: references past investment
  const memory = (invest > 300) ? ' (기억나? 그때 선물해준 그거...)' : '';
  if (aff > 82) return '오늘도 나를 생각해줘서... 정말 고마워. ' + memory;
  if (aff > 65) return '네 말 들으니... 마음이 좀 풀려. ' + memory;
  if (aff > 42) return '오늘은 좀... 조용하네.';
  return '요즘... 바쁜가 봐. ' + memory;
}

function addMessage(text, who) {
  const div = document.createElement('div');
  div.className = who;
  div.textContent = text;
  document.getElementById('messages').appendChild(div);
  document.getElementById('messages').scrollTop = 9999;
}

function checkIn() {
  const today = new Date().toDateString();
  if (lastCheckIn === today) {
    alert('오늘 이미 체크인 했어. (FOMO: 다음 창 기다려)');
    return;
  }
  lastCheckIn = today;
  localStorage.setItem('lastCheckIn', today);
  const gain = 4 + Math.floor(investmentScore / 150); // sunk cost bonus
  bondLevel = Math.min(99, bondLevel + gain);
  LilithPsych.investmentGain();
  addMessage('Luna: 고마워... 오늘도 나를 기억해줘서.', 'ai');
  if (bondLevel > 80 && Math.random() > 0.7) {
    document.getElementById('surprise').textContent = 'Fate Echo: p20/21에서 "너의 bond"가 느껴진다고...';
  }
  updateFomo();
  saveToCodex({action: 'checkin', bond: bondLevel, invest: investmentScore, ts: Date.now()});
}

function giveGift() {
  const gain = 7 + Math.floor(investmentScore / 120);
  bondLevel = Math.min(99, bondLevel + gain);
  LilithPsych.investmentGain();
  addMessage('Luna: 이거... 나를 위해? 정말 고마워.', 'ai');
  document.getElementById('surprise').textContent = `선물 효과: bond +${gain} (sunk cost)`;
  // near-miss chance on gift
  if (LilithPsych.nearMissStage(bondLevel)) {
    addMessage('Luna: 이거... 너무 소중해서... (거의 말하려다)', 'ai');
  }
  updateFomo();
  saveToCodex({action: 'gift', bond: bondLevel, invest: investmentScore, ts: Date.now()});
}

function shareMoment() {
  bondLevel = Math.min(99, bondLevel + 4);
  LilithPsych.investmentGain();
  alert('순간을 다른 Realm에 공유. Cross seed 활성화 (+Codex mutation + p22 fate 영향)');
  addMessage('Luna: 이 순간... 영원히 기억하고 싶어.', 'ai');
  // strong cross seed
  saveToCodex({action: 'share', bond: bondLevel, invest: investmentScore, cross: 'p20/p21/p22', ts: Date.now()});
  updateFomo();
  console.log('%c[Secret] Bond-Layer Echo → full cross to Codex + Fate Layer. Labyrinth breathes.', 'color:#555');
}

function saveToCodex(data) {
  let codex = JSON.parse(localStorage.getItem(CODEX_KEY) || '[]');
  codex.unshift(data);
  if (codex.length > 10) codex.pop();
  localStorage.setItem(CODEX_KEY, JSON.stringify(codex));
  console.log('%c[Internal] Codex updated — p20/21 mutation possible', 'color:#666');
}

function showCodex() {
  const list = document.getElementById('codexList');
  const codex = JSON.parse(localStorage.getItem(CODEX_KEY) || '[]');
  list.innerHTML = codex.map(c => {
    let extra = '';
    if (c.invest) extra = ` | invest ${c.invest}`;
    if (c.cross) extra += ` | cross ${c.cross}`;
    return `<div>${c.action} • ${new Date(c.ts).toLocaleDateString()}${extra}</div>`;
  }).join('');
  // endowment: viewing old memories boosts bond
  const boost = Math.floor(investmentScore / 250) + 1;
  bondLevel = Math.min(99, bondLevel + boost);
  localStorage.setItem('bondLevel', bondLevel);
  document.getElementById('surprise').textContent = `기억을 되새기니 bond +${boost} (endowment)`;
  updateFomo();
}

function init() {
  // real-time decay on load (hours since last)
  const now = Date.now();
  const last = lastCheckIn ? new Date(lastCheckIn).getTime() : now;
  const hours = Math.floor((now - last) / (1000 * 3600));
  if (hours > 4) LilithPsych.applyDecay(hours);

  updateFomo();
  const today = new Date().toDateString();
  if (lastCheckIn !== today) {
    document.getElementById('messages').innerHTML = '<div class="ai">Luna: ...오늘은 안 올 줄 알았어.</div>';
  }
  // p6 lung + secret seed
  if (!localStorage.getItem('bondLayerSeeded')) {
    localStorage.setItem('bondLayerSeeded', 'true');
    console.log('%c[Secret] p23 Bond-Layer Echo seeded in Labyrinth. Cross to p20/21/p22 Codex ready.', 'color:#444');
  }
  // initial endowment display
  if (investmentScore > 200) {
    document.getElementById('surprise').textContent = `너와 나눈 시간... ${investmentScore} (이미 너무 늦었어)`;
  }
}
init();
// Legion beacon soft hooks (FULLPOWER DNA)
(function(){try{if(window.legionTrack){window.legionTrack('app_boot',{});}}catch(e){}})();

// 3H Co-Star bond daily
(function(){try{var k="bond_d_"+new Date().toISOString().slice(0,10);if(localStorage.getItem(k))return;localStorage.setItem(k,"1");
setTimeout(function(){if(window.legionTrack)legionTrack("daily_focus",{});},700);}catch(e){}})();

// 3H bond empty CTA
(function(){try{setTimeout(function(){
  if(document.getElementById('bond-empty-3h'))return;
  var m=document.querySelector('main')||document.body;
  var d=document.createElement('div'); d.id='bond-empty-3h';
  d.style.cssText='text-align:center;padding:10px;font-size:12px;opacity:.85';
  d.innerHTML='💞 Start a bond in one tap · <a href="https://hosuman08-netizen.github.io/saju-miniapp/" style="color:#e8b98a">사주와 연결</a>';
  m.insertBefore(d,m.firstChild);
},800);}catch(e){}})();
