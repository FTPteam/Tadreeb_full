import assert from 'node:assert/strict';
import { findTrainingConflict, trainingConflictMessage } from '../src/services/activeTrainingGuard.js';
const S='20239999';
const base={studentId:S,currentRequestId:'REQ-1', requests:[], trainees:[]};
const cases=[
 ['new student can be approved', {...base,student:{status:'لم يبدأ',requestStatus:'pending'}}, false],
 ['academic approval of same request is not a conflict', {...base,student:{status:'لم يبدأ',requestStatus:'approved',activeRequestId:'REQ-1'}}, false],
 ['different already-approved request blocks', {...base,student:{status:'لم يبدأ',requestStatus:'approved',activeRequestId:'REQ-2'}}, true],
 ['already training blocks', {...base,student:{status:'قيد التدريب',requestStatus:'approved',activeRequestId:'REQ-2'}}, true],
 ['other accepted application blocks', {...base,requests:[{id:'REQ-2',studentId:S,status:'accepted'}]}, true],
 ['own approved request is excluded', {...base,requests:[{id:'REQ-1',studentId:S,status:'approved'}]}, false],
 ['other active trainee blocks', {...base,trainees:[{id:'T-2',studentId:S,applicationId:'REQ-2',status:'active'}]}, true],
 ['own trainee does not block same request', {...base,trainees:[{id:'T-1',studentId:S,applicationId:'REQ-1',status:'not_started'}]}, false],
 ['completed trainee permits further approval', {...base,trainees:[{id:'T-2',studentId:S,applicationId:'REQ-2',status:'completed'}]}, false],
 ['another student ignored', {...base,requests:[{id:'REQ-2',studentId:'DIFFERENT',status:'approved'}]}, false],
];
for (const [name,data,blocked] of cases){const conflict=findTrainingConflict(data);assert.equal(Boolean(conflict),blocked,name);if(blocked)assert.match(trainingConflictMessage(conflict,'اختبار'), /تدريب/);console.log('PASS',name)}
