// Educational model. All numeric constants are simulation assumptions, not protocol parameters.
export type Action='hold'|'expand'|'license'|'close'|'exit';
export type State={epoch:number;reserve:number;burned:number;branches:number;flow:number;policy:'expansion'|'contraction';history:number[];events:string[]};
export type Inputs={flow:number;market:number;activity:number;pressure:number;depth:number;action:Action};
export const initial:State={epoch:0,reserve:100,burned:0,branches:3,flow:0,policy:'contraction',history:[100],events:[]};
export function advance(s:State,i:Inputs):State{
 const clamp=(n:number,min:number,max:number)=>Math.min(max,Math.max(min,Number.isFinite(n)?n:min));
 const pressure=clamp(i.pressure,0,100),depth=clamp(i.depth,10,1000);
 const flow=clamp(i.flow,-100,100)+clamp(i.market,-20,20)+clamp(i.activity,-10,10)-pressure/5;
 const policy=flow>0?'expansion':'contraction';let branches=s.branches,burn=0;const events=[policy];
 if(i.action==='license'||i.action==='expand'){if(branches>0&&branches<10){branches++;burn+=5;events.push('license');}else events.push('branchLimit');}
 if(i.action==='close'&&branches>0){branches--;burn+=2;events.push('close');}
 if(i.action==='exit'&&branches>0){burn+=branches*2;branches=0;events.push('exit');}
 const buyback=policy==='contraction'?Math.min(s.reserve,Math.abs(flow)*0.04+pressure*0.01):0;
 if(buyback>0){burn+=buyback*10;events.push('buyback');}
 const reserve=Math.max(0,s.reserve+Math.max(0,flow)*0.12-buyback-pressure/depth);
 if(reserve===0)events.push('depleted');
 return {epoch:s.epoch+1,reserve,burned:s.burned+burn,branches,flow,policy,history:[...s.history,reserve].slice(-20),events};
}
