const fs=require('fs');const vm=require('vm');const path=require('path');const assert=require('node:assert/strict');
function load(rel, injected, names){
 const source=fs.readFileSync(path.join(__dirname,rel),'utf8').replace(/^import .*;\s*$/gm,'').replace(/\bexport\s+(?=(?:const|function|class))/g,'');
 const code=source+`\n;globalThis.__out={${names.join(',')}};`;
 const ctx={...injected,console,Date,Math,Set,Number,String,Array,JSON,window:undefined};vm.createContext(ctx);vm.runInContext(code,ctx,{filename:rel});return ctx.__out;
}
const current=()=>new Date().toLocaleDateString('en-CA');
const people=[{id:'t1',name:'طالب تجريبي',status:'active',opportunity:'تدريب الويب',attendanceRecords:[]}];
let saveArgs=null;
const m=load('src/pages/training-provider/attendanceLogsStore.js',{
 getAllDailyTrainingLogs:()=>[],getTrainees:()=>people,getTrainee:()=>people[0],
 setAttendance:(id,record)=>{saveArgs={id,record};people[0].attendanceRecords=[record];return {ok:true}},
 reviewLog:()=>({ok:true}),subscribeTrainees:()=>()=>{},
},['getLocalTrainingDate','getAttendanceRows','saveAttendanceRow']);
const date=m.getLocalTrainingDate();
let rows=m.getAttendanceRows(date);assert.equal(rows.length,1);assert.equal(rows[0].status,'unrecorded');assert.equal(rows[0].rate,null);
const good=m.saveAttendanceRow('t1',{status:'present',inTime:'08:00',outTime:'14:00'},date);assert.equal(good.ok,true);assert.equal(saveArgs.record.hours,6);
rows=m.getAttendanceRows(date);assert.equal(rows[0].status,'present');assert.equal(rows[0].rate,100);
assert.equal(m.saveAttendanceRow('t1',{status:'present',inTime:'14:00',outTime:'08:00'},date).ok,false);
assert.equal(m.saveAttendanceRow('t1',{status:'present',inTime:'08:00',outTime:'09:00'},'2999-01-01').ok,false);
assert.equal(m.saveAttendanceRow('t1',{status:'absent',inTime:'',outTime:''},date).ok,true);assert.equal(saveArgs.record.hours,0);
const shared=load('src/services/sharedAttendance.js',{getAllTrainees:()=>people},['getSharedAttendance']);
const attended=shared.getSharedAttendance('student99');assert.equal(attended.records.length,0);
console.log('PASS: unrecorded state, 6 hours, attendance percentage, invalid times, future dates, absence zero, student nonmatch');
