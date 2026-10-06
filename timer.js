import {get,put,uid} from './db.js';
const KEY='activeTimer';
export async function getActiveTimer(){return get('settings',KEY)}
export async function startTimer(subjectId,subjectName,activity,date){const old=await getActiveTimer();if(old&&old.status==='running') throw new Error('ACTIVE_TIMER'); const t={key:KEY,id:uid(),subjectId,subjectName,activity,date,status:'running',startedAt:Date.now(),lastResumedAt:Date.now(),accumulatedMs:0};await put('settings',t);return t}
export async function pauseTimer(){const t=await getActiveTimer();if(!t)return null;if(t.status==='running'){t.accumulatedMs+=(Date.now()-t.lastResumedAt);t.status='paused';t.pausedAt=Date.now();await put('settings',t)}return t}
export async function resumeTimer(){const t=await getActiveTimer();if(!t)return null;if(t.status==='paused'){t.status='running';t.lastResumedAt=Date.now();delete t.pausedAt;await put('settings',t)}return t}
export async function finishTimer(status='finished'){const t=await getActiveTimer();if(!t)return null; if(t.status==='running')t.accumulatedMs+=Date.now()-t.lastResumedAt;t.status=status;t.finishedAt=Date.now();t.endTime=new Date(t.finishedAt).toISOString();await put('sessions',{id:t.id,subjectId:t.subjectId,subjectName:t.subjectName,activity:t.activity,date:t.date,startTime:new Date(t.startedAt).toISOString(),endTime:t.endTime,durationMs:Math.max(0,t.accumulatedMs),status:'finished',source:'timer'});await import('./db.js').then(m=>m.remove('settings',KEY));return t}
export async function deleteActive(){return (await import('./db.js')).remove('settings',KEY)}
export function elapsed(t){if(!t)return 0;return t.accumulatedMs+(t.status==='running'?Date.now()-t.lastResumedAt:0)}
export function hms(ms){const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor(s%3600/60),sec=s%60;return [h,m,sec].map((x,i)=>String(x).padStart(i?2:2,'0')).join(':')}
export function hm(ms){const m=Math.floor(ms/60000),h=Math.floor(m/60),mm=m%60;return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`}
