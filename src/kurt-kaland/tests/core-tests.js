import { cents, midiHz, noteName, detectPitch, matchPitch, createTask, TaskJudge } from '../core.js';
import { HOP_DURATION, hopPose, smoothToward, obstacleOffset, edgeOpacity } from '../motion.js';

export function runCoreTests() {
  let assertions=0;
  function check(condition,message){assertions++;if(!condition)throw new Error(message);}
  check(hopPose(0).lift===0,'Ugrás a talajról indul');
  check(hopPose(HOP_DURATION/2).lift===1,'Az ugrás csúcsa középen van');
  check(hopPose(HOP_DURATION).lift===0,'Ugrás a talajra érkezik');
  check(hopPose(.02).lift<hopPose(.1).lift,'Folyamatos emelkedés, nem teleport');
  check(hopPose(.4).lift>hopPose(.6).lift,'Folyamatos ereszkedés');
  const lift=smoothToward(0,1,.05);check(lift>0&&lift<1,'Lebegés simán emelkedik');
  check(smoothToward(lift,0,.05)<lift,'Lebegés simán ereszkedik');
  for(let i=0;i<4;i++){
    const before=obstacleOffset(i,0,hopPose(HOP_DURATION),true);
    const after=obstacleOffset(i,1,hopPose(HOP_DURATION),false);
    check(before===after,'A buckák helye folytonos landoláskor');
    check(obstacleOffset(i,1,hopPose(0),true)===after,'Következő ugrás nem rántja vissza a buckákat');
    check(obstacleOffset(i,1,hopPose(HOP_DURATION),false,70)===after-70,'Közös távozási eltolás');
  }
  check(edgeOpacity(40)===1&&edgeOpacity(20)===44/60&&edgeOpacity(-24)===0,'Csak a bal szélen halványul el');
  check(noteName(233.0819)==='B♭3'&&noteName(261.6256)==='C4','Valódi hangnevek és oktávok');
  function tone(hz,sr,harmonic=false,amplitude=.2){return Float32Array.from({length:4096},(_,i)=>{
    const t=2*Math.PI*hz*i/sr;
    return amplitude*(harmonic ? .35*Math.sin(t)+.8*Math.sin(2*t)+.25*Math.sin(3*t)+.1*Math.sin(4*t) : Math.sin(t));
  });}
  for(const sr of [44100,48000])for(const hz of [70,116.54,174.61,233.0819,261.6256,293.6648,349.2282,440,698.46,1100])for(const harmonic of [false,true]){
    const measured=detectPitch(tone(hz,sr,harmonic),sr);
    check(measured.hz>0&&Math.abs(cents(measured.hz,hz))<10,`Pitch ${hz}/${sr}/${harmonic}: ${measured.hz}`);
  }
  check(detectPitch(new Float32Array(4096),48000).hz===0,'Csend');
  check(detectPitch(tone(233,48000,false,.001),48000).hz===0,'Halk jel');
  let seed=42;
  const noise=Float32Array.from({length:4096},()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return ((seed>>>0)/4294967296-.5)*.2;});
  check(detectPitch(noise,48000).hz===0,'Zaj ne legyen hang');
  const transient=tone(233.0819,48000);for(let i=0;i<500;i++)transient[i]+=noise[i]*3;
  const transientResult=detectPitch(transient,48000);
  check(!transientResult.hz||Math.abs(cents(transientResult.hz,233.0819))<30,'Tranziens ne adjon téves hangot');
  const notes=[{hz:midiHz(58)},{hz:midiHz(59)}];
  for(const deviation of [-70,-50,-40,-20,0,20,40,50,70]){
    const n=matchPitch(notes[0].hz*2**(deviation/1200),[notes[0]],50);
    check(n===(Math.abs(deviation)<=50?0:-1),`Tűrés: ${deviation}`);
  }
  check(matchPitch(notes[0].hz*2,notes,50)===-1,'Rossz oktáv');
  check(matchPitch(notes[0].hz*2**(50/1200),notes,50)===-1,'Félhang-határ holtverseny');
  check(matchPitch(notes[0].hz*2**(49/1200),notes,50)===0,'Határ alatt');
  check(matchPitch(notes[0].hz*2**(51/1200),notes,50)===1,'Határ felett');
  const repeat=new TaskJudge({type:'repeat',needed:3,duration:.15});
  function feed(j,good,quiet,seconds){let successes=0;for(let i=0;i<Math.round(seconds/.01);i++)if(j.update(good,quiet,.01).success)successes++;return successes;}
  feed(repeat,true,false,1);check(repeat.count===1&&!repeat.done,'Hosszú hang egy indítás');
  feed(repeat,false,false,.3);feed(repeat,true,false,.3);check(repeat.count===1,'Másik hang nem valódi szünet');
  feed(repeat,false,true,.15);feed(repeat,true,false,.2);check(repeat.count===2,'Második indítás');
  feed(repeat,false,true,.15);check(feed(repeat,true,false,.2)===1&&repeat.done,'Harmadik indítás');
  check(feed(repeat,true,false,1)===0,'Nincs dupla jutalom');
  const hold=new TaskJudge({type:'hold',needed:1,duration:1});
  feed(hold,true,false,.4);feed(hold,false,false,.1);check(Math.abs(hold.held-.4)<.001,'Kis kiesés áthidalás');
  feed(hold,true,false,.4);check(!hold.done,'Kiesés nem növeli a kitartást');
  feed(hold,false,true,.2);check(hold.held===0,'Hosszú kiesés újrakezd');
  check(feed(hold,true,false,1.1)===1&&hold.done,'Kitartás teljesítve');
  hold.reset();check(!hold.done&&hold.count===0&&hold.held===0,'Állapot visszaáll');
  const unarmedHold=new TaskJudge({type:'hold',needed:1,duration:.5});unarmedHold.armed=false;
  feed(unarmedHold,true,false,1);check(!unarmedHold.done&&unarmedHold.held===0,'Előző feladatból átfújt hang nem új indítás');
  feed(unarmedHold,false,true,.15);check(feed(unarmedHold,true,false,.6)===1,'Levegővétel utáni új hang elfogadva');
  const settings={mode:'mixed',hold:2};
  for(let i=0;i<24;i++){const task=createTask(i,settings,notes);check(task.note>=0&&task.note<2&&task.needed<=4,'Érvényes pálya');if(task.type==='hold')check(task.duration===2,'Helyes hanghossz');}
  return { assertions, result:'PASS' };
}
