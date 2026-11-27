import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const c=JSON.parse(readFileSync(new URL('../contracts/operations.json',import.meta.url)));
function validate(x){assert.equal(x.schemaVersion,1);assert.match(x.contractVersion,/^\d+\.\d+\.\d+$/);assert.deepEqual(x.requiredCore,['auth','data','theme','api','quality','release']);assert.deepEqual(x.modules.map(m=>m.id),["monitoring","incident","recovery","security-ops","backup","cost-control","support","feedback","notifications","ops-reporting","improvement","knowledge"]);for(const m of x.modules){assert.equal(m.enabled,false);assert.equal(m.status,'blocked');}}
test('all twelve versioned contracts remain disabled',()=>validate(c));
test('reject premature activation',()=>{const x=structuredClone(c);x.modules[0].enabled=true;assert.throws(()=>validate(x));});
test('reject missing core gate or module',()=>{const x=structuredClone(c);x.requiredCore.pop();assert.throws(()=>validate(x));const y=structuredClone(c);y.modules.pop();assert.throws(()=>validate(y));});
