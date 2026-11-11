import {describe,it,expect} from 'vitest';
import {addSession,setAttendance,attendanceRate,weightedGrade,validateWeights,transcript,DEFAULT_GRADE_WEIGHTS} from '../../lib/domain/progress';
import type {Enrollment,AcademicActivity} from '../../lib/domain/academic';
const enr={id:'e1',code:'ENR-0001',studentId:'s',studentCode:'DEMO-0001',studentName:'Fictional Student',courseId:'c1',courseCode:'COURSE-01',courseTitle:'Test course',term:'2026.1',status:'ACTIVE'} as Enrollment;
const sess={id:'a1',courseId:'c1',term:'2026.1',date:'2026-04-10',title:'Lecture'};
const activities=(['EXAM','PROJECT','LAB','QUIZ'] as const).map((category,i)=>({id:'a'+i,enrollmentId:'e1',category,score:80,status:'GRADED'})) as AcademicActivity[];
describe('FEAT-005 academic intelligence',()=>{
 it('creates valid sessions and prevents duplication',()=>{
  expect(addSession([],[{id:'c1'}],[sess][0])).toHaveLength(1);
  expect(()=>addSession([sess],[{id:'c1'}],{...sess,id:'a2'})).toThrow('SESSION_DUPLICATE');
  expect(()=>addSession([],[{id:'c1'}],{...sess,courseId:'unknown'})).toThrow('COURSE_NOT_FOUND');
 });
 it('enforces attendance course/term membership',()=>{
  expect(()=>setAttendance([],[sess],[{...enr,term:'2026.2'}],'a1','e1',true)).toThrow('ENROLLMENT_SESSION_MISMATCH');
 });
 it('corrects attendance without inserting duplicates',()=>{
  const a=setAttendance([],[sess],[enr],'a1','e1',false);
  const b=setAttendance(a,[sess],[enr],'a1','e1',true);
  expect(b).toHaveLength(1);
  expect(b[0].present).toBe(true);
 });
 it('calculates missing/recorded attendance',()=>{
  expect(attendanceRate(enr,[],[])).toBeNull();
  expect(attendanceRate(enr,[sess],[])).toBe(0);
  expect(attendanceRate(enr,[sess],[{sessionId:'a1',enrollmentId:'e1',present:true}])).toBe(100);
 });
 it('validates weight totals and score rounding',()=>{
  expect(()=>validateWeights({...DEFAULT_GRADE_WEIGHTS,EXAM:39})).toThrow('WEIGHTS_INVALID');
  expect(weightedGrade('e1',activities,DEFAULT_GRADE_WEIGHTS)).toBe(80);
 });
 it('excludes ungraded and incomplete categories',()=>{
  expect(weightedGrade('e1',activities.filter(a=>a.category!=='QUIZ'),DEFAULT_GRADE_WEIGHTS)).toBeNull();
  expect(weightedGrade('e1',activities.map(a=>({...a,status:'PENDING'})),DEFAULT_GRADE_WEIGHTS)).toBeNull();
 });
 it('produces fictional transcript projection',()=>{
  const items=transcript([enr],activities,[sess],[{sessionId:'a1',enrollmentId:'e1',present:true}],DEFAULT_GRADE_WEIGHTS);
  expect(items[0]).toMatchObject({student:'Fictional Student',attendance:100,grade:80});
 });
});
