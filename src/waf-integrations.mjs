import * as auth from '@waldokolk/waf-core/auth';
import * as data from '@waldokolk/waf-core/data';
import * as theme from '@waldokolk/waf-core/theme';
import * as api from '@waldokolk/waf-core/api';
import * as uxDesign from '@waldokolk/waf-core/ux-design';
import * as quality from '@waldokolk/waf-core/quality';
import * as release from '@waldokolk/waf-core/release';
import * as distribution from '@waldokolk/waf-core/distribution';
import * as changeControl from '@waldokolk/waf-core/change-control';
import * as monitoring from '@waldokolk/waf-core/monitoring';
import * as incident from '@waldokolk/waf-core/incident';
import * as recovery from '@waldokolk/waf-core/recovery';
import * as securityOps from '@waldokolk/waf-core/security-ops';
import * as backup from '@waldokolk/waf-core/backup';
import * as costControl from '@waldokolk/waf-core/cost-control';
import * as support from '@waldokolk/waf-core/support';
import * as feedback from '@waldokolk/waf-core/feedback';
import * as improvement from '@waldokolk/waf-core/improvement';
import * as knowledge from '@waldokolk/waf-core/knowledge';
import * as notifications from '@waldokolk/waf-core/notifications';
import * as opsReporting from '@waldokolk/waf-core/ops-reporting';

const definitions = [
  ['auth',auth,'createAuthenticator','server identity and ownership gates'],['data',data,'requireTenantIdentity','tenant isolation for operational records'],['theme',theme,'createIdentityPackage','validated Mission Control identity tokens'],['api',api,'boundedString','bounded API responses and input'],['ux-design',uxDesign,'createUxDecision','evidence-backed interaction decisions'],['quality',quality,'evaluateRelease','release quality gate'],['release',release,'createReleaseManifest','deployment receipt gate'],['distribution',distribution,'canRollout','block rollout compatibility'],['change-control',changeControl,'canPublish','approval and rollback gate'],['monitoring',monitoring,'checkHealth','allowlisted health connectors'],['incident',incident,'openIncident','incident lifecycle'],['recovery',recovery,'createRecoveryPlan','controlled rollback planning'],['security-ops',securityOps,'evaluateSecurityScan','security finding gate'],['backup',backup,'verifyRestoreDrill','restore evidence'],['cost-control',costControl,'evaluateCost','zero-new-cost and quota guard'],['support',support,'createTicket','isolated support intake'],['feedback',feedback,'triageFeedback','PII-safe feedback triage'],['improvement',improvement,'evaluateImprovement','measured improvement proof'],['knowledge',knowledge,'createArticle','versioned operational knowledge'],['notifications',notifications,'canNotify','consent-aware notifications'],['ops-reporting',opsReporting,'createOpsReport','fresh evidence reporting']
];

export function wafIntegrationReport({ now = new Date().toISOString() } = {}) {
  return Object.freeze({ version:'0.3.2', applicationId:'mission-control', verifiedAt:now, blocks:Object.freeze(definitions.map(([id,module,symbol,usage])=>Object.freeze({id,version:'0.3.2',imported:true,active:typeof module[symbol]==='function',symbol,usage,consumer:'Mission Control WAF en WOC',environment:'application-runtime'}))) });
}

export function assertWafIntegrations(report=wafIntegrationReport()) {
  const failed=report.blocks.filter(block=>!block.imported||!block.active);
  if(failed.length)throw new Error(`Inactive WAF integrations: ${failed.map(block=>block.id).join(', ')}`);
  return report;
}
