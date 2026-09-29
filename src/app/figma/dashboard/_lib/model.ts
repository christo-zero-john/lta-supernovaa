import type { ChanceProfile, ChanceUniversity, ChanceResult, PersonaId, ViewId } from './types';
const views = ['dashboard','zenna','connect','cst','p004','documents','notifications','support'];
export function parseNavigation(params: URLSearchParams): {view: ViewId; persona: PersonaId} {
  const view = params.getAll('view').find(v=>views.includes(v)); const persona = params.getAll('persona').find(p=>['free','paid','p004'].includes(p));
  return { view: views.includes(view || '') ? view as ViewId : 'dashboard', persona: ['free','paid','p004'].includes(persona || '') ? persona as PersonaId : 'paid' };
}
export function hasAccess(persona: PersonaId, view: ViewId) { return view === 'p004' ? persona === 'p004' : ['zenna','connect'].includes(view) ? persona !== 'free' : true; }
export const DEGREES = ['B.Tech Mechanical Engineering','B.Tech Computer Science','B.Sc Nursing','B.Com'];
export const FIELDS = ['Logistics / Supply Chain','Mechanical / Production','Computer Science / Data','Healthcare / Nursing'];
export function validateProfile(p: ChanceProfile): string[] {
  const errors: string[] = [];
  if (!Number.isFinite(p.cgpa) || p.cgpa < 5 || p.cgpa > 10) errors.push('Enter a CGPA between 5 and 10.');
  if (!Number.isFinite(p.ielts) || p.ielts < 5 || p.ielts > 9) errors.push('Enter an IELTS score between 5 and 9.');
  if (!['none','A1','A2','B1','B2'].includes(p.german) || !DEGREES.includes(p.degree) || !FIELDS.includes(p.field)) errors.push('Choose a supported degree, field and German level.');
  return errors;
}
export function calculateChances(p: ChanceProfile, universities: readonly ChanceUniversity[]): ChanceResult[] {
  if (validateProfile(p).length) return [];
  const bonus: Record<string, number> = {none:0,A1:2,A2:4,B1:7,B2:10};
  const base = (p.cgpa-5)*9+(p.ielts-5)*8+bonus[p.german];
  return universities.map(u=>({...u,pct:Math.round(Math.min(92,Math.max(8,base/u.difficulty)))})).sort((a,b)=>b.pct-a.pct);
}
export function validateUpload(file: Pick<File,'name'|'type'|'size'>): string | null {
  if (!file.size) return 'This file is empty.';
  if (file.size > 10*1024*1024) return 'Files must be 10 MB or smaller.';
  if (!/\.(pdf|jpe?g|png)$/i.test(file.name) || !['application/pdf','image/jpeg','image/png'].includes(file.type)) return 'Choose a PDF, JPG or PNG file.';
  return null;
}
export function localDate(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function validateBooking(date: string, slot: string, now: Date): string | null {
  const parsed = new Date(`${date}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || localDate(parsed)!==date || date <= localDate(now)) return 'Choose a future date.';
  if (!['09:00','12:00','15:00','17:00'].includes(slot)) return 'Choose an available time.';
  return null;
}
