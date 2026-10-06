const DB_NAME='study-os-db'; const DB_VERSION=1;
let dbPromise;
function openDB(){if(dbPromise)return dbPromise;dbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(DB_NAME,DB_VERSION);r.onupgradeneeded=()=>{const db=r.result; const stores={subjects:{keyPath:'id'},days:{keyPath:'date'},sessions:{keyPath:'id'},notes:{keyPath:'id'},settings:{keyPath:'key'},snapshots:{keyPath:'id'}}; for(const [n,o] of Object.entries(stores)){if(!db.objectStoreNames.contains(n)){const s=db.createObjectStore(n,o); if(n==='sessions'){s.createIndex('date','date');s.createIndex('subjectId','subjectId');} if(n==='notes'){s.createIndex('subjectId','subjectId');}}}};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return dbPromise}
export async function tx(store,mode='readonly'){return (await openDB()).transaction(store,mode).objectStore(store)}
export async function get(store,key){const s=await tx(store);return new Promise((res,rej)=>{const r=s.get(key);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
export async function getAll(store){const s=await tx(store);return new Promise((res,rej)=>{const r=s.getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
export async function put(store,value){const s=await tx(store,'readwrite');return new Promise((res,rej)=>{const r=s.put(value);r.onsuccess=()=>res(value);r.onerror=()=>rej(r.error)})}
export async function remove(store,key){const s=await tx(store,'readwrite');return new Promise((res,rej)=>{const r=s.delete(key);r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
export async function bulkPut(store,values){const db=await openDB();return new Promise((res,rej)=>{const t=db.transaction(store,'readwrite'),s=t.objectStore(store);values.forEach(v=>s.put(v));t.oncomplete=()=>res();t.onerror=()=>rej(t.error)})}
export async function clear(store){const s=await tx(store,'readwrite');return new Promise((res,rej)=>{const r=s.clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error)})}
export const uid=()=>crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`;
