import test from 'node:test';
import assert from 'node:assert/strict';
import { createGitHubActivityConnector } from '../src/connectors/github-activity.mjs';
import { createActivityService } from '../src/activity-service.mjs';

const commit = (repository, sha, message, date) => ({ sha, html_url:`https://github.com/${repository}/commit/${sha}`, commit:{ message, committer:{ date }, author:{ name:'Waldo' } } });
function response(body, status = 200) { return new Response(JSON.stringify(body), { status, headers:{ 'content-type':'application/json' } }); }

test('haalt echte commitvormen op en sorteert WAF en WOC op tijd', async () => {
  const repositories=['waldokolk-dotcom/waldo-application-factory','waldokolk-dotcom/waldo-operations-center'];
  const connector=createGitHubActivityConnector({repositories,token:'github_pat_read_only_example',now:()=>new Date('2026-11-27T19:00:00Z'),fetcher:async(url,options)=>{
    assert.equal(options.redirect,'error');assert.match(options.headers.authorization,/^Bearer /);
    const repository=url.pathname.includes('application-factory')?repositories[0]:repositories[1];
    return response([commit(repository,repository.endsWith('factory')?'a'.repeat(40):'b'.repeat(40),repository.endsWith('factory')?'WAF export':'WOC activity','2026-11-27T18:00:00Z')]);
  }});
  const result=await connector.load();assert.equal(result.state,'current');assert.equal(result.events.length,2);assert.equal(result.failures.length,0);assert.ok(result.events.every((event)=>event.eventType==='repository.commit'));
});

test('private 404 blijft expliciet authentication-required en lekt geen token', async () => {
  const connector=createGitHubActivityConnector({repositories:['waldokolk-dotcom/waldo-application-factory'],token:'github_pat_read_only_example',fetcher:async()=>response({message:'Not Found'},404)});
  const result=await connector.load();assert.equal(result.state,'unknown');assert.deepEqual(result.failures,[{repository:'waldokolk-dotcom/waldo-application-factory',ref:null,state:'authentication-required'}]);assert.doesNotMatch(JSON.stringify(result),/github_pat/);
});

test('volgt main en actieve ontwikkelbranch en dedupliceert dezelfde commit', async () => {
  const repository='waldokolk-dotcom/waldo-operations-center';const seen=[];const shared=commit(repository,'d'.repeat(40),'Shared commit','2026-11-27T18:00:00Z');
  const connector=createGitHubActivityConnector({repositories:[repository],refs:{[repository]:['main','feat/mission-control-m00-m01']},fetcher:async(url)=>{seen.push(url.searchParams.get('sha'));return response([shared])}});
  const result=await connector.load();assert.deepEqual(seen,['main','feat/mission-control-m00-m01']);assert.equal(result.events.length,1);assert.equal(result.state,'current');
});

test('activity service dedupliceert door caching en geeft alleen veilige dashboardvelden', async () => {
  let calls=0;const repository='waldokolk-dotcom/waldo-operations-center';const service=createActivityService({repositories:[repository],cacheMs:60_000,now:()=>new Date('2026-11-27T19:00:00Z'),fetcher:async()=>{calls++;return response([commit(repository,'c'.repeat(40),'<script>alert(1)</script>','2026-11-27T18:00:00Z')])}});
  const first=await service.snapshot();const second=await service.snapshot();assert.equal(calls,1);assert.equal(service.eventCount(),1);assert.equal(first,second);assert.equal(first.activities[0].summary,'<script>alert(1)</script>');assert.equal('sourceIdentity' in first.activities[0],false);
});
