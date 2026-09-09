import {test} from 'node:test';import assert from 'node:assert/strict';import {advance,initial,Inputs} from '../lib/engine';
const input:Inputs={flow:20,market:0,activity:0,pressure:0,depth:100,action:'hold'};
test('policy changes at zero net ETH flow',()=>{assert.equal(advance(initial,input).policy,'expansion');assert.equal(advance(initial,{...input,flow:0}).policy,'contraction');assert.equal(advance(initial,{...input,flow:-1}).policy,'contraction')});
test('license adds a branch and burns assumed cost',()=>{const n=advance(initial,{...input,action:'license'});assert.equal(n.branches,4);assert.equal(n.burned,5);assert.equal(initial.branches,3)});
test('closed charter cannot reopen via license',()=>{const exited=advance(initial,{...input,action:'exit'});assert.equal(exited.branches,0);assert.equal(advance(exited,{...input,action:'license'}).branches,0)});
test('branch count caps at ten',()=>{assert.equal(advance({...initial,branches:10},{...input,action:'expand'}).branches,10)});
test('stress never produces negative or nonfinite balances',()=>{let s=initial;for(let i=0;i<1000;i++)s=advance(s,{...input,flow:-100,pressure:100,depth:0,action:'close'});assert.equal(s.reserve,0);assert.equal(s.branches,0);assert.ok(Number.isFinite(s.burned));assert.ok(s.history.length<=20)});
test('invalid numeric inputs are bounded',()=>{const s=advance(initial,{...input,flow:NaN,depth:Infinity,pressure:NaN});assert.ok(Number.isFinite(s.reserve));assert.ok(Number.isFinite(s.flow))});
