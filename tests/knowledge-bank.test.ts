import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const bank=JSON.parse(fs.readFileSync(new URL('../supabase/knowledge-bank.json',import.meta.url),'utf8'));
test('ranked bank contains exactly 100 unique bilingual questions with four distinct answers',()=>{
 assert.equal(bank.length,100);assert.equal(new Set(bank.map((q:any)=>q.id)).size,100);
 for(const locale of ['th','en']){assert.equal(new Set(bank.map((q:any)=>q[locale].q)).size,100);for(const q of bank){assert.equal(q[locale].options.length,4);assert.equal(new Set(q[locale].options).size,4);assert.ok(q[locale].options[q.correct]);assert.ok(q[locale].explanation.length>20)}}
});
test('all questions link to known whitepaper sections and cover essential mechanics',()=>{
 const anchors=new Set(['entities','currency','net-flow','policy','branches','charters','exits','reserves','dormancy','auctions','transfers','parameters']);for(const q of bank)assert.ok(anchors.has(q.anchor));for(const topic of ['exits','reserves','defense','dormancy'])assert.ok(bank.some((q:any)=>q.topic===topic));
});

test('reviewed bank has per-question source references and no invented numeric scenarios',()=>{for(const q of bank){assert.ok(q.id>=101&&q.id<=200);assert.equal(q.source.url,'https://www.standardreserve.xyz/whitepaper/#'+q.anchor);assert.equal(q.source.version,'v0.1');assert.ok(!q.th.q.startsWith('ตัวอย่าง'));assert.ok(!q.en.q.startsWith('Example:'));}});
