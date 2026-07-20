(function(){
  var root=document.getElementById('app');
  var score=+(localStorage.getItem('bond_score')||0);
  var runs=+(localStorage.getItem('bond_runs')||0);
  var hist=JSON.parse(localStorage.getItem('bond_hist')||'[]');
  var best=+(localStorage.getItem('bond_best')||0);
  var dailyGift=localStorage.getItem('bond_dg')===new Date().toDateString();
  function dayKey(off){
    var d=new Date(); d.setDate(d.getDate()+(off||0));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function fomoLeft(){
    var end=new Date(); end.setHours(24,0,0,0);
    var ms=Math.max(0,end-Date.now());
    return Math.floor(ms/3600000)+'h '+Math.floor((ms%3600000)/60000)+'m';
  }
  function bumpStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('bond_streak')||'{}');
      var t=dayKey(0);
      if(st.last===t) return st;
      var y=dayKey(-1),y2=dayKey(-2),froze=false;
      if(st.last && st.last!==y && st.last===y2 && (st.count||0)>=3){
        var ready=!st.shieldLast||((new Date(t)-new Date(st.shieldLast))/86400000)>=7;
        if(ready){st.shieldLast=t;st.last=y;froze=true;try{legionTrack('streak_freeze',{count:st.count})}catch(e){}}
      }
      st.count=(st.last===y)?(st.count||0)+1:1;
      st.last=t;
      localStorage.setItem('bond_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count,froze:froze})}catch(e){}
      return st;
    }catch(e){return {count:0};}
  }
  function kId(){
    try{
      var id=localStorage.getItem('bond_k_id');
      if(!id){id='b'+Math.random().toString(36).slice(2,8);localStorage.setItem('bond_k_id',id);}
      return id;
    }catch(e){return 'share';}
  }
  function shareUrl(){
    return 'https://hosuman08-netizen.github.io/bond-ai/?utm_source=share&ref='+encodeURIComponent(kId());
  }
  function saveAll(){
    localStorage.setItem('bond_score',score);
    localStorage.setItem('bond_runs',runs);
    localStorage.setItem('bond_hist',JSON.stringify(hist));
    localStorage.setItem('bond_best',best);
  }
  function todayTalks(){try{return +(localStorage.getItem('bond_day_'+dayKey(0))||0);}catch(e){return 0;}}
  function bumpToday(){try{localStorage.setItem('bond_day_'+dayKey(0),String(todayTalks()+1));}catch(e){}}
  // soft decay once per missed day (return pressure, not wipe)
  try{
    var decayK='bond_decay_'+dayKey(0);
    var lv=localStorage.getItem('bond_last_visit');
    if(lv && lv!==dayKey(0) && lv!==dayKey(-1) && !localStorage.getItem(decayK) && score>0){
      score=Math.max(0,score-5); saveAll(); localStorage.setItem(decayK,'1');
      try{legionTrack('decay',{score:score})}catch(e){}
    }
  }catch(e){}
  function render(){
    var st=JSON.parse(localStorage.getItem('bond_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast||0))/86400000)>=7;
    var last=localStorage.getItem('bond_last_visit');
    var greet='';
    try{
      localStorage.setItem('bond_last_visit',dayKey(0));
      if(last && last!==dayKey(0) && score>0) greet='다시 왔네 · 유대 '+score+' 이어서.';
    }catch(e){}
    var tt=todayTalks();
    root.innerHTML='<div class="card field1" style="border-color:#f472b6"><b>18+</b> 가상 유대 시뮬 · 실관계 아님</div>'
      +'<div class="card"><span class="chip">유대 <b>'+score+'/100</b></span> <span class="chip">최고 <b>'+best+'</b></span> <span class="chip">세션 <b>'+runs+'</b></span> <span class="chip">오늘 대화 <b>'+tt+'</b></span> <span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' 🛡️':'')+'</span> <span class="chip">리셋 '+fomoLeft()+'</span>'
      +(greet?'<p style="font-size:13px;margin:8px 0 0;opacity:.85">'+greet+'</p>':'')
      +'</div>'
      +'<div class="card"><p class="sub">대화/선물로 유대 게이지 · 일일 선물 1회 · 미방문 시 -5 소프트 감쇠</p>'
      +'<div style="height:10px;background:#1c1826;border-radius:6px;overflow:hidden;margin:10px 0"><i style="display:block;height:100%;width:'+score+'%;background:linear-gradient(90deg,#f472b6,#e0b552)"></i></div>'
      +'<button id="talk">대화 +유대</button> '
      +'<button class="sec" id="gift"'+(dailyGift?' disabled style="opacity:.5"':'')+'>'+(dailyGift?'오늘 선물 ✓':'선물 시뮬')+'</button> '
      +'<button class="sec" id="undoTalk">↩ 직전 취소</button> '
      +'<button class="sec" id="share">점수 공유</button>'
      +'<p class="sub" style="margin-top:10px">최근: '+(hist.join(' · ')||'-')+'</p></div>'
      +'<div id="sharePeak" style="display:none;margin:10px 0;padding:10px;border:1px solid #f472b644;border-radius:12px;text-align:center">'
      +'<p style="margin:0 0 6px;font-size:13px">✨ 유대 피크 — 지금 공유</p><button class="sec" id="sharePeakBtn">공유</button></div>'
      +'<div id="moneyPipe" style="margin-top:12px;padding:10px;border:1px solid #c5a46e44;border-radius:12px;background:#16121c;text-align:center;font-size:12px">'
      +'<div style="color:#e0b552;font-weight:700;margin-bottom:4px">💎 엔터 18+ 크로스</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/ai-companion/?utm_source=bond">💬 Companion</a>'
      +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=bond">🎮 Arcade</a></div>';
    document.getElementById('talk').onclick=function(){
      var d=3+Math.floor(Math.random()*8);
      score=Math.min(100,score+d); runs++; hist.unshift('+'+d); hist=hist.slice(0,8);
      if(score>best)best=score;
      bumpToday(); saveAll(); bumpStreak(); render();
      if(score>=80 || score===best){var sp=document.getElementById('sharePeak'); if(sp) sp.style.display='block';}
      try{legionTrack('activate',{d:d,score:score})}catch(e){}
    };
    document.getElementById('gift').onclick=function(){
      if(dailyGift)return;
      dailyGift=true; localStorage.setItem('bond_dg',new Date().toDateString());
      var d=8+Math.floor(Math.random()*12);
      score=Math.min(100,score+d); runs++; hist.unshift('G+'+d); hist=hist.slice(0,8);
      if(score>best)best=score;
      bumpToday(); saveAll(); bumpStreak(); render();
      var sp=document.getElementById('sharePeak'); if(sp) sp.style.display='block';
      try{legionTrack('activate',{gift:1,score:score})}catch(e){}
      try{legionTrack('share_peak_shown',{score:score})}catch(e){}
    };
    document.getElementById('undoTalk').onclick=function(){
      if(!hist.length)return;
      var lastH=hist.shift();
      var n=parseInt(String(lastH).replace(/\D/g,''),10)||0;
      score=Math.max(0,score-n); runs=Math.max(0,runs-1);
      saveAll(); render(); try{legionTrack('undo',{})}catch(e){}
    };
    function doShare(){
      var text='Bond AI '+score+'/100 (best '+best+') · 🔥'+sc+'일 · fictional 18+\n'+shareUrl();
      if(navigator.share)navigator.share({text:text,url:shareUrl()}).catch(function(){});
      else if(navigator.clipboard)navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{score:score})}catch(e){}
    }
    document.getElementById('share').onclick=doShare;
    var spb=document.getElementById('sharePeakBtn'); if(spb) spb.onclick=doShare;
  }
  try{
    var q=new URLSearchParams(location.search||'');
    var ref=q.get('ref');
    if(ref && ref!==kId() && !localStorage.getItem('bond_k_from')){
      localStorage.setItem('bond_k_from',ref);
      try{legionTrack('k_link',{from:ref})}catch(e){}
    }
  }catch(e){}
  try{legionTrack('session_start',{})}catch(e){}
  render();

/* LEGION_WAVE_15_share_counter */
document.addEventListener('click',function(ev){try{var el=ev.target;if(!el)return;var tx=(el.textContent||'')+(el.id||'');if(/share|copy/i.test(tx)||/\uacf5\uc720|\ubcf5\uc0ac/.test(tx)){localStorage.setItem('lw_p23_bond_ai_share_counter',String((+(localStorage.getItem('lw_p23_bond_ai_share_counter')||0))+1));}}catch(e){}},true);
})();