'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight,ArrowDownLeft,ArrowUpRight as Inflow,Pause,Play,ArrowRight,Landmark,GitBranch,Flame,Coins,Activity,X} from 'lucide-react';
import en from '@/locales/lab-en.json';
import th from '@/locales/lab-th.json';
type Mode='expansion'|'contraction';
type Focus='market'|'bank'|'charter'|'vault'|null;
export default function ReserveLab({locale}:{locale:'en'|'th'}){
 const t=locale==='th'?th:en;
 const [mode,setMode]=useState<Mode>('expansion'),[step,setStep]=useState(0),[playing,setPlaying]=useState(false),[focus,setFocus]=useState<Focus>(null);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)');setPlaying(!media.matches);const changed=()=>{if(media.matches)setPlaying(false)};media.addEventListener('change',changed);return()=>media.removeEventListener('change',changed)},[]);
 useEffect(()=>{if(!playing)return;const id=window.setInterval(()=>{if(!document.hidden)setStep(s=>(s+1)%4)},4600);return()=>clearInterval(id)},[playing,mode]);
 const stages=t[mode];
 function selectMode(m:Mode){setMode(m);setStep(0);setFocus(null)}
 useEffect(()=>{if(!focus)return;const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setFocus(null)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[focus]);
 const detail=focus?t.details[focus]:null;
 return <div className={`reserveLab ${mode} stage-${step} ${playing?'isPlaying':'isPaused'}`}>
 <div className="labTop"><span className="eyebrow">STANDARD / LAB 001</span><span className="labPreview"><span/>{t.preview}</span></div>
 <div className="labIntro"><h2>{t.title}</h2><p>{t.subtitle}</p></div>
 <div className="labModes" role="group" aria-label={t.conditions}><button aria-pressed={mode==='expansion'} onClick={()=>selectMode('expansion')}><Inflow size={15}/>{t.inflow}</button><button aria-pressed={mode==='contraction'} onClick={()=>selectMode('contraction')}><ArrowDownLeft size={15}/>{t.outflow}</button></div>
 <div className="labScene" aria-label={t.diagram}>
 <svg className="labConnections" viewBox="0 0 720 390" aria-hidden="true" preserveAspectRatio="none">
 <path className={'signal '+(step<2?'lit':'')} d="M135 120 C220 120 200 185 295 185"/>
 <path className={'revenue '+(step===3?'lit':'')} d="M135 145 C200 360 510 365 590 250"/>
 <path className={'allocation '+(step===1?'lit':'')} d="M390 225 C390 280 250 235 180 290"/>
 <path className={'license '+(step===2?'lit':'')} d="M190 305 C290 350 370 305 370 235"/>
 <path className={'vaultFlow '+(step===3?'lit':'')} d="M420 185 C495 185 470 250 575 250"/>
 </svg>
 <div className="labBankArt"><img src="/lab-bank.png" alt={t.artAlt} width={1024} height={1024}/></div>
 <button className={'labNode marketNode '+(step===0?'nodeActive':'')} onClick={()=>{setFocus('market');setPlaying(false)}} aria-label={t.details.market.title}><span className="nodeSymbol"><Activity size={19}/></span><span><b>ETH / STANDARD</b><small>{t.market}</small></span><span className="nodeHint">↗</span></button>
 <div className="flowReadout"><span>{t.signal}</span><b>{mode==='expansion'?'ETH in > ETH out':'ETH in ≤ ETH out'}</b><small>{t[mode+'Label' as 'expansionLabel'|'contractionLabel']}</small></div>
 <button className={'bankCaption '+(step===1?'nodeActive':'')} onClick={()=>{setFocus('bank');setPlaying(false)}}><Landmark size={15}/><span>{t.engine}</span><span className="nodeHint">↗</span></button>
 <button className={'labNode charterNode '+(step===2?'nodeActive':'')} onClick={()=>{setFocus('charter');setPlaying(false)}}><span className="nodeSymbol"><GitBranch size={20}/></span><span><b>CHARTER</b><small>{t.banker}</small><span className="branchUnits" aria-label={t.branches}><GitBranch size={15}/><GitBranch size={15}/><GitBranch size={15}/>{mode==='expansion'&&step>=2&&<span className="newBranch"><GitBranch size={15}/> +</span>}</span></span><span className="nodeHint">↗</span></button>
 <button className={'labNode vaultNode '+(step===3?'nodeActive':'')} onClick={()=>{setFocus('vault');setPlaying(false)}}><span className="nodeSymbol">{mode==='expansion'?<Coins size={21}/>:<Flame size={21}/>}</span><span><b>{mode==='expansion'?t.expansionVault:t.contractionVault}</b><small>{mode==='expansion'?t.reserve:t.buyback}</small></span><span className="nodeHint">↗</span></button>
 <div className={'tokenEvent '+(step===2?'show':'')}><Flame size={14}/>{mode==='expansion'?t.licenseBurn:t.slowerIssuance}</div>
 <div className="sceneLegend"><span className="legendSignal"/>{t.policySignal}<span className="legendRevenue"/>{t.revenue}</div>
 {detail&&<div className="labDetail" role="dialog" aria-label={detail.title}><button aria-label={t.close} onClick={()=>setFocus(null)} autoFocus><X size={17}/></button><h3>{detail.title}</h3><p>{detail.body}</p><a href={'https://www.standardreserve.xyz/whitepaper/#'+detail.anchor} target="_blank" rel="noreferrer">{t.whitepaper}<ArrowUpRight size={14}/></a></div>}
 </div>
 <div className="labStory"><div className="storyTop"><span className="storyNumber">0{step+1} / 04</span><span className={'actor '+(step===2&&mode==='expansion'?'bankerActor':'')}>{step===2&&mode==='expansion'?t.bankerAction:t.automatic}</span></div><h3>{stages[step].title}</h3><p>{stages[step].body}</p></div>
 <div className="labTransport"><div className="stepButtons" role="group" aria-label={t.steps}>{stages.map((s,i)=><button key={i} aria-label={`${i+1}. ${s.title}`} aria-current={step===i?'step':undefined} className={step===i?'current':''} onClick={()=>{setStep(i);setPlaying(false)}}><span/></button>)}</div><button className="labPlay" aria-label={playing?t.pause:t.play} onClick={()=>setPlaying(v=>!v)}>{playing?<Pause size={16}/>:<Play size={16}/>}<span>{playing?t.pause:t.play}</span></button><button className="labNext" onClick={()=>{setStep(s=>(s+1)%4);setPlaying(false)}} aria-label={t.next}><ArrowRight size={18}/></button></div>
 <div className="labBottom"><span>{t.disclaimer}</span><Link href={`/${locale}/simulate`}>{t.try}<ArrowUpRight size={15}/></Link></div>
 </div>
}
