import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveApplicationProgress, findOtherActivePlacement } from '../src/services/trainingLifecycle.js';

for (const [p,a,expected] of [
 ['pending','pending','pending'],['accepted','pending','pending'],['pending','approved','pending'],
 ['accepted','approved','accepted'],['rejected','approved','rejected'],['accepted','rejected','rejected'],
 ['rejected','rejected','rejected'],['unrecognized','approved','pending'],
]) {
 test(`application: ${p} + ${a} -> ${expected}`, () => {
  const result = deriveApplicationProgress(p,a);
  assert.equal(result.status,expected);
  assert.equal(result.canCreatePlacement,expected==='accepted');
 });
}
test('same application is not a second placement',()=>{
 const items=[{studentId:'10',applicationId:'A',status:'active'}];
 assert.equal(findOtherActivePlacement(items,'10','A'),null);
});
test('another active or not-started application blocks placement',()=>{
 for(const status of ['active','not_started']) {
  const items=[{studentId:'10',applicationId:'A',status}];
  assert.equal(findOtherActivePlacement(items,'10','B')?.applicationId,'A');
 }
});
test('completed or cancelled placement does not block new application',()=>{
 for(const status of ['completed','cancelled']) {
  const items=[{studentId:'10',applicationId:'A',status}];
  assert.equal(findOtherActivePlacement(items,'10','B'),null);
 }
});
test('different student is not a conflict',()=>{
 assert.equal(findOtherActivePlacement([{studentId:'20',applicationId:'A',status:'active'}],'10','B'),null);
});
