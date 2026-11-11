'use client';
import React,{createContext,useContext,useEffect,useMemo,useRef,useState} from 'react';
import {useAcademicLab} from './AcademicLabContext';
import {STORAGE_KEYS,loadPrivacyConsent} from '../storage/storage';
import {AttendanceSession,AttendanceRecord,GradeWeights,DEFAULT_GRADE_WEIGHTS,addSession,setAttendance,validateWeights,transcript} from '../domain/progress';

type ProgressContextType={
 sessions:AttendanceSession[]; records:AttendanceRecord[]; weights:GradeWeights;
 addAttendanceSession:(input:AttendanceSession)=>void;
 recordAttendance:(sessionId:string,enrollmentId:string,present:boolean)=>void;
 changeWeights:(weights:GradeWeights)=>void;
 report:ReturnType<typeof transcript>;
 clearProgress:()=>void;
};
const Context=createContext<ProgressContextType|null>(null);
const empty=()=>({sessions:[] as AttendanceSession[],records:[] as AttendanceRecord[],weights:{...DEFAULT_GRADE_WEIGHTS}});
function readSnapshot(raw:string|null){
 if(!raw)return empty();
 const x=JSON.parse(raw) as Record<string,unknown>;
 if(!x||!Array.isArray(x.sessions)||!Array.isArray(x.records)||x.sessions.length>500||x.records.length>20000)throw Error('INVALID_PROGRESS');
 const sessions=x.sessions as AttendanceSession[],records=x.records as AttendanceRecord[];
 if(!sessions.every(s=>s&&typeof s.id==='string'&&s.id.length<100&&typeof s.courseId==='string'&&typeof s.term==='string'&&typeof s.date==='string'&&typeof s.title==='string'&&s.title.length<=100))throw Error('INVALID_SESSIONS');
 if(!records.every(a=>a&&typeof a.sessionId==='string'&&typeof a.enrollmentId==='string'&&typeof a.present==='boolean'))throw Error('INVALID_ATTENDANCE');
 if(new Set(sessions.map(s=>s.id)).size!==sessions.length||new Set(records.map(a=>a.sessionId+':'+a.enrollmentId)).size!==records.length)throw Error('DUPLICATE_PROGRESS');
 const weights=validateWeights(x.weights as GradeWeights);
 return {sessions,records,weights};
}
export function AcademicProgressProvider({children}:{children:React.ReactNode}){
 const {courses,enrollments,activities,consent}=useAcademicLab();
 const [data,setData]=useState(empty);
 const [ready,setReady]=useState(false);
 const priorConsent=useRef<boolean|null>(null);
 useEffect(()=>{
  const saved=loadPrivacyConsent();
  if(saved.allowLocalStorage){try{setData(readSnapshot(window.localStorage.getItem(STORAGE_KEYS.PROGRESS)))}catch{setData(empty())}}
  priorConsent.current=saved.allowLocalStorage;
  setReady(true);
 },[]);
 useEffect(()=>{
  if(!ready)return;
  if(priorConsent.current===true&&!consent.allowLocalStorage){setData(empty());try{localStorage.removeItem(STORAGE_KEYS.PROGRESS)}catch{}}
  priorConsent.current=consent.allowLocalStorage;
 },[consent.allowLocalStorage,ready]);
 useEffect(()=>{
  if(!ready||!consent.allowLocalStorage)return;
  try{localStorage.setItem(STORAGE_KEYS.PROGRESS,JSON.stringify(data))}catch{}
 },[data,ready,consent.allowLocalStorage]);
 useEffect(()=>{
  const clear=()=>setData(empty());
  window.addEventListener('spection-academic-clear',clear);
  return()=>window.removeEventListener('spection-academic-clear',clear);
 },[]);
 const addAttendanceSession=(input:AttendanceSession)=>setData(prev=>({...prev,sessions:addSession(prev.sessions,courses,input)}));
 const recordAttendance=(sessionId:string,enrollmentId:string,present:boolean)=>setData(prev=>({...prev,records:setAttendance(prev.records,prev.sessions,enrollments,sessionId,enrollmentId,present)}));
 const changeWeights=(weights:GradeWeights)=>setData(prev=>({...prev,weights:validateWeights(weights)}));
 const clearProgress=()=>setData(empty());
 const validEnrollments=useMemo(()=>enrollments.filter(e=>e.status!=='DROPPED'),[enrollments]);
 const report=useMemo(()=>transcript(validEnrollments,activities,data.sessions.filter(s=>courses.some(c=>c.id===s.courseId)),data.records,data.weights),[validEnrollments,activities,data,courses]);
 return <Context.Provider value={{...data,addAttendanceSession,recordAttendance,changeWeights,report,clearProgress}}>{children}</Context.Provider>;
}
export function useAcademicProgress(){
 const value=useContext(Context);
 if(!value)throw Error('AcademicProgressProvider is required');
 return value;
}
