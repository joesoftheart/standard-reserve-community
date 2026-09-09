import './globals.css';
import type { Metadata } from 'next';
export const metadata: Metadata = {metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),title:'Standard Reserve — Community Hub',description:'Experience the monetary engine. Learn, simulate, and challenge yourself.',openGraph:{images:['/api/og']}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
