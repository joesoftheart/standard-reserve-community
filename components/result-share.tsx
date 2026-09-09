 'use client';
import {useEffect,useRef,useState} from 'react';
import {Download,ExternalLink,Trophy} from 'lucide-react';
import {getSupabase} from '@/lib/supabase';
import {publicShareUrl,resultPost,shareTime} from '@/lib/result-share';
import './result-share.css';
type Props={score:number;elapsed:number;locale:'th'|'en';saved:boolean;runId:string};
function loadImage(src:string){return new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src})}
export default function ResultShare({score,elapsed,locale,saved,runId}:Props){
 const th=locale==='th',icon=useRef<HTMLSpanElement>(null);
 const [image,setImage]=useState(''),[post,setPost]=useState(''),[error,setError]=useState(false),[retry,setRetry]=useState(0),[local,setLocal]=useState(false),[rankWarning,setRankWarning]=useState(false);
 useEffect(()=>{let alive=true;setImage('');setError(false);setRankWarning(false);
 async function create(){try{
 let name='Community explorer',rank:number|null=null;const db=getSupabase();
 if(db){const {data}=await db.auth.getUser();const m=data.user?.user_metadata;if(m)name=String(m.user_name||m.preferred_username||m.full_name||name);if(saved){const res=await db.rpc('knowledge_leaderboard');if(res.error){if(alive)setRankWarning(true)}else{const mine=res.data?.find((r:{mine:boolean})=>r.mine);if(mine){rank=Number(mine.rank);name=mine.username}else if(alive)setRankWarning(true)}}}
 const url=publicShareUrl(process.env.NEXT_PUBLIC_SITE_URL||location.origin,locale);const date=new Date().toISOString().replace('T',' ').slice(0,16)+' UTC';
 const bg=await loadImage('/share-ivory-city.png');await document.fonts.ready;
 const c=document.createElement('canvas');c.width=1600;c.height=900;const x=c.getContext('2d');if(!x)throw Error('CANVAS');x.drawImage(bg,0,0,1600,900);
 function text(t:string,px:number,y:number,size:number,color='#10254c',font='Georgia',max=810){x!.fillStyle=color;x!.font=`${size}px ${font}`;while(x!.measureText(t).width>max&&size>14){size--;x!.font=`${size}px ${font}`}x!.fillText(t,px,y)}
 text('S T A N D A R D',65,115,67);text('K N O W L E D G E   C H A L L E N G E',68,158,21,'#263e68','Arial');
 text('100 QUESTIONS. CHALLENGE COMPLETE.',68,253,24,'#4963a1','Arial');
 text(name==='Community explorer'?name:'@'+name.replace(/^@/,''),65,372,78);
 text(String(score),65,578,188,'#10254c','Georgia',255);text('/ 100',335,565,116,'#7280b9');text('C O R R E C T',345,614,22,'#7280b9','Arial');
 text('TIME',70,709,20);text(shareTime(elapsed),68,774,61);
 const svg=icon.current?.querySelector('svg');if(svg){const img=await loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg.outerHTML));x.drawImage(img,358,698,72,72)}
 text('BEST-RESULT RANK',455,709,18);text(rank?'#'+rank:saved?'Unavailable':'Unranked',455,774,54);
 text('Community-made • Learn. Play. Understand.',65,851,23);text('#STANDARD',1260,851,23,'#10254c','Arial',290);
 text('Rank snapshot: '+date,65,880,15,'#667085','Arial');
 if(url)text(new URL(url).host,950,880,17,'#34445f','Arial',585);
 if(alive){setImage(c.toDataURL('image/png'));setPost(resultPost(score,elapsed,rank,locale,url));setLocal(!url)}
 }catch{if(alive)setError(true)}}void create();return()=>{alive=false}
 },[score,elapsed,locale,saved,runId,retry]);
 return <section className="resultShare" aria-label={th?'การ์ดแชร์ผล':'Share result card'}><span ref={icon} hidden><Trophy color="#a2783c" strokeWidth={1.4} width={72} height={72}/></span>
 {image?<img className="resultSharePreview" src={image} alt={th?`การ์ดผลคะแนน ${score} จาก 100 เวลา ${shareTime(elapsed)}`:`Result card: ${score} out of 100, time ${shareTime(elapsed)}`}/>:<p role="status">{error?(th?'สร้างการ์ดไม่สำเร็จ':'Could not create card'):(th?'กำลังสร้างการ์ดของคุณ…':'Creating your card…')}</p>}
 {error&&<button className="button" onClick={()=>setRetry(v=>v+1)}>{th?'ลองอีกครั้ง':'Retry'}</button>}
 {image&&<><div className="buttons"><a className="button primary" href={image} download={`standard-result-${score}-${runId}.png`}><Download size={17}/>{th?'ดาวน์โหลดการ์ด PNG':'Download PNG'}</a><a className="button" href={'https://x.com/intent/tweet?'+new URLSearchParams({text:post})} target="_blank" rel="noopener noreferrer"><ExternalLink size={17}/>{th?'เปิด X พร้อมข้อความ':'Open X with text'}</a></div><details><summary>{th?'ดู / แก้ไขข้อความโพสต์':'Preview / edit post text'}</summary><textarea aria-label={th?'ข้อความโพสต์ X':'X post text'} value={post} onChange={e=>setPost(e.target.value)}/></details><small>{th?'ดาวน์โหลดภาพ แล้วแนบภาพใน X ก่อนกดโพสต์ อันดับอ้างอิงผลงานดีที่สุด อาจต่างจากผลรอบนี้':'Download the image and attach it in X before posting. Rank refers to your best result and may differ from this run.'}</small>{local&&<small>{th?'เว็บยังใช้ที่อยู่ภายในเครื่อง จึงยังไม่ใส่ลิงก์ในโพสต์ เมื่อใช้โดเมนจริงจะเพิ่มลิงก์ให้':'The site is local, so no public link is included yet. A link will be added when a public domain is configured.'}</small>}{rankWarning&&<small role="status">{th?'โหลดอันดับไม่สำเร็จ จึงไม่ระบุตัวเลขอันดับ':'Rank unavailable; no rank number is included.'} <button onClick={()=>setRetry(v=>v+1)}>{th?'ลองใหม่':'Retry'}</button></small>}</>}
 </section>
}
