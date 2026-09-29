import {useEffect,useRef,type ReactNode} from 'react';
import {Icon} from './ui';
export default function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
  const ref=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLElement|null>(null);
  useEffect(()=>{trigger.current=document.activeElement as HTMLElement;const el=ref.current;el?.showModal();return()=>{el?.close();trigger.current?.focus();};},[]);
  return <dialog ref={ref} className="sn-modal" aria-label={title} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}><button className="sn-modal-close" aria-label="Close dialog" onClick={onClose}><Icon name="close" /></button><h2>{title}</h2>{children}</dialog>;
}
