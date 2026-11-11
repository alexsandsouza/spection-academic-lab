'use client';
import React,{useMemo,useState} from 'react';
import Link from 'next/link';
import {CalendarCheck,BookOpenCheck,GraduationCap,ShieldAlert,Save,Database,CheckCircle2} from 'lucide-react';
import {useAcademicLab} from '../../lib/context/AcademicLabContext';
import {useAcademicProgress} from '../../lib/context/AcademicProgressContext';
import {GradeWeights,ProgressError,attendanceRate} from '../../lib/domain/progress';

const COPY={
 en:{title:'Academic Intelligence',subtitle:'Synthetic attendance, weighted grades and academic transcript',date:'Session date',titleField:'Session title',course:'Course',term:'Term',create:'Create session',select:'Select session',attendance:'Attendance register',present:'Present',absent:'Absent',notMarked:'Not marked',weight:'Grade category weights (%)',save:'Apply weights',grades:'Synthetic academic transcript',student:'Student',attendanceValue:'Attendance',grade:'Weighted grade',status:'Status',pending:'Not yet graded',none:'No sessions',empty:'Load demonstration data or create enrollments first.',notice:'Demonstration environment - fictional records, not official grades.',success:'Saved successfully.',error:'Check the required data and rules.',demo:'Load demo data',sessions:'Sessions',students:'Enrollments',help:'Grades are calculated only when every weighted category has graded activities. Attendance is based on eligible sessions; unmarked records count as not present.',privacy:'Academic progress follows your selected memory/local storage preference. Do not enter real student information.'},
 pt:{title:'Inteligência Acadêmica',subtitle:'Frequência, notas ponderadas e boletim acadêmico fictício',date:'Data da aula',titleField:'Título da aula',course:'Disciplina',term:'Período',create:'Cadastrar aula',select:'Selecionar aula',attendance:'Controle de frequência',present:'Presente',absent:'Ausente',notMarked:'Não registrado',weight:'Pesos das avaliações (%)',save:'Aplicar pesos',grades:'Boletim acadêmico fictício',student:'Estudante',attendanceValue:'Frequência',grade:'Nota ponderada',status:'Situação',pending:'Ainda não avaliado',none:'Sem aulas',empty:'Carregue os dados de demonstração ou cadastre matrículas.',notice:'Ambiente demonstrativo - registros fictícios, sem validade acadêmica oficial.',success:'Informações atualizadas.',error:'Verifique os dados e as regras de negócio.',demo:'Carregar dados de demonstração',sessions:'Aulas',students:'Matrículas',help:'A média só é calculada quando todas as categorias com peso possuem avaliações corrigidas. A frequência considera as aulas elegíveis; registros não marcados não contam como presença.',privacy:'Os dados seguem sua preferência de armazenamento em memória ou local. Não informe dados reais.'}
};
export default function ProgressPage(){
 const {courses,enrollments,loadDemoData,locale,storageMode}=useAcademicLab();
 const {sessions,records,weights,addAttendanceSession,recordAttendance,changeWeights,report}=useAcademicProgress();
 const t=COPY[locale]||COPY.en;
 const [courseId,setCourseId]=useState('');
 const [term,setTerm]=useState('2026.1');
 const [date,setDate]=useState('2026-11-10');
 const [title,setTitle]=useState('');
 const [sessionId,setSessionId]=useState('');
 const [draftWeights,setDraftWeights]=useState<GradeWeights>(weights);
 const [notice,setNotice]=useState('');
 const [error,setError]=useState(false);
 const activeCourse=courseId||courses[0]?.id||'';
 const visibleSessions=useMemo(()=>sessions.filter(x=>x.courseId===activeCourse&&x.term===term),[sessions,activeCourse,term]);
 const activeSession=sessionId&&visibleSessions.some(s=>s.id===sessionId)?sessionId:visibleSessions[0]?.id||'';
 const eligible=enrollments.filter(e=>e.courseId===activeCourse&&e.term===term&&e.status!=='DROPPED');
 function submitSession(e:React.FormEvent){e.preventDefault();try{addAttendanceSession({id:'session-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),courseId:activeCourse,term,date,title});setTitle('');setError(false);setNotice(t.success)}catch(err){setError(true);setNotice(err instanceof ProgressError?err.code:t.error)}}
 function mark(enrollmentId:string,present:boolean){try{recordAttendance(activeSession,enrollmentId,present);setError(false);setNotice(t.success)}catch(err){setError(true);setNotice(err instanceof ProgressError?err.code:t.error)}}
 function saveWeights(){try{changeWeights(draftWeights);setNotice(t.success);setError(false)}catch(err){setError(true);setNotice(err instanceof ProgressError?err.code:t.error)}}
 const meanRate=report.map(x=>x.attendance).filter((x):x is number=>x!==null);
 const meanGrade=report.map(x=>x.grade).filter((x):x is number=>x!==null);
 return <div className="progress-page">
  <div className="alert alert-warning" role="note"><ShieldAlert size={18} aria-hidden="true"/> {t.notice}</div>
  <section className="progress-hero">
   <div><span className="progress-eyebrow">SPECTION / FEAT-005 / v0.6</span><h2>{t.title}</h2><p>{t.subtitle}</p><small>{t.privacy} ({storageMode})</small></div>
   <button type="button" className="btn btn-primary" onClick={()=>{loadDemoData();setNotice(t.success);setError(false)}}><Database size={17}/> {t.demo}</button>
  </section>
  {notice&&<div role={error?'alert':'status'} className={'alert '+(error?'alert-error':'alert-success')}><CheckCircle2 size={18}/> {notice} <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setNotice('')}>×</button></div>}
  <div className="progress-stats">
   <article className="card"><span>{t.sessions}</span><strong>{sessions.length}</strong><CalendarCheck size={24}/></article>
   <article className="card"><span>{t.students}</span><strong>{enrollments.length}</strong><GraduationCap size={24}/></article>
   <article className="card"><span>{t.attendanceValue}</span><strong>{meanRate.length?(meanRate.reduce((a,b)=>a+b,0)/meanRate.length).toFixed(1)+'%':'-'}</strong><CalendarCheck size={24}/></article>
   <article className="card"><span>{t.grade}</span><strong>{meanGrade.length?(meanGrade.reduce((a,b)=>a+b,0)/meanGrade.length).toFixed(1):'-'}</strong><BookOpenCheck size={24}/></article>
  </div>
  <div className="progress-columns">
   <section className="card">
    <h3>{t.create}</h3>
    <form onSubmit={submitSession} className="progress-form">
     <label>{t.course}<select className="form-select" value={activeCourse} onChange={e=>{setCourseId(e.target.value);setSessionId('')}}>{courses.map(c=><option key={c.id} value={c.id}>{c.code} - {c.title}</option>)}</select></label>
     <label>{t.term}<select className="form-select" value={term} onChange={e=>{setTerm(e.target.value);setSessionId('')}}><option>2026.1</option><option>2026.2</option><option>2027.1</option></select></label>
     <label>{t.date}<input required type="date" className="form-input" value={date} onChange={e=>setDate(e.target.value)}/></label>
     <label>{t.titleField}<input required maxLength={100} className="form-input" value={title} onChange={e=>setTitle(e.target.value)}/></label>
     <button type="submit" className="btn btn-primary" disabled={!activeCourse}><Save size={16}/> {t.create}</button>
    </form>
   </section>
   <section className="card">
    <h3>{t.attendance}</h3>
    <label>{t.select}<select className="form-select" value={activeSession} onChange={e=>setSessionId(e.target.value)}>{visibleSessions.length===0?<option value="">{t.none}</option>:visibleSessions.map(s=><option value={s.id} key={s.id}>{s.date} - {s.title}</option>)}</select></label>
    {!activeSession||!eligible.length?<p className="progress-muted">{t.empty}</p>:<div className="table-responsive"><table className="data-table"><thead><tr><th>{t.student}</th><th>{t.attendanceValue}</th></tr></thead><tbody>{eligible.map(e=>{const rec=records.find(x=>x.sessionId===activeSession&&x.enrollmentId===e.id);return <tr key={e.id}><td>{e.studentCode} - {e.studentName}</td><td><select aria-label={e.code} className="form-select" value={rec?rec.present?'yes':'no':'unset'} onChange={ev=>{if(ev.target.value!=='unset')mark(e.id,ev.target.value==='yes')}}><option value="unset">{t.notMarked}</option><option value="yes">{t.present}</option><option value="no">{t.absent}</option></select></td></tr>})}</tbody></table></div>}
   </section>
  </div>
  <section className="card">
   <h3>{t.weight}</h3>
   <div className="progress-weights">{(Object.keys(draftWeights) as (keyof GradeWeights)[]).map(k=><label key={k}>{k}<input className="form-input" type="number" min="0" max="100" step="1" value={draftWeights[k]} onChange={e=>setDraftWeights(prev=>({...prev,[k]:Number(e.target.value)}))}/></label>)}<button type="button" className="btn btn-secondary" onClick={saveWeights}>{t.save}</button></div>
   <p className="progress-muted">{t.help}</p>
  </section>
  <section className="card">
   <div className="card-header"><div><h3>{t.grades}</h3><p>{t.notice}</p></div><Link className="btn btn-secondary btn-sm" href="/activities">{locale==='pt'?'Ver avaliações':'View activities'}</Link></div>
   {!report.length?<p className="progress-muted">{t.empty}</p>:<div className="table-responsive"><table className="data-table"><thead><tr><th>{t.student}</th><th>{t.course}</th><th>{t.term}</th><th>{t.attendanceValue}</th><th>{t.grade}</th><th>{t.status}</th></tr></thead><tbody>{report.map(row=><tr key={row.id}><td>{row.student}</td><td>{row.course}</td><td>{row.term}</td><td>{row.attendance===null?t.none:row.attendance+'%'}</td><td>{row.grade===null?t.pending:row.grade.toFixed(1)}</td><td>{row.status}</td></tr>)}</tbody></table></div>}
  </section>
 </div>;
}
