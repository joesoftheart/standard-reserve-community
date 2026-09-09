 'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
import {recordTelemetry} from '@/lib/telemetry';
export default function SiteTelemetry(){const path=usePathname();useEffect(()=>{void recordTelemetry()},[path]);useEffect(()=>{let last=0;const error=()=>{if(Date.now()-last<30000)return;last=Date.now();void recordTelemetry('runtime')};window.addEventListener('error',error);window.addEventListener('unhandledrejection',error);return()=>{window.removeEventListener('error',error);window.removeEventListener('unhandledrejection',error)}},[]);return null}
