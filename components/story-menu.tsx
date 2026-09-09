'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {RotateCcw,ChevronDown,ChevronRight,Landmark,GitBranch,Building2,ArrowDownUp,Coins,LogOut,Users,Clock} from 'lucide-react';
import './story-menu.css';
import BankerInfographic from './banker-infographic';
import BranchStory from './branch-story';
import JourneyScene from './journey-scene';
import type {StoryId} from '@/lib/journey-stories';
const topics=[
 ['ก้าวแรกสู่การเป็น Banker','Your first step into banking',Landmark],
 ['Branch ของคุณสร้างส่วนแบ่งอย่างไร','How Branches determine your share',GitBranch],
 ['ขยายธนาคาร แล้วเหรียญไปไหน','Expand your bank: where do the tokens go?',Building2],
 ['เงินเข้า–ออก เปลี่ยนนโยบายอย่างไร','How inflows and outflows change policy',ArrowDownUp],
 ['รายได้เดินทางไปที่ไหน','Where does protocol revenue go?',Coins],
 ['ถอนวันนี้ ต้องแลกกับอะไร','What does withdrawing cost you?',LogOut],
 ['เมื่อคนอื่นออก คนที่อยู่ได้อะไร','When others leave, what do remaining bankers receive?',Users],
 ['อยู่ต่อ ต้องรักษาสถานะอย่างไร','How to stay active as a Banker',Clock],
] as const;
export default function StoryMenu({locale}:{locale:'th'|'en'}){
 const [selected,setSelected]=useState(0),[open,setOpen]=useState(false),[restart,setRestart]=useState(0);const th=locale==='th';const root=useRef<HTMLElement>(null),trigger=useRef<HTMLButtonElement>(null),choices=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{if(!open)return;choices.current[selected]?.focus();const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false)};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside)},[open,selected]);
 const [completed,setCompleted]=useState<number[]>([]);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem('standard-story-completed-v1')||'[]');if(Array.isArray(v))setCompleted(v.filter(n=>Number.isInteger(n)&&n>=0&&n<8))}catch{}},[]);
 const complete=useCallback(()=>{setCompleted(prev=>{if(prev.includes(selected))return prev;const next=[...prev,selected];try{localStorage.setItem('standard-story-completed-v1',JSON.stringify(next))}catch{}return next})},[selected]);
 const choose=(i:number)=>{setSelected(i);setOpen(false);trigger.current?.focus()};
 return <section ref={root} className="storyMenu chapterMenu" aria-labelledby="story-menu-title" onKeyDown={e=>{if(e.key==='Escape'&&open){e.preventDefault();setOpen(false);trigger.current?.focus()}}} onBlur={e=>{if(e.relatedTarget&&!e.currentTarget.contains(e.relatedTarget as Node))setOpen(false)}}>
 <div className="chapterIntro"><span className="eyebrow">INTERACTIVE JOURNEY / 08 STORIES</span><h2 id="story-menu-title">{th?'สำรวจชีวิต Banker':'Explore life as a Banker'}</h2><span className="chapterLearned">{th?'เรียนจบบนอุปกรณ์นี้':'Completed on this device'} · {completed.length} / 8</span></div>
 <div className="chapterBar"><span className="chapterCount">{th?'เรื่อง':'Story'} <b>{String(selected+1).padStart(2,'0')}</b><span> / 08</span></span><h3>{topics[selected][th?0:1]}</h3><div className="chapterActions"><button type="button" className="chapterToggle" ref={trigger} aria-expanded={open} aria-controls="chapter-picker" onClick={()=>setOpen(v=>!v)}>{th?'เลือกเรื่อง':'Choose a story'}<ChevronDown size={18} className={open?'turned':''}/></button><button type="button" className="storyRestart chapterReset" onClick={()=>{setRestart(v=>v+1);setOpen(false)}} aria-label={th?'เริ่มเรื่องนี้ใหม่':'Restart this story'} title={th?'เริ่มเรื่องนี้ใหม่':'Restart this story'}><RotateCcw size={19}/></button></div></div>
 <div className="chapterContent"><div id="story-topic-panel" className="chapterLiveScene" role="region" aria-label={topics[selected][th?0:1]}>{selected===0?<BankerInfographic key={restart} locale={locale} onComplete={complete} onNext={()=>choose(1)}/>:selected===1?<BranchStory key={restart} locale={locale} onComplete={complete} onNext={()=>choose(2)}/>:<JourneyScene key={selected+'-'+restart} id={(selected+1) as StoryId} locale={locale} onComplete={complete} onNext={()=>{if(selected===7)setOpen(true);else choose(selected+1)}}/>}</div>
 {open&&<div className="chapterPicker" id="chapter-picker" role="group" aria-label={th?'เลือกจาก 8 เรื่อง':'Choose from 8 stories'}>{topics.map((t,i)=>{const Icon=t[2];return <button ref={el=>{choices.current[i]=el}} type="button" className={'chapterCard'+(selected===i?' current':'')} key={i} aria-pressed={selected===i} onClick={()=>choose(i)}><span className={'chapterArt chapterArt'+i} aria-hidden="true"><span className="chapterArtBase"/><Icon size={35} strokeWidth={1.5}/><i/></span><span className="chapterCardText"><span className="chapterCardMeta"><b>{String(i+1).padStart(2,'0')}</b>{selected===i&&<small>{th?'กำลังเปิด':'Current'}</small>}</span><span>{t[th?0:1]}</span>{completed.includes(i)&&<small className="chapterStamp">✓ {th?'เรียนจบแล้ว':'Completed'}</small>}</span><ChevronRight size={17}/></button>})}</div>}
 </div></section>
}
