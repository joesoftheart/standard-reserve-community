'use client';
import {useEffect,useState} from 'react';
import {ArrowRight,ArrowUpRight,Check,Coins,GitBranch,Landmark,RotateCcw,Wallet} from 'lucide-react';
import './banker-infographic.css';
const steps=[
 ['คุณมาถึงหน้าธนาคาร','You arrive at the bank','คุณมี ETH ในกระเป๋า และอยากเข้าร่วมเป็น Banker เรื่องนี้จำลองการซื้อ Charter หลังช่วง Genesis','You have ETH and want to become a Banker. This story follows a Charter purchase after Genesis.','เดินไปที่การประมูล','Visit the auction'],
 ['พบการประมูล Charter','You find a Charter auction','Charter ใหม่เปิดขายผ่าน Dutch auction ด้วย ETH คุณเลือกซื้อที่ราคาขณะนั้นได้ ตัวอย่างนี้ไม่ระบุราคาจริง','New Charters are sold for ETH through a Dutch auction. You can buy at the current price. No actual price is assumed here.','ซื้อ Charter ด้วย ETH','Buy a Charter with ETH'],
 ['ETH ออกจากกระเป๋าคุณ','ETH leaves your wallet','เมื่อซื้อสำเร็จ คุณจ่าย ETH ให้โปรโตคอล รายได้นี้เข้าสู่ระบบจัดสรรรายได้ของธนาคาร','On a successful purchase, you pay ETH to the protocol. That revenue enters the bank’s fee-routing system.','',''],
 ['Charter มาอยู่กับคุณ','Your Charter arrives','คุณได้รับ Charter NFT และสถานะ Banker โดย Charter เริ่มต้นโอนย้ายไม่ได้','You receive a Charter NFT and Banker status. The Charter is initially non-transferable.','เปิดดู Charter','Look inside the Charter'],
 ['ภายในมี 1 Branch เริ่มต้น','One initial Branch is inside','Branch นี้เป็นหน่วยที่รับส่วนแบ่งการออกเหรียญ สัดส่วนขึ้นกับจำนวน Branch ของคุณเทียบกับทั้งระบบ','This Branch earns a share of issuance, proportional to your Branch count relative to the whole system.','ดูการสะสมเมื่อมี issuance','See issuance accrue'],
 ['ยอดสะสมเริ่มเพิ่มใน Charter','A balance accrues to the Charter','เมื่อระบบมีการออกเหรียญ ส่วนแบ่งจะสะสมในบัญชี Charter ภาพนี้แสดงกระบวนการ ไม่ได้กำหนดอัตราหรือรับประกันผลตอบแทน','When the system issues, your share accrues to the Charter’s balance. This illustrates the process, not a fixed rate or guaranteed return.','',''],
 ['คุณเป็น Banker แล้ว','You are now a Banker','ตอนจบคุณมี Charter พร้อม 1 Branch และยอดสะสมภายใน เหรียญยังไม่ได้เข้ากระเป๋า การถอนต้องปิด Branch และหักค่าธรรมเนียม ซึ่งเป็นอีกเรื่องหนึ่ง','You now have a Charter, one Branch and an internal accrued balance. Tokens have not entered your wallet. Withdrawing requires retiring a Branch and paying a fee—a separate story.','เล่นเรื่องนี้อีกครั้ง','Replay this story'],
];
export default function BankerInfographic({locale,onNext,onComplete}:{locale:'th'|'en';onNext?:()=>void;onComplete?:()=>void}){
 const th=locale==='th';const [step,setStep]=useState(0);const [paused,setPaused]=useState(false);const moving=step===2||step===5;
 useEffect(()=>{if(!moving||paused)return;const timer=setTimeout(()=>setStep(s=>s+1),4200);return()=>clearTimeout(timer)},[step,moving,paused]);
 const advance=()=>{setPaused(false);setStep(s=>s===6?0:s+1)};const reset=()=>{setStep(0);setPaused(false)};
 useEffect(()=>{if(step===6)onComplete?.()},[step,onComplete]);
 return <section className="story" aria-labelledby="story-title"><div className="storyHeading"><div><span className="eyebrow">INTERACTIVE STORY / 01</span><h2 id="story-title">{th?'จากผู้มาเยือน สู่ Banker':'From visitor to Banker'}</h2></div><button className="storyRestart" onClick={reset} aria-label={th?'เริ่มเรื่องใหม่':'Restart story'}><RotateCcw size={17}/><span>{th?'เริ่มใหม่':'Restart'}</span></button></div>
 <div className={'storyStage storyStep'+step+(paused?' storyPaused':'')}>
 <div className="storyProgress" aria-label={th?'ความคืบหน้าของเรื่อง':'Story progress'}>{[th?'เข้ามา':'Arrive',th?'ซื้อ Charter':'Buy Charter',th?'เปิด Branch':'Inside',th?'สะสม':'Accrue'].map((v,i)=><span key={i} className={step>=[0,1,4,5][i]?'reached':''}><i/>{v}</span>)}</div>
 <div className="storyWorld">
 <div className="storyFloor"/>
 <svg className="storyRoutes" viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true"><path d="M150 310 L400 235 L580 265 L840 155"/><path d="M580 265 L580 130"/></svg>
 <div className="storyBank" aria-hidden="true"><img src="/lab-bank-memorial.png" alt=""/></div>
 <div className="storyPerson"><div className={'storyActorSprite actorPose'+(step<2?0:step===2?1:2)} role="img" aria-label={th?(step<2?'ตัวละครฮู้ดม่วงเดินเข้าธนาคาร':step===2?'ตัวละครกำลังจ่าย ETH':'ตัวละครถือ Charter และยกนิ้ว'):(step<2?'Purple hoodie character arriving':step===2?'Character paying ETH':'Character holding a Charter and giving a thumbs up')}/><span>{th?'คุณ':'YOU'}</span><div className="storyWallet"><Wallet size={15}/>{step<3?'ETH':th?'จ่าย ETH แล้ว':'ETH paid'}{step>=3&&<Check size={13}/>}</div></div>
 <div className="storyAuction"><span className="storyLocation">01 / AUCTION</span><div className="storyPlinth"><Landmark size={30}/><b>CHARTER</b></div><span>{step>=3?(th?'ซื้อสำเร็จ':'Purchased'):'ETH · DUTCH AUCTION'}</span></div>
 <div className="storyEth" aria-hidden="true"><b>Ξ</b><b>Ξ</b><b>Ξ</b></div>
 <div className="storyCharter"><Landmark size={22}/><b>CHARTER</b><small>{th?'ธนาคารของคุณ':'YOUR BANK'}</small>{step>=4&&<div className="storyBranch"><GitBranch size={22}/><strong>1 BRANCH</strong></div>}</div>
 <div className="storyLedger"><span className="storyLocation">02 / CHARTER BALANCE</span><Coins size={24}/><b>{step===6?(th?'ยอดสะสมเพิ่มแล้ว':'Balance accrued'):(th?'บัญชีสะสม':'Internal balance')}</b><div className="storyLedgerBars"><i/><i/><i/><i/></div><small>{th?'ยังอยู่ใน Charter':'Still inside your Charter'}</small></div>
 <div className="storyIssuance" aria-hidden="true"><i/><i/><i/></div>
 {step===6&&<div className="storyComplete"><Check size={19}/>{th?'BANKER · พร้อมแล้ว':'BANKER · READY'}</div>}
 </div>
 <div className="storyCaption" key={step} aria-live="polite"><span className="storyEvent">{th?'เหตุการณ์':'EVENT'} {String(step+1).padStart(2,'0')} / 07</span><h3>{steps[step][th?0:1]}</h3><p>{steps[step][th?2:3]}</p><div className="storyActions">{moving?<><button className="button primary" onClick={()=>setPaused(p=>!p)}>{paused?(th?'เล่นต่อ':'Resume'):(th?'พักภาพ':'Pause')}</button><button className="button" onClick={advance}>{th?'ไปต่อ':'Continue'}<ArrowRight size={16}/></button></>:<button className="button primary" onClick={advance}>{steps[step][th?4:5]}{step===6?<RotateCcw size={16}/>:<ArrowRight size={16}/>}</button>}{step===6&&onNext&&<button className="button primary" onClick={onNext}>{th?'ไปเรื่องถัดไป':'Next story'}<ArrowRight size={16}/></button>}{step>0&&<button className="storyBack" onClick={()=>{setPaused(false);setStep(s=>s-1)}}>{th?'ย้อนเหตุการณ์':'Previous event'}</button>}</div></div>
 </div><div className="storyFooter"><span>{th?'เรื่องจำลองเพื่อเรียนรู้ · ไม่ใช้เงินจริงหรือเชื่อมกระเป๋า':'Educational story · No real funds or wallet connection'}</span><a href="https://www.standardreserve.xyz/whitepaper/#charters" target="_blank" rel="noopener noreferrer">Whitepaper<ArrowUpRight size={14}/></a></div></section>
}
