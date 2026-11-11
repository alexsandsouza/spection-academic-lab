import type { AcademicActivity, Enrollment } from './academic';

export type AttendanceSession = { id:string; courseId:string; term:string; date:string; title:string };
export type AttendanceRecord = { sessionId:string; enrollmentId:string; present:boolean };
export type GradeWeights = { EXAM:number; PROJECT:number; LAB:number; QUIZ:number };
export const DEFAULT_GRADE_WEIGHTS: GradeWeights = { EXAM:40, PROJECT:30, LAB:20, QUIZ:10 };

export class ProgressError extends Error {
 constructor(public readonly code:string){super(code);this.name='ProgressError'}
}

export function validateWeights(weights:GradeWeights):GradeWeights {
 const values=Object.values(weights);
 if(values.some(v=>!Number.isInteger(v)||v<0||v>100)||values.reduce((a,b)=>a+b,0)!==100)
   throw new ProgressError('WEIGHTS_INVALID');
 return {...weights};
}

export function addSession(sessions:ReadonlyArray<AttendanceSession>,courses:ReadonlyArray<{id:string}>,input:AttendanceSession):AttendanceSession[] {
 if(!courses.some(c=>c.id===input.courseId))throw new ProgressError('COURSE_NOT_FOUND');
 if(!/^\d{4}\.([12])$/.test(input.term)||!/^\d{4}-\d{2}-\d{2}$/.test(input.date)||Number.isNaN(Date.parse(input.date+'T12:00:00Z'))||!input.title.trim()||input.title.length>100)
   throw new ProgressError('SESSION_INVALID');
 if(sessions.some(s=>s.id===input.id||s.courseId===input.courseId&&s.term===input.term&&s.date===input.date&&s.title.trim().toLowerCase()===input.title.trim().toLowerCase()))
   throw new ProgressError('SESSION_DUPLICATE');
 return [...sessions,{...input,title:input.title.trim()}];
}

export function setAttendance(records:ReadonlyArray<AttendanceRecord>,sessions:ReadonlyArray<AttendanceSession>,enrollments:ReadonlyArray<Enrollment>,sessionId:string,enrollmentId:string,present:boolean):AttendanceRecord[] {
 const s=sessions.find(x=>x.id===sessionId),e=enrollments.find(x=>x.id===enrollmentId);
 if(!s||!e||e.courseId!==s.courseId||e.term!==s.term||e.status==='DROPPED'||typeof present!=='boolean')
   throw new ProgressError('ENROLLMENT_SESSION_MISMATCH');
 return [...records.filter(r=>!(r.sessionId===sessionId&&r.enrollmentId===enrollmentId)),{sessionId,enrollmentId,present}];
}

export function attendanceRate(enrollment:Enrollment,sessions:ReadonlyArray<AttendanceSession>,records:ReadonlyArray<AttendanceRecord>):number|null {
 const eligible=sessions.filter(s=>s.courseId===enrollment.courseId&&s.term===enrollment.term);
 if(!eligible.length)return null;
 const count=eligible.filter(s=>records.some(r=>r.sessionId===s.id&&r.enrollmentId===enrollment.id&&r.present)).length;
 return Math.round(count/eligible.length*1000)/10;
}

export function weightedGrade(enrollmentId:string,activities:ReadonlyArray<AcademicActivity>,weights:GradeWeights):number|null {
 validateWeights(weights);
 const graded=activities.filter(a=>a.enrollmentId===enrollmentId&&a.status==='GRADED');
 if(!graded.length)return null;
 const categories=(Object.keys(weights) as (keyof GradeWeights)[]).filter(k=>weights[k]>0);
 if(!categories.every(k=>graded.some(a=>a.category===k)))return null;
 const score=categories.reduce((sum,k)=>{
  const values=graded.filter(a=>a.category===k).map(a=>a.score);
  return sum+(values.reduce((a,b)=>a+b,0)/values.length)*(weights[k]/100);
 },0);
 return Math.round(score*10)/10;
}

export function transcript(enrollments:ReadonlyArray<Enrollment>,activities:ReadonlyArray<AcademicActivity>,sessions:ReadonlyArray<AttendanceSession>,records:ReadonlyArray<AttendanceRecord>,weights:GradeWeights){
 return enrollments.map(e=>({id:e.id,code:e.code,student:e.studentName,course:e.courseTitle,term:e.term,attendance:attendanceRate(e,sessions,records),grade:weightedGrade(e.id,activities,weights),status:e.status}));
}
