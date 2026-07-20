
(function(){
  var qs=[{q:'오늘 상대 기분을 물었나?',y:12},{q:'약속 시간을 지켰나?',y:15},{q:'작은 감사를 전했나?',y:10}];
  var root=document.getElementById('app'); var score=50;
  function render(){
    root.innerHTML='<div class="card">유대 점수 <b style="font-size:28px;color:var(--gold)">'+score+'</b>/100 · 가상 시뮬</div>'
      +qs.map(function(x,i){return '<div class="card"><p>'+x.q+'</p><div class="row"><button data-i="'+i+'" data-v="1">예</button><button class="sec" data-i="'+i+'" data-v="0">아니오</button></div></div>';}).join('')
      +'<div class="card"><button id="reset" class="sec">리셋</button></div>';
    root.querySelectorAll('button[data-i]').forEach(function(b){b.onclick=function(){
      if(b.dataset.v==='1')score=Math.min(100,score+qs[+b.dataset.i].y); else score=Math.max(0,score-8);
      if(score>=100){try{legionTrack('share_peak_shown',{score:100})}catch(e){}} render();try{legionTrack('activate',{score:score})}catch(e){}
    };});
    document.getElementById('reset').onclick=function(){score=50;render();};
    if(!document.getElementById('shareBond')){
      var b=document.createElement('button');b.id='shareBond';b.className='sec';b.style.width='100%';b.style.marginTop='8px';
      b.textContent='점수 공유';b.onclick=function(){var text='Bond AI '+score+'/100 · fictional · https://hosuman08-netizen.github.io/bond-ai/';
        if(navigator.clipboard)navigator.clipboard.writeText(text);try{legionTrack('share_peak',{})}catch(e){}};
      root.appendChild(b);
    }
  }
  try{legionTrack('session_start',{})}catch(e){}
  render();
})();
