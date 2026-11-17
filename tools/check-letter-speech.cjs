const base=(process.env.SITE_URL||'http://localhost:8765/learn-with-me').replace(/\/$/,'');
/* Speech requests are mocked; audible pronunciation requires device validation. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome',args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:360,height:800}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
   window.speechCalls=[];
   window.testVoices=[{name:'Microsoft Ravi',lang:'en-IN'},{name:'Microsoft Heera',lang:'en-IN'},{name:'Microsoft Gagan',lang:'kn-IN'},{name:'Microsoft Sapna',lang:'kn-IN'}];
   Object.defineProperty(window,'speechSynthesis',{value:{getVoices:()=>window.testVoices,cancel:()=>window.speechCalls.push({cancel:true}),speak:u=>window.speechCalls.push({text:u.text,lang:u.lang,voice:u.voice?.name,rate:u.rate,pitch:u.pitch})}});
   window.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
  });
  await page.goto(base+'/#/lkg/english/uppercase');
  assert.deepEqual(await page.evaluate(()=>speechCalls.filter(c=>c.text)),[]);
  await page.locator('#letterCanvas').click({position:{x:100,y:100}});
  assert.deepEqual(await page.evaluate(()=>speechCalls.at(-1)),{text:'Capital A',lang:'en-IN',voice:'Microsoft Heera',rate:.85,pitch:1});
  let count=0;
  const numeralAnnouncements=['O, N, E. One.','T, W, O. Two.','T, H, R, E, E. Three.','F, O, U, R. Four.','F, I, V, E. Five.','S, I, X. Six.','S, E, V, E, N. Seven.','E, I, G, H, T. Eight.','N, I, N, E. Nine.','T, E, N. Ten.'];
  for(const set of ['uppercase','lowercase','combination','numbers','numerals','kannadaSwaras','kannadaVyanjanas']){
   await page.evaluate(key=>changeSet(key),set);
   const names=await page.evaluate(()=>getCharacters().map(c=>c.name));
   for(let i=0;i<names.length;i++){
    if(i)await page.locator('#nextButton').click();
    const expectedText=set==='uppercase'?'Capital '+names[i]:set==='lowercase'?'Small '+names[i].toUpperCase():set==='numbers'?await page.evaluate(n=>CURRICULUM.numberName(n),i+1):set==='combination'?'Capital '+names[i][0]+', small '+names[i][0]:set==='numerals'?numeralAnnouncements[i]:names[i];
    const last=await page.evaluate(()=>speechCalls.at(-1));
    assert.equal(last.text,expectedText);assert.equal(last.rate,.85);assert.equal(last.pitch,1);
    assert.equal(last.lang,set.startsWith('kannada')?'kn-IN':'en-IN');
    assert.equal(last.voice,set.startsWith('kannada')?'Microsoft Sapna':'Microsoft Heera');
    assert.equal(await page.evaluate(()=>speechCalls.at(-2).cancel),true);
    await page.locator('#hearButton').click();
    assert.deepEqual(await page.evaluate(()=>speechCalls.at(-1)),last);
    assert.equal(await page.evaluate(()=>state.letterIndex),i);
    count++;
   }
   await page.locator('#previousButton').click();
   assert.equal(await page.evaluate(()=>state.letterIndex),names.length-2);
   await page.locator('#replayButton').click();
   assert.equal(await page.evaluate(()=>state.strokeIndex),0);
   if(set==='numerals')assert.equal(await page.evaluate(()=>speechCalls.at(-1).text),numeralAnnouncements[names.length-2]);
   await page.locator('#pauseButton').click();
   assert.equal(await page.evaluate(()=>speechCalls.at(-1).cancel),true);
   await page.locator('#playButton').click();
   assert.equal(await page.evaluate(()=>speechCalls.at(-1).lang),set.startsWith('kannada')?'kn-IN':'en-IN');
   if(set==='numerals')assert.equal(await page.evaluate(()=>speechCalls.at(-1).text),numeralAnnouncements[names.length-2]);
  }
  assert.equal(count,187);
  // Without a listed Kannada voice, do not force the English voice onto Kannada.
  await page.evaluate(()=>{window.testVoices=[{name:'Microsoft Heera',lang:'en-IN'}];});
  await page.locator('#hearButton').click();
  assert.equal(await page.evaluate(()=>speechCalls.at(-1).lang),'kn-IN');
  assert.equal(await page.evaluate(()=>speechCalls.at(-1).voice),undefined);
  await page.evaluate(()=>{window.testVoices=[{name:'Kannada male',lang:'kn-IN'}];});
  await page.locator('#hearButton').click();
  assert.equal(await page.evaluate(()=>speechCalls.at(-1).voice),'Kannada male');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:'/tmp/write-with-me-voice.png',fullPage:true});
  const unsupported=await browser.newPage();
  await unsupported.addInitScript(()=>{delete window.speechSynthesis;delete window.SpeechSynthesisUtterance;});
  await unsupported.goto(base+'/#/lkg/english/uppercase');
  assert.equal(await unsupported.locator('#hearButton').isVisible(),false);
  for(const [set,first,second] of [['kannadaSwaras','ಅ','ಆ'],['kannadaVyanjanas','ಕ','ಖ']]){
   await unsupported.evaluate(key=>changeSet(key),set);
   assert.ok((await unsupported.locator('#letter-heading').textContent()).includes(first));
   await unsupported.locator('#nextButton').click();
   assert.ok((await unsupported.locator('#letter-heading').textContent()).includes(second));
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: all 187 exercises in seven categories; shared female en-IN preference; female kn-IN preference; Kannada fallback; Hear, first gesture, Next/Previous, replay, pause/resume, cancellation, mobile layout and unsupported browsers. Speech mocked; audible pronunciation not verified.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
