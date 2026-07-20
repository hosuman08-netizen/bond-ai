(function(){
  var root=document.getElementById('app');
  var score=+(localStorage.getItem('bond_score')||0);
  var runs=+(localStorage.getItem('bond_runs')||0);
  var hist=JSON.parse(localStorage.getItem('bond_hist')||'[]');
  var best=+(localStorage.getItem('bond_best')||0); var dailyGift=localStorage.getItem('bond_dg')===new Date().toDateString();
  function render(){
    root.innerHTML='<div class="card field1"><span class="chip">유대 <b>'+score+'/100</b></span> <span class="chip">최고 <b>'+best+'</b></span> <span class="chip">세션 <b>'+runs+'</b></span></div>'
      +'<div class="card"><p class="sub">가상 유대 시뮬 · 실관계 아님 · 18+</p>'
      +'<div style="height:10px;background:#1c1826;border-radius:6px;overflow:hidden;margin:10px 0"><i style="display:block;height:100%;width:'+score+'%;background:linear-gradient(90deg,#f472b6,#e0b552)"></i></div>'
      +'<button id="talk">대화 +유대</button> <button class="sec" id="gift">선물 시뮬</button> <button class="sec" id="share">점수 공유</button>'
      +'<p class="sub" style="margin-top:10px">최근: '+(hist.join(' · ')||'-')+'</p></div>';
    document.getElementById('talk').onclick=function(){
      var d=3+Math.floor(Math.random()*8); score=Math.min(100,score+d); runs++; hist.unshift('+'+d); hist=hist.slice(0,6);
      if(score>best)best=score;
      localStorage.setItem('bond_score',score); localStorage.setItem('bond_runs',runs);
      localStorage.setItem('bond_hist',JSON.stringify(hist)); localStorage.setItem('bond_best',best);
      render(); try{legionTrack('activate',{d:d,score:score})}catch(e){}
    };
    document.getElementById('gift').onclick=function(){
      if(dailyGift){alert('오늘 선물 시뮬 완료');return;} dailyGift=true; localStorage.setItem('bond_dg',new Date().toDateString());
      var d=8+Math.floor(Math.random()*12); score=Math.min(100,score+d); runs++; hist.unshift('G+'+d); hist=hist.slice(0,6);
      if(score>best)best=score;
      localStorage.setItem('bond_score',score); localStorage.setItem('bond_runs',runs);
      localStorage.setItem('bond_hist',JSON.stringify(hist)); localStorage.setItem('bond_best',best);
      render(); try{legionTrack('activate',{gift:1,score:score})}catch(e){}
    };
    document.getElementById('share').onclick=function(){
      var text='Bond AI '+score+'/100 (best '+best+') · fictional · https://hosuman08-netizen.github.io/bond-ai/';
      if(navigator.share)navigator.share({text:text}).catch(function(){});
      else if(navigator.clipboard)navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{score:score})}catch(e){}
    };
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
