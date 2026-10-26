import { obstacleOffset, edgeOpacity } from './motion.js';

const palette = ['#b4f3d7', '#ffd1b6', '#d0bcff', '#ffe69b', '#a9dfff'];
export const noteColor = i => palette[i % palette.length];
export function drawScene(canvas, view) {
  const { time, travel, hop, hopActive, floatLift, cleared, obstacleExit, departures, task, approach, progress, active, reduced, celebration, notes, phase, paused } = view;
  const ctx = canvas.getContext('2d');
  const pixelW = canvas.clientWidth, pixelH = canvas.clientHeight;
  if(pixelW<=0||pixelH<=0)return;
  // Kis fekvő kijelzőn a világ együtt kicsinyül: a nyuszi füle sem vágódik le.
  const scale = Math.min(1, pixelH / 340, pixelW / 420);
  const w = pixelW / scale, h = pixelH / scale;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  if (canvas.width !== Math.round(pixelW * dpr) || canvas.height !== Math.round(pixelH * dpr)) {
    canvas.width = Math.round(pixelW * dpr); canvas.height = Math.round(pixelH * dpr);
  }
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
  const ground = h * 0.79;
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#423e68'); gradient.addColorStop(0.65, '#8c7595'); gradient.addColorStop(1, '#b18f9c');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, w, h);
  function ellipse(x,y,rx,ry,color) { ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill(); }
  function line(x,y,x2,y2,color,width=2) {ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();}
  function star(x,y,r,color) {ctx.fillStyle=color;ctx.beginPath();for(let j=0;j<10;j++){const a=j*Math.PI/5-Math.PI/2,rr=j%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr);}ctx.closePath();ctx.fill();}
  // Papírhold, csillagok és puha felhők.
  ellipse(w*.79,77,25,25,'#ffebc3');ellipse(w*.79-9,69,23,23,'#49436c');
  for(let i=0;i<23;i++) {const x=(i*83+29)%w,y=35+(i*47)%130;star(x,y,i%3===0?3:1.5,'#fff0c685');}
  for(let i=0;i<4;i++) {
    const x=((i*267+70-travel*.13)%(w+220)+w+220)%(w+220)-90,y=95+(i%2)*55;
    ellipse(x,y,42,15,'#d9c8e333');ellipse(x-15,y-9,19,16,'#d9c8e333');ellipse(x+13,y-13,23,20,'#d9c8e333');
  }
  for(let layer=0;layer<2;layer++) {
    ctx.fillStyle=layer?'#62536f':'#71617e';ctx.beginPath();ctx.moveTo(0,h);
    for(let x=0;x<=w+10;x+=10)ctx.lineTo(x,ground-30-layer*12+Math.sin((x+travel*(layer?.3:.16))/170)*35+Math.sin(x/90)*10);
    ctx.lineTo(w,h);ctx.fill();
  }
  // Kerek fák apró, aranyszínű lámpásokkal.
  for(let i=0;i<7;i++) {
    const x=((i*205-travel*.38)%(w+300)+w+300)%(w+300)-100;
    const y=ground-10,size=55+(i%3)*10;
    line(x,y,x-3,y-size*1.5,'#765b75',9);
    ellipse(x,y-size*1.5,size*.66,size,'#74617f');ellipse(x-16,y-size*1.5,28,42,'#82738b');
    ellipse(x+14,y-size,4,6,'#ffe1a2');
  }
  ctx.fillStyle='#48475a';ctx.fillRect(0,ground,w,h-ground);
  ctx.fillStyle='#72766f';ctx.fillRect(0,ground,w,5);
  for(let i=0;i<5;i++)line(0,ground+24+i*8,w,ground+24+i*8,'#b4b2a814',1);
  for(let i=0;i<22;i++) {
    const x=((i*67-travel)%(w+80)+w+80)%(w+80)-30,y=ground+10+(i%3)*18;
    if(i%3===0){ctx.fillStyle='#d3c6d457';ctx.font='17px serif';ctx.fillText('♪',x,y+8);}
    else{line(x,y,x,y+8,'#9ba88d',1);for(let a=0;a<5;a++)ellipse(x+Math.cos(a*1.256)*3,y+Math.sin(a*1.256)*3,2.8,2.8,i%2?'#dda9b0':'#dac48f');ellipse(x,y,2,2,'#ffe3a9');}
  }
  const bunnyX = w < 500 ? w*.25 : w*.24;
  const rank = task ? [...notes].sort((a,b)=>a.hz-b.hz).findIndex(n=>n===notes[task.note]) : 0;
  const flight = 70 + Math.max(0,rank)*16;
  const cloudFlight = Math.min(flight, ground-190);
  const lift = task?.type==='hold' ? floatLift*cloudFlight : hop.lift*flight;
  const bunnyOffset = reduced ? 0 : Math.sin(hop.p*Math.PI)*18;
  function drawBuckas(targetTask, targetCleared, targetHop, activeHop, exitDistance, arrival=0) {
    const color=noteColor(targetTask.note);
    const targetRank=[...notes].sort((a,b)=>a.hz-b.hz).findIndex(n=>n===notes[targetTask.note]);
    const targetFlight=70+Math.max(0,targetRank)*16;
    const needed=targetTask.type==='repeat'?targetTask.needed:1;
    for(let i=0;i<needed;i++) {
      const x=bunnyX+obstacleOffset(i,targetCleared,targetHop,activeHop,exitDistance)+arrival;
      if(x+25<0||x-25>w)continue;
      ctx.globalAlpha=edgeOpacity(x);
      ellipse(x,ground-12,24,17,color);ellipse(x,ground-24,19,13,color);
      ellipse(x-6,ground-25,2,2.5,'#53455c');ellipse(x+6,ground-25,2,2.5,'#53455c');
      for(let a=0;a<5;a++)ellipse(x+15+Math.cos(a*1.256)*4,ground-34+Math.sin(a*1.256)*4,3,3,'#ffe0ed');
      ellipse(x+15,ground-34,2.5,2.5,'#f5cf74');
      if(i>=targetCleared){
        const collect=activeHop&&i===targetCleared?Math.max(0,(targetHop.p-.4)/.6):0;
        ctx.globalAlpha*=1-collect;
        star(x,ground-targetFlight-3-collect*26,10*(1-collect*.7),color);
      }
      ctx.globalAlpha=1;
    }
  }
  // A következő feladat már látszhat, miközben az előző buckák még kifutnak balra.
  if(active)for(const item of departures)drawBuckas(item.task,item.cleared,{p:1},false,item.exit);
  if(active && task) {
    const waitingX=bunnyX+80;
    const color=noteColor(task.note);
    if(task.type==='hold') {
      // A felhő a nyuszi lába alatt marad: együtt emelkednek, nem egy távoli célra ugrunk.
      const cloudY=ground-lift+18;
      ellipse(bunnyX,ground+27,88-lift*.12,10,'#29283840');
      if(floatLift>.12&&!reduced){
        ctx.strokeStyle='#c6fff380';ctx.lineWidth=3;
        for(let i=0;i<3;i++){
          const x=bunnyX-40+i*40, y=ground+30-(time*24+i*13)%35;
          ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-8,y-9,x,y-18);ctx.stroke();
        }
      }
      ctx.save();ctx.translate(bunnyX,cloudY);ctx.scale(.9,.9);
      ctx.shadowColor=floatLift>.1?'#a7f8e899':'#201b4255';ctx.shadowBlur=floatLift>.1?22:10;ctx.shadowOffsetY=5;
      const cloudFill=ctx.createLinearGradient(0,-25,0,48);
      cloudFill.addColorStop(0,'#fffdf4');cloudFill.addColorStop(.55,'#eefaff');cloudFill.addColorStop(1,'#b4dbe9');
      ctx.fillStyle=cloudFill;ctx.strokeStyle='#e8fcff';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.moveTo(-77,12);
      ctx.bezierCurveTo(-91,-6,-61,-29,-43,-9);
      ctx.bezierCurveTo(-26,-34,13,-28,28,-7);
      ctx.bezierCurveTo(56,-27,86,-7,77,12);
      ctx.bezierCurveTo(103,23,90,48,61,48);ctx.lineTo(-58,48);
      ctx.bezierCurveTo(-91,48,-105,24,-77,12);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.shadowBlur=0;ctx.shadowOffsetY=0;
      ellipse(-12,25,2.5,3,'#536580');ellipse(12,25,2.5,3,'#536580');
      ellipse(-25,31,7,3,'#efb9ce');ellipse(25,31,7,3,'#efb9ce');
      ctx.strokeStyle='#71859b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,28,7,.15,Math.PI-.15);ctx.stroke();
      ctx.restore();
      // Öt nagy csillag az idő ötödét jelzi; a mérővel együtt, nem előre gyulladnak ki.
      const starY=Math.max(58,ground-cloudFlight-126);
      const lit=phase==='success'?5:Math.floor(Math.min(1,progress)*5+1e-6);
      for(let i=0;i<5;i++){
        const x=bunnyX-56+i*28;
        ellipse(x,starY,13,13,'#29233d99');
        star(x,starY,10,i<lit?'#ffe69b':'#8e8aa4');
        if(i<lit){ctx.strokeStyle='#fff0bb';ctx.lineWidth=1;ctx.stroke();}
      }
      const bubbleX=bunnyX+118, bubbleY=ground-lift-64;
      ctx.fillStyle='#29233de8';ctx.beginPath();ctx.roundRect(bubbleX-63,bubbleY-18,126,36,12);ctx.fill();
      ctx.fillStyle=paused?'#d7cce8':phase==='success'?'#ffe69b':'#ddfff0';
      ctx.font='900 14px Nunito, sans-serif';ctx.textAlign='center';
      ctx.fillText(paused?'Pihenünk':phase==='success'?'Sikerült!':phase==='approach'?'Hosszú hang kell':progress>0?'Tartsd még!':'Tartsd a hangot!',bubbleX,bubbleY+5);ctx.textAlign='left';
    } else {
      const needed=task.type==='repeat'?task.needed:1;
      drawBuckas(task,cleared,hop,hopActive,obstacleExit,(w-waitingX-45)*Math.max(0,1-approach));
      // Az ív és a nyíl megmutatja a célt, mielőtt még hangot adnánk.
      if(phase==='play'&&!hopActive&&cleared<needed){
        ctx.setLineDash([5,6]);ctx.strokeStyle='#fff0c69c';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(bunnyX+10,ground-13);ctx.quadraticCurveTo(bunnyX+80,ground-flight*2,bunnyX+150,ground-13);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#fff0c6';ctx.font='800 14px Nunito, sans-serif';ctx.textAlign='center';ctx.fillText('Ugorj át! ↑',bunnyX+85,ground-flight-35);ctx.textAlign='left';
      }
    }
  }
  const bob = reduced || hopActive || floatLift>.1 || paused ? 0 : Math.sin(time*11)*(active?2:1);
  if(task?.type!=='hold')ellipse(bunnyX+bunnyOffset,ground+4,Math.max(12,28-lift*.1),6,'#29283844');
  ctx.save();ctx.translate(bunnyX+bunnyOffset,ground-29-lift+bob);
  if(!reduced){ctx.rotate(hopActive?hop.lean:0);ctx.scale(1+hop.squash,1-hop.squash);}
  // Sál, mancsok, fülek és a kis kürt.
  ellipse(-1,3,22,27,'#f6e4df');ellipse(6,8,13,18,'#fff3e7');
  const step=reduced||hopActive||floatLift>.1||paused?0:Math.sin(time*14)*5;
  ellipse(-13,24+step*.3,12,6,'#ead4d1');ellipse(14,24-step*.3,12,6,'#fff0df');
  ctx.save();ctx.translate(-8,-35);ctx.rotate(-.2);ellipse(0,-19,7,24,'#f8e9e2');ellipse(0,-20,3,16,'#e8b9bd');ctx.restore();
  ctx.save();ctx.translate(9,-34);ctx.rotate(.15);ellipse(0,-20,7,25,'#fff0e7');ellipse(0,-21,3,16,'#e8b9bd');ctx.restore();
  ellipse(0,-23,24,23,'#fff0e7');ellipse(-14,-17,6,3,'#f1bac4');ellipse(14,-17,6,3,'#f1bac4');
  ellipse(-8,-26,2.3,3.2,'#4d3d50');ellipse(8,-26,2.3,3.2,'#4d3d50');ellipse(-8.5,-27,0.8,1,'#fff');ellipse(7.5,-27,.8,1,'#fff');
  ellipse(0,-19,2.5,2,'#c28b9a');ctx.strokeStyle='#976f80';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,-17,4,0,Math.PI);ctx.stroke();
  ctx.fillStyle='#b1dfd0';ctx.fillRect(-20,-6,40,9);ctx.save();ctx.translate(-19,-1);ctx.rotate(.4);ctx.fillRect(-7,0,11,21);ctx.restore();
  ctx.strokeStyle='#ebc279';ctx.lineWidth=4;ctx.beginPath();ctx.arc(-24,5,12,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(-24,5,6,0,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#f7d994';ctx.beginPath();ctx.moveTo(-32,-3);ctx.lineTo(-43,-13);ctx.lineTo(-47,2);ctx.closePath();ctx.fill();
  ctx.restore();
  if(celebration>0)for(let i=0;i<12;i++){const t=1-celebration,x=bunnyX+Math.cos(i*.9)*t*120,y=ground-60-Math.sin(i*.6+1)*t*95;star(x,y,4+celebration*3,palette[i%5]);}
  // A koncert apró állatközönsége.
  if(!active)for(let i=0;i<3;i++){const x=w-45-i*40,y=ground-10;ellipse(x,y-8,14,17,['#cfb99f','#b8bec8','#ddb6ac'][i]);ellipse(x-9,y-24,5,6,'#d8c6b4');ellipse(x+9,y-24,5,6,'#d8c6b4');ellipse(x-5,y-11,1.5,2,'#53455c');ellipse(x+5,y-11,1.5,2,'#53455c');}
}
