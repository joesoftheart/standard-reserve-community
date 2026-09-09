'use client';
import {useEffect,useState} from 'react';
import {getSupabase} from '@/lib/supabase';
import {displayIdentity} from '@/lib/auth';
export default function AuthControls({locale}:{locale:'en'|'th'}){
 const thai=locale==='th';const [name,setName]=useState(''),[busy,setBusy]=useState(false);
 const notify=(text:string)=>window.dispatchEvent(new CustomEvent('reserve-notice',{detail:text}));
 useEffect(()=>{const db=getSupabase();if(!db)return;let alive=true;db.auth.getSession().then(({data,error})=>{if(alive)setName(displayIdentity(data.session?.user||null));if(error)notify(thai?'อ่านสถานะการเข้าสู่ระบบไม่สำเร็จ':'Could not read sign-in status')});const {data}=db.auth.onAuthStateChange((_e,s)=>setName(displayIdentity(s?.user||null)));return()=>{alive=false;data.subscription.unsubscribe()}},[thai]);
 async function login(){const db=getSupabase();if(!db){notify(thai?'ต้องเชื่อมต่อ Supabase และเปิด X OAuth ก่อน คุณยังเล่นกิจกรรมทั้งหมดได้':'Connect Supabase and enable X OAuth first. All learning activities remain available.');return}setBusy(true);try{const callback=new URL('/auth/callback',location.origin);sessionStorage.setItem('reserve-auth-return',location.pathname);const {error}=await db.auth.signInWithOAuth({provider:'x',options:{redirectTo:callback.toString()}});if(error)notify(error.message)}catch{notify(thai?'เชื่อมต่อไม่ได้ กรุณาลองอีกครั้ง':'Connection failed. Please try again.')}finally{setBusy(false)}}
 async function logout(){const db=getSupabase();if(!db)return;setBusy(true);const {error}=await db.auth.signOut({scope:'local'});if(error)notify(error.message);else setName('');setBusy(false)}
 return name?<div className="authIdentity"><span title={name}>@{name}</span><button className="login" disabled={busy} onClick={logout}>{thai?'ออกจากระบบ':'Sign out'}</button></div>:<button className="login" aria-label={thai?'เข้าสู่ระบบด้วย X':'Login with X'} disabled={busy} onClick={login}>𝕏 <span>{busy?(thai?'กำลังเชื่อมต่อ…':'Connecting…'):(thai?'เข้าสู่ระบบด้วย X':'Login with X')}</span></button>
}
