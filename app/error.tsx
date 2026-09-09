 'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main style={{padding:40}}><h1>Something went wrong / เกิดข้อผิดพลาด</h1><p>Please try again. Your saved results remain in your account.</p><button onClick={reset}>Try again / ลองใหม่</button><a href="https://x.com/joesofth3art" target="_blank" rel="noreferrer"> Report on X</a></main>}
