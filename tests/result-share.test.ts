import test from 'node:test';
import assert from 'node:assert/strict';
import {publicShareUrl,resultPost,shareTime} from '../lib/result-share';
test('share links exclude development addresses and use locale routes',()=>{for(const u of ['http://localhost:3000','https://127.0.0.1','https://192.168.1.2','bad'])assert.equal(publicShareUrl(u,'th'),'');assert.equal(publicShareUrl('https://community.example/path','th'),'https://community.example/th/learn')});
test('share text distinguishes best-result rank and omits unknown ranks',()=>{const p=resultPost(92,522000,3,'en','https://community.example/en/learn');assert.match(p,/92\/100/);assert.match(p,/08:42/);assert.match(p,/best-result rank #3/);assert.match(p,/@0xbeans/);assert.match(p,/#STANDARD/);assert.ok(!resultPost(0,0,null,'en','').includes('rank #'));assert.equal(shareTime(3600000),'60:00')});
