export function shareTime(ms:number){const s=Math.floor(ms/1000);return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`}
export function publicShareUrl(origin:string,locale:string){try{const u=new URL(origin);if(u.protocol!=='https:'||u.hostname==='localhost'||u.hostname.endsWith('.local')||/^(127\.|0\.|10\.|192\.168\.)/.test(u.hostname)||u.hostname.includes(':'))return '';return new URL(`/${locale==='th'?'th':'en'}/learn`,u.origin).href}catch{return ''}}
export function resultPost(score:number,elapsed:number,rank:number|null,locale:string,url:string){
 const th=locale==='th';
 const stats=[
  th?`✅ ตอบถูก ${score}/100 ข้อ`:`✅ ${score}/100 correct`,
  `⏱️ ${shareTime(elapsed)}`,
  rank?(th?`🏆 อันดับผลงานดีที่สุดตอนนี้ #${rank}`:`🏆 Currently #${rank} on the leaderboard (personal best)`):'',
 ].filter(Boolean).join('\n');
 const challenge=rank===1
  ?(th?'มาแย่งที่ 1 ไปจากผมหน่อย… เริ่มนั่งสบายเกินไปแล้ว 😂':'Come take my spot… I’m getting too comfortable up here 😂')
  :(th?'ใครจะทำได้ดีกว่านี้? ขอท้าหน่อย 😄':'Your turn. Let’s see what you’ve got 😄');
 return [
  th?'จบแล้ว! STANDARD ครบ 100 ข้อ 🎯':'Just finished 100 questions on STANDARD 🎯',
  stats,
  challenge,
  [th?`คิดว่าจะทำได้ดีกว่า ${score} คะแนนไหม? ลองเลย 👇`:`Think you can beat ${score}? Give it a try 👇`,url].filter(Boolean).join('\n'),
  'Learning about @standard_rsv, built by @0xbeans\n#STANDARD #StandardReserve',
 ].join('\n\n');
}
