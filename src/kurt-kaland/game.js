import { cents, midiHz, noteName, detectPitch, matchPitch, createTask, TaskJudge } from './core.js';
import { drawScene, noteColor } from './scene.js';
import { HOP_DURATION, hopPose, smoothToward } from './motion.js';

const $ = id => document.getElementById(id);
const KEY = 'kurt-kaland-v1';
const defaults = { speed: .65, count: 1, tolerance: 50, hold: 1, rest: 3, length: 9, timing: .65, mode: 'mixed', helper: true, reduced: false, threshold: .008 };
const exampleNotes = [233.0819, 261.6256, 293.6648, 311.127, 349.2282].map(hz => ({ hz, label: noteName(hz), autoName: true, approved: false }));
let restChosen=false;
let settings = { ...defaults }, notes = exampleNotes.map(n=>({...n})), stickers = 0;
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved) {
    // A korábbi 5 mp-es alapot egyszer 3-ra cseréljük; az új, tudatos választásokat megőrizzük.
    restChosen=saved.restChosen===true||(saved.settings?.rest!==undefined&&saved.settings.rest!==5);
    for(const key of ['speed','count','tolerance','hold','rest','length','timing','threshold']) {
      if(key==='rest'&&!restChosen)continue;
      const ranges={speed:[.5,1.5],count:[1,5],tolerance:[25,50],hold:[.5,4],rest:[3,8],length:[6,12],timing:[.35,.65],threshold:[.003,.08]};
      const v=Number(saved.settings?.[key]);if(Number.isFinite(v)&&v>=ranges[key][0]&&v<=ranges[key][1])settings[key]=v;
    }
    if(['mixed','short','repeat','hold'].includes(saved.settings?.mode))settings.mode=saved.settings.mode;
    for(const key of ['helper','reduced'])if(typeof saved.settings?.[key]==='boolean')settings[key]=saved.settings[key];
    if(Array.isArray(saved.notes)&&saved.notes.length===5&&saved.notes.every(n=>typeof n.label==='string'&&Number.isFinite(n.hz)&&n.hz>=65&&n.hz<=1200))notes=saved.notes.map(n=>{
      const autoName=n.autoName===true||(typeof n.autoName!=='boolean'&&/^\d+\. hang$/.test(n.label));
      return {hz:n.hz,label:autoName?noteName(n.hz):n.label.slice(0,24),autoName,approved:n.approved===true};
    });
    if(Number.isFinite(saved.stickers))stickers=Math.max(0,Math.floor(saved.stickers));
  }
} catch { /* A játék privát módban, tároló nélkül is használható. */ }
const ids={count:'note-count', ...Object.fromEntries(Object.keys(defaults).filter(k=>k!=='count').map(k=>[k,k]))};
let mode='demo', running=false, paused=false, phase='idle', phaseTime=0, taskIndex=0, task=null, judge=null;
let roundSettings, roundNotes, score=0, shortCount=0, longCount=0, travel=0, celebration=0, elapsed=0;
let hopTime=HOP_DURATION, hopQueue=0, floatLift=0, animationTime=0, visualCleared=0, obstacleExit=0;
let departures=[];
let stream=null, audio=null, source=null, analyser=null, buffer=null, micBusy=false, micGeneration=0;
let signal={hz:0,rms:0,confidence:0}, history=[], capture=null, noiseCapture=null, lastSample=0, demoNote=-1, lastTime=0;
let currentMatch=-1;
let breathReady=true, silentFor=.12;
const activeNotes = () => notes.slice(0,settings.count);
const store = () => {try{localStorage.setItem(KEY,JSON.stringify({settings,notes,stickers,restChosen}));}catch{}};
function updateCollection() { $('collection').textContent=stickers?`Matricáid: ${'🌸'.repeat(Math.min(5,stickers))} (${stickers})`:''; }
function releaseDemo(){demoNote=-1;document.querySelectorAll('.demo-keys button').forEach(b=>b.classList.remove('down'));}
function setMode(value) {
  mode=value;releaseDemo();
  $('input-mode').textContent=mode==='demo'?'⌨ DEMÓ':'🎤 KÜRT';
  $('demo-controls').hidden=mode!=='demo';
  $('live-mic').hidden=mode!=='mic';
  $('demo-guide').open=false;
}
function renderKeys(){
  $('demo-keys').replaceChildren();
  (running && roundNotes ? roundNotes : activeNotes()).forEach((n,i)=>{
    const b=document.createElement('button');b.type='button';b.textContent=n.label;b.setAttribute('aria-label',`${n.label} · ${i+1}-es billentyű`);
    const k=document.createElement('kbd');k.textContent=i+1;b.append(k);b.style.borderBottom=`3px solid ${noteColor(i)}`;
    b.onpointerdown=e=>{if(mode!=='demo')return;e.preventDefault();releaseDemo();demoNote=i;b.classList.add('down');b.setPointerCapture(e.pointerId);};
    b.onpointerup=b.onpointercancel=b.onlostpointercapture=releaseDemo;
    $('demo-keys').append(b);
  });
}
function renderNotes(){
  $('note-editor').replaceChildren();
  notes.forEach((n,i)=>{
    const row=document.createElement('div');row.className='note-row'+(n.approved?' approved':'');
    const num=document.createElement('span');num.className='number';num.textContent=n.approved?'✓':i+1;row.append(num);
    const nameLabel=document.createElement('label');nameLabel.textContent=n.autoName?'Megszólaló hang neve':'Saját hangnév';
    const name=document.createElement('input');name.value=n.label;name.maxLength=24;name.setAttribute('aria-label',`${i+1}. hang neve`);
    name.onchange=()=>{n.autoName=!name.value.trim();n.label=name.value.trim()||noteName(n.hz);name.value=n.label;store();renderKeys();renderNotes();};nameLabel.append(name);row.append(nameLabel);
    const hzLabel=document.createElement('label');hzLabel.textContent='Valós hang (Hz)';
    const hz=document.createElement('input');hz.type='number';hz.min=65;hz.max=1200;hz.step=.01;hz.value=n.hz.toFixed(2);hz.setAttribute('aria-label',`${i+1}. hang frekvenciája`);
    hz.onchange=()=>{const v=Number(hz.value);if(v>=65&&v<=1200){n.hz=v;if(n.autoName)n.label=noteName(v);n.approved=false;store();renderNotes();renderKeys();}else{hz.value=n.hz.toFixed(2);$('capture-status').textContent='65–1200 Hz közötti hangot adj meg.';}};hzLabel.append(hz);row.append(hzLabel);
    const measure=document.createElement('button');measure.className='secondary';measure.textContent='Bemérés';measure.onclick=()=>beginCapture(i);row.append(measure);
    const approve=document.createElement('button');approve.textContent=n.approved?'✓ Jóváhagyva':'Jóváhagyom';approve.onclick=()=>{
      const others=notes.filter((_,j)=>j!==i&&notes[j].approved);
      if(others.some(o=>Math.abs(cents(n.hz,o.hz))<settings.tolerance*2)){$('capture-status').textContent='Ez a hang túl közel van egy másik jóváhagyott hanghoz. Válasszatok megkülönböztethető célokat.';return;}
      n.approved=true;store();renderNotes();$('capture-status').textContent=`${n.label}: ${n.hz.toFixed(1)} Hz (${noteName(n.hz)}) jóváhagyva.`;
    };row.append(approve);
    const up=document.createElement('button');up.className='quiet';up.textContent='↑';up.setAttribute('aria-label',`${i+1}. hang előrébb`);up.disabled=i===0;up.onclick=()=>{[notes[i-1],notes[i]]=[notes[i],notes[i-1]];store();renderNotes();renderKeys();};row.append(up);
    $('note-editor').append(row);
  });
}
function toggleSettings(open){
  if(open&&running&&!paused)togglePause();
  if(!open){capture=null;$('capture-status').textContent='A beállítások mentve. A hangok jóváhagyását tanárral is ellenőrizhetitek.';}
  $('settings').hidden=!open;$('settings-toggle').setAttribute('aria-expanded',String(open));
  document.body.classList.toggle('settings-open',open);
  for(const element of document.querySelectorAll('main > header, .heading, .game-shell, main > footer'))element.inert=open;
  (open?$('mic-tools'):$('control-dock')).append($('live-mic'));
  $('live-mic').hidden=!open&&mode!=='mic';
  if(open)$('settings-dismiss').focus();
}
for(const [key,id]of Object.entries(ids)) {
  const input=$(id);input.type==='checkbox'?input.checked=settings[key]:input.value=settings[key];
  input.onchange=()=>{settings[key]=input.type==='checkbox'?input.checked:input.tagName==='SELECT'&&key==='mode'?input.value:Number(input.value);if(key==='rest')restChosen=true;store();renderKeys();};
}
$('settings-toggle').onclick=()=>toggleSettings($('settings').hidden);
$('settings-close').onclick=$('settings-dismiss').onclick=()=>{toggleSettings(false);$('settings-toggle').focus();};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('settings').hidden){toggleSettings(false);$('settings-toggle').focus();}});
$('settings').addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const controls=[...$('settings').querySelectorAll('button, input, select, summary, a[href]')].filter(el=>!el.disabled&&el.getClientRects().length);
  const first=controls[0],last=controls[controls.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
function convert(){const hz=midiHz(Number($('written-midi').value)+Number($('transpose').value));$('conversion').textContent=`Megszólaló cél: ${noteName(hz)} · ${hz.toFixed(2)} Hz. Ezt másoljátok a megfelelő Hz mezőbe.`;}
$('written-midi').oninput=$('transpose').onchange=convert;convert();

async function enableMic(){
  if(stream)return true;
  if(micBusy)return false;
  if(!window.isSecureContext||!navigator.mediaDevices?.getUserMedia){$('mic-status').textContent='A mikrofon itt nem érhető el. Nyisd meg HTTPS-en vagy localhoston, friss Chrome/Safari/Firefox böngészőben. A demó közben használható.';return false;}
  micBusy=true;const generation=++micGeneration;$('mic-enable').disabled=true;$('mic-status').textContent='Engedélyezd a mikrofont a böngészőben…';
  let acquired=null, context=null;
  try{
    acquired=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});
    if(generation!==micGeneration){acquired.getTracks().forEach(t=>t.stop());return false;}
    context=new(window.AudioContext||window.webkitAudioContext)();await context.resume();
    if(generation!==micGeneration){acquired.getTracks().forEach(t=>t.stop());await context.close();return false;}
    audio=context;stream=acquired;source=audio.createMediaStreamSource(stream);analyser=audio.createAnalyser();analyser.fftSize=4096;source.connect(analyser);buffer=new Float32Array(analyser.fftSize);
    for(const track of stream.getTracks())track.onended=()=>{if(running&&!paused)togglePause();disableMic();$('mic-status').textContent='Megszakadt a mikrofon. Csatlakoztasd újra, majd kapcsold be!';};
    $('mic-off').disabled=$('noise').disabled=false;$('mic-status').textContent='Mikrofon bekapcsolva. Fújj kényelmesen, ne a mikrofonba közvetlenül! A hangot nem játsszuk vissza.';return true;
  }catch(error){acquired?.getTracks().forEach(t=>t.stop());if(context&&context!==audio)context.close().catch(()=>{});$('mic-status').textContent=error.name==='NotAllowedError'?'Nem kaptunk mikrofonengedélyt. A címsor lakatjánál engedélyezheted, vagy próbáld a demót.':'Nem sikerült elindítani a mikrofont. Ellenőrizd az eszközt, és próbáld újra!';return false;
  }finally{micBusy=false;$('mic-enable').disabled=!!stream;}
}
function disableMic(){
  micGeneration++;if(mode==='mic'&&running&&!paused)togglePause();
  if(stream)for(const t of stream.getTracks()){t.onended=null;t.stop();}
  source?.disconnect();audio?.close().catch(()=>{});stream=null;audio=null;source=null;analyser=null;buffer=null;capture=null;noiseCapture=null;history=[];signal={hz:0,rms:0,confidence:0};
  $('mic-enable').disabled=false;$('mic-off').disabled=$('noise').disabled=true;$('mic-status').textContent='Mikrofon kikapcsolva.';
}
$('mic-enable').onclick=enableMic;$('mic-off').onclick=disableMic;
$('noise').onclick=()=>{if(!stream)return;if(running&&!paused)togglePause();capture=null;noiseCapture={start:performance.now(),values:[]};$('mic-status').textContent='Most 2 másodperc csendet kérünk. Ne fújj a kürtbe!';};
async function beginCapture(index){
  if(running&&!paused)togglePause();
  if(!await enableMic())return;
  noiseCapture=null;capture={index,start:performance.now(),values:[]};$('capture-status').textContent=`${notes[index].label}: fújj egy kényelmes, egyenletes hangot kb. 1 másodpercig!`;
}
function sampleMic(now){
  if(!analyser||!audio||audio.state!=='running'||now-lastSample<40)return;
  lastSample=now;analyser.getFloatTimeDomainData(buffer);const result=detectPitch(buffer,audio.sampleRate,settings.threshold);
  if(result.hz){history.push(result.hz);if(history.length>3)history.shift();const sorted=[...history].sort((a,b)=>a-b);signal={...result,hz:history.length>=3&&Math.abs(cents(sorted[0],sorted[2]))<70?sorted[1]:0};}
  else {history=[];signal=result;}
  if(noiseCapture){noiseCapture.values.push(result.rms);if(now-noiseCapture.start>=2000){const sorted=noiseCapture.values.sort((a,b)=>a-b);settings.threshold=Math.min(.08,Math.max(.003,(sorted[Math.floor(sorted.length*.9)]||0)*2.5));$('threshold').value=settings.threshold;store();noiseCapture=null;$('mic-status').textContent=`Csend bemérve. Küszöb: ${settings.threshold.toFixed(3)}. Ha a halk hang eltűnik, vedd lejjebb!`;}}
  if(capture){
    if(signal.hz){const values=capture.values;if(values.length&&Math.abs(cents(signal.hz,values[values.length-1]))>40)capture.values=[];capture.values.push(signal.hz);}else capture.values=[];
    if(capture.values.length>=25){const values=[...capture.values].sort((a,b)=>a-b),n=notes[capture.index];n.hz=values[Math.floor(values.length/2)];if(n.autoName)n.label=noteName(n.hz);n.approved=false;capture=null;store();renderNotes();renderKeys();$('capture-status').textContent=`Javaslat: ${n.hz.toFixed(1)} Hz (${noteName(n.hz)}). Ellenőrizd, és kattints a Jóváhagyom gombra!`;}
    else if(now-capture.start>12000){capture=null;$('capture-status').textContent='Nem találtunk elég stabil hangot. Pihenj, ellenőrizd a jelszintet, és próbáld újra!';}
  }
}
async function start(value){
  if(value==='mic'){
    if(!await enableMic()){toggleSettings(true);return;}
    if(activeNotes().some(n=>!n.approved)){$('mic-status').textContent='Először mérjétek be vagy adjátok meg és hagyjátok jóvá a kiválasztott hangokat!';toggleSettings(true);return;}
    const selected=activeNotes();if(selected.some((n,i)=>selected.some((m,j)=>i!==j&&Math.abs(cents(n.hz,m.hz))<settings.tolerance*2))){$('capture-status').textContent='Két célhang túl közel van egymáshoz ehhez a tűréshez. Szűkítsd a tűrést vagy módosítsd a hangokat!';toggleSettings(true);return;}
  }else disableMic();
  setMode(value);capture=null;noiseCapture=null;toggleSettings(false);$('welcome').hidden=$('result').hidden=true;
  roundSettings={...settings};roundNotes=activeNotes().map(n=>({...n}));score=shortCount=longCount=taskIndex=elapsed=0;
  departures=[];
  breathReady=true;silentFor=.12;running=true;paused=false;renderKeys();$('pause').disabled=$('finish').disabled=false;$('pause').textContent='Szünet';
  document.body.classList.add('playing');$('control-dock').hidden=false;window.scrollTo(0,0);nextTask();updateUI();
}
$('demo-start').onclick=()=>start('demo');$('mic-start').onclick=()=>start('mic');$('again').onclick=()=>start(mode);
function nextTask(){
  task=createTask(taskIndex,roundSettings,roundNotes);judge=new TaskJudge(task);judge.armed=breathReady;phase='approach';phaseTime=0;releaseDemo();
  hopTime=HOP_DURATION;hopQueue=0;floatLift=0;visualCleared=0;obstacleExit=0;
}
function togglePause(){
  if(!running)return;
  if(paused&&mode==='mic'&&(!stream||audio?.state!=='running')){$('mic-status').textContent='Előbb kapcsold be újra a mikrofont!';audio?.resume().catch(()=>{});return;}
  paused=!paused;releaseDemo();breathReady=false;silentFor=0;if(judge){judge.stable=0;judge.held=0;if(task.type==='hold')judge.count=0;judge.silence=0;judge.armed=false;}
  $('pause').textContent=paused?'Folytatás':'Szünet';
  updateUI();
}
$('pause').onclick=togglePause;
function finish(){
  if(!running)return;running=false;paused=false;phase='done';releaseDemo();$('pause').disabled=$('finish').disabled=true;
  $('result').hidden=false;$('result-text').textContent=`${mode==='demo'?'Demó: ':''}${score} csillag · ${shortCount} szép hangindítás · ${longCount} megtartott hang.`;
  if(mode==='mic'&&score>=3){stickers++;store();$('sticker').textContent='Új koncertmatrica: 🌸 Zenélő virág!';}else $('sticker').textContent=mode==='demo'?'A kürtös gyakorlásban igazi koncertmatricát is gyűjthetsz.':'Köszönjük a zenédet! Minden próbálkozás egy kis lépés.';
  updateCollection();disableMic();renderKeys();
}
$('finish').onclick=finish;
function advance(){
  taskIndex++;
  if(taskIndex>=roundSettings.length){finish();return;}
  if(task.type!=='hold')departures.push({task:{...task},cleared:visualCleared,exit:obstacleExit});
  nextTask();
}
function win(){score++;if(task.type==='hold')longCount++;else shortCount+=judge.count;phase='success';phaseTime=0;celebration=1;}
function tick(dt){
  if(!running||paused)return;
  elapsed+=dt;phaseTime+=dt;
  const quiet=mode==='demo'?demoNote<0:signal.rms<settings.threshold;
  silentFor=quiet?silentFor+dt:0;
  if(silentFor>=.12){breathReady=true;if(phase==='approach'&&judge)judge.armed=true;}
  // A pihenés és a következő cél megközelítése ugyanabban az időablakban történik.
  if(phase==='approach'&&phaseTime>=roundSettings.rest){phase='play';phaseTime=0;}
  if(phase==='play'){
    const hz=mode==='demo'?(demoNote>=0?roundNotes[demoNote]?.hz:0):signal.hz;
    currentMatch=matchPitch(hz,roundNotes,roundSettings.tolerance);
    const result=judge.update(currentMatch===task.note,quiet,dt);
    if(result.onset){if(task.type!=='hold')hopQueue++;breathReady=false;}
    if(result.success)win();
    else if(!roundSettings.helper&&phaseTime>task.needed*(task.duration+.6)/roundSettings.speed+roundSettings.timing*2){phase='miss';phaseTime=0;}
  }else if(phase==='success'&&phaseTime>1.2&&hopQueue===0&&hopTime>=HOP_DURATION&&floatLift<.03)advance();
  else if(phase==='miss'&&phaseTime>1.6)advance();
}
function updateUI(){
  $('score').textContent=`${score?'★':'☆'} ${score} csillag`;
  $('level').value=signal.rms;
  $('pitch-readout').textContent=stream?(signal.hz?`${noteName(signal.hz)} · ${signal.hz.toFixed(1)} Hz`:'Hallgatlak…'): 'Mikrofon kikapcsolva';
  const hz=mode==='demo'?(demoNote>=0?(roundNotes||activeNotes())[demoNote]?.hz:0):signal.hz;
  const target=task&&roundNotes?roundNotes[task.note]:null;
  const delta=hz&&target?cents(hz,target.hz):null;
  $('intonation').textContent=delta===null?'–':Math.abs(delta)<= (roundSettings?.tolerance||settings.tolerance)?'● Jó hangmagasság':delta>0?'↓ Picit mélyebben':'↑ Picit magasabban';
  if(!running){if(phase==='done'){$('phase').textContent='KONCERT ÉS PIHENŐ';$('task-label').textContent='Köszönjük a zenédet!';$('hint').textContent='Egy kis pihenő után újra indulhat a kaland.';$('progress-label').textContent=`${score} csillag`;$('task-progress').style.width='100%';$('wait-indicator').hidden=true;$('progress-row').hidden=false;[...$('demo-keys').children].forEach(b=>b.classList.remove('target'));}return;}
  $('round-label').textContent=`${taskIndex+1} / ${roundSettings.length} feladat${mode==='demo'?' · DEMÓ':''}`;
  $('world-label').textContent=task.type==='hold'?'FELHŐLIFT':task.type==='repeat'?'VIRÁGPÁRNÁK':'PÖTTYÖS RÉT';
  $('task-icon').textContent=task.type==='hold'?'〰':task.type==='repeat'?'♫':'♪';$('task-icon').style.color=noteColor(task.note);
  const type=task.type==='hold'?`tartsd ${task.duration} mp-ig`:task.type==='repeat'?`${task.needed} külön rövid hang`:'egy rövid hang';
  $('task-label').textContent=`${target.label} · ${type}`;
  const demo=mode==='demo', key=task.note+1;
  let hint='',label='';
  if(paused){label='SZÜNET';hint='A nyuszi pihen. A folytatáshoz nyomd meg a Folytatás gombot.';}
  else if(phase==='approach'){label='PIHENŐ ÉS KÉSZÜLŐDÉS';hint=task.type==='hold'?(demo?`Pihenj, majd készítsd a(z) ${key}-es gombot: a felhőt fogjuk emelni!`:'Pihenj, vegyél levegőt! A jelzésre tartsd ki a hangot, emeld fel a felhőt!'):demo?`Pihenj, készítsd a(z) ${key}-es gombot! A MOST NYOMD! jelre ugorj.`:'Pihenj, vegyél levegőt! A jelzésre átugrunk a következő buckán.';}
  else if(phase==='play'){
    label=demo?'MOST NYOMD!':'MOST FÚJJ!';
    if(demo)hint=task.type==='hold'?`Tartsd végig nyomva a(z) ${key}-es gombot! A felhő emelkedik, az öt csillag kigyullad.`:task.type==='repeat'?`Nyomd fél másodpercig a(z) ${key}-es gombot, majd engedd fel! Minden lenyomás egy ugrás.`:`Nyomd fél másodpercig a(z) ${key}-es gombot, majd engedd fel: ugorj át a buckán!`;
    else hint=task.type==='hold'?'Fújd végig egyenletesen a hangot! Tartsd fenn a felhőt, amíg mind az öt csillag kigyullad.':task.type==='repeat'?`${judge.count} / ${task.needed} hang · köztük engedd el, vegyél levegőt!`:'Egy kényelmes, rövid hangra ugrunk!';
    if(delta!==null&&Math.abs(delta)>roundSettings.tolerance)hint=demo?`Most a(z) ${key}-es gombot kérjük. Engedd fel a másik gombot!`:delta>0?'Próbáld egy picit mélyebben!':'Próbáld egy picit magasabban!';
  }else if(phase==='success'){label='CSODÁS! +1 CSILLAG';hint=task.type==='hold'?(demo?'Mind az öt csillag ragyog! Engedd fel a gombot, a felhő finoman leszáll.':'Szépen megtartottad a hangot! A felhő most finoman leszáll.'):demo?'Ügyes vagy! Engedd fel a gombot, sikerült az ugrás!':'Szép hangindítás! A nyuszi is örül.';}
  else if(phase==='miss'){label='SEMMI BAJ!';hint='Ezt most elengedtük. A következőnél újra próbálhatod!';}
  $('phase').textContent=label;$('hint').textContent=hint;
  if(demo){
    [...$('demo-keys').children].forEach((button,i)=>button.classList.toggle('target',i===task.note&&(phase==='approach'||phase==='play')));
  }
  const waiting=phase==='approach'||paused;
  $('wait-indicator').hidden=!waiting;$('progress-row').hidden=waiting;
  $('wait-icon').textContent=paused?'⏸':'☕';
  const remaining=String(Math.max(1,Math.ceil(roundSettings.rest-phaseTime)));
  if($('wait-count').textContent!==(paused?'—':remaining))$('wait-count').textContent=paused?'—':remaining;
  $('wait-label').textContent=paused?'Szünet · folytasd, amikor készen állsz':'mp múlva indul · addig pihenj';
  const progress=phase==='success'?1:phase==='play'?judge.progress:0;
  $('task-progress').style.width=`${progress*100}%`;$('task-progress').parentElement.setAttribute('aria-valuenow',Math.round(progress*100));
  $('task-progress').parentElement.setAttribute('aria-label',task.type==='hold'?'Hangkitartás':'Elvégzett ugrások');
  const number=value=>value.toFixed(1).replace('.',',');
  $('progress-label').textContent=task.type==='hold'?`${number(phase==='success'?task.duration:judge.held)} / ${number(task.duration)} mp`:`${judge.count} / ${task.needed} ugrás`;
}
let uiTime=0;
function frame(now){
  const dt=Math.min(.05,(now-(lastTime||now))/1000);lastTime=now;
  sampleMic(now);tick(dt);
  const moving=running&&!paused&&(phase!=='play'||!roundSettings.helper);
  const reduced=settings.reduced||matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(moving&&!reduced)travel+=dt*75*roundSettings.speed;
  if(!paused){
    animationTime+=dt;celebration=Math.max(0,celebration-dt*.9);
    if(hopTime>=HOP_DURATION&&hopQueue>0){hopTime=0;hopQueue--;}
    if(hopTime<HOP_DURATION){hopTime=Math.min(HOP_DURATION,hopTime+dt);if(hopTime>=HOP_DURATION)visualCleared++;}
    if(running&&task.type!=='hold'&&hopTime>=HOP_DURATION&&hopQueue===0&&['success','miss'].includes(phase))obstacleExit+=dt*220;
    for(const item of departures)item.exit+=dt*220;
    departures=departures.filter(item=>item.exit<1800);
    const holding=running&&phase==='play'&&task.type==='hold'&&judge.held>0;
    floatLift=smoothToward(floatLift,holding?1:0,dt);
  }
  const visibleTask=['approach','play','success','miss'].includes(phase)?task:null;
  const approach=phase==='approach'?phaseTime/roundSettings.rest:1;
  drawScene($('scene'),{time:animationTime,travel,hop:hopPose(hopTime),hopActive:hopTime<HOP_DURATION,floatLift,cleared:visualCleared,obstacleExit,departures,task:visibleTask,approach,progress:running&&judge?judge.progress:0,active:running,celebration,reduced,notes:roundNotes||activeNotes(),phase,paused});
  if(now-uiTime>80){updateUI();uiTime=now;}
  requestAnimationFrame(frame);
}
document.addEventListener('keydown',e=>{
  if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||!$('settings').hidden)return;
  if(e.code==='Space'&&e.target.tagName==='BUTTON')return;
  if(e.code==='Space'){e.preventDefault();if(!running)start('demo');else if(!e.repeat)togglePause();return;}
  const index=Number(e.key)-1;
  if(mode==='demo'&&index>=0&&index<(running?roundNotes.length:settings.count)&&!e.repeat){e.preventDefault();releaseDemo();demoNote=index;$('demo-keys').children[index]?.classList.add('down');}
});
document.addEventListener('keyup',e=>{if(Number(e.key)-1===demoNote)releaseDemo();});
window.addEventListener('blur',()=>{releaseDemo();if(running&&!paused)togglePause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){releaseDemo();if(running&&!paused)togglePause();}});
window.addEventListener('pagehide',disableMic);
// Csak explicit tesztmódban olvasható; az éles játékot nem lehet hang nélkül sikerre vezérelni.
if(new URLSearchParams(location.search).has('test'))window.kurtTest={snapshot:()=>({running,paused,phase,phaseTime,taskIndex,task,score,mode,signal:{...signal},count:judge?.count,held:judge?.held,stream:!!stream,settings:{...settings},elapsed,motion:{hop:hopPose(hopTime),hopActive:hopTime<HOP_DURATION,floatLift,cleared:visualCleared,obstacleExit,departures:departures.map(item=>({...item,task:{...item.task}}))}})};
renderKeys();renderNotes();setMode('demo');updateCollection();requestAnimationFrame(frame);
