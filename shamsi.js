const PERSIAN=['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند']; const WEEK=['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
function div(a,b){return Math.floor(a/b)}
export function gregorianToJalali(gy,gm,gd){const gdm=[0,31,59,90,120,151,181,212,243,273,304,334];let gy2=gm>2?gy+1:gy;let days=355666+365*gy+div(gy2+3,4)-div(gy2+99,100)+div(gy2+399,400)+gd+gdm[gm-1];let jy=-1595+33*div(days,12053);days%=12053;jy+=4*div(days,1461);days%=1461;if(days>365){jy+=div(days-1,365);days=(days-1)%365}let jm=days<186?1+div(days,31):7+div(days-186,30);let jd=1+(days<186?days%31:(days-186)%30);return[jy,jm,jd]}
export function jalaliToGregorian(jy,jm,jd){const target=`${jy}-${jm}-${jd}`;let d=new Date(jy+621,2,19);for(let i=0;i<370;i++){const key=gregorianToJalali(d.getFullYear(),d.getMonth()+1,d.getDate());if(`${key[0]}-${key[1]}-${key[2]}`===target)return[d.getFullYear(),d.getMonth()+1,d.getDate()];d.setDate(d.getDate()+1)}throw new Error('Invalid Jalali date')}
export function todayKey(date=new Date()){const [y,m,d]=gregorianToJalali(date.getFullYear(),date.getMonth()+1,date.getDate());return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`}
export function parseJKey(key){return key.split('-').map(Number)}
export function formatJalali(key,withWeek=true){const [y,m,d]=parseJKey(key);const [gy,gm,gd]=jalaliToGregorian(y,m,d);const wd=new Date(gy,gm-1,gd).getDay();return `${withWeek?WEEK[wd]+' ':''}${d} ${PERSIAN[m-1]} ${y}`}
export function monthName(m){return PERSIAN[m-1]}
export function nowISO(){return new Date().toISOString()}
