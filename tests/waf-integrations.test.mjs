import test from 'node:test';
import assert from 'node:assert/strict';
import { assertWafIntegrations, wafIntegrationReport } from '../src/waf-integrations.mjs';

test('alle 21 geselecteerde WAF-blokken zijn uitvoerbaar in Mission Control',()=>{const report=assertWafIntegrations();assert.equal(report.blocks.length,21);assert.equal(report.blocks.every(block=>block.imported&&block.active&&block.usage),true);assert.equal(new Set(report.blocks.map(block=>block.id)).size,21)});
test('WAF-integratierapport identificeert Mission Control als afnemer',()=>{const report=wafIntegrationReport({now:'2026-11-27T20:00:00+01:00'});assert.equal(report.applicationId,'mission-control');assert.equal(report.verifiedAt,'2026-11-27T20:00:00+01:00');assert.equal(report.blocks.every(block=>block.consumer==='Mission Control WAF en WOC'),true)});
