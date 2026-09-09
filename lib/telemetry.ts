import {getSupabase} from '@/lib/supabase';
export const analyticsPreference='standard-analytics-enabled';
export function analyticsAllowed(){try{return localStorage.getItem(analyticsPreference)!=='false'&&navigator.doNotTrack!=='1'&&!(navigator as Navigator&{globalPrivacyControl?:boolean}).globalPrivacyControl}catch{return false}}
export function analyticsPath(path:string){return /^\/(en|th)(\/(learn|quiz|challenges|simulate|community|founder|rankings|about|privacy))?\/?$/.test(path)?path.replace(/\/$/,''):null}
export async function recordTelemetry(kind='view'){
 if(!analyticsAllowed()||!['view','runtime','quiz_connection','auth_connection'].includes(kind))return;
 const path=analyticsPath(location.pathname);if(!path)return;
 if(location.hostname==='localhost'||location.hostname==='127.0.0.1')return;
 try{let session=sessionStorage.getItem('standard-visit-session');if(!session){session=crypto.randomUUID();sessionStorage.setItem('standard-visit-session',session)}await getSupabase()?.rpc('record_site_visit',{p_session:session,p_path:path,p_kind:kind})}catch{/* Telemetry must never block learning. */}
}
