'use client';
import {createContext,useContext,useReducer,useState,useEffect,type ReactNode,type Dispatch} from 'react';
import {useRouter,useSearchParams} from 'next/navigation';
import {parseNavigation,hasAccess} from '../_lib/model';
import {APPLICATIONS,MENTORS} from '../_lib/fixtures';
import {appReducer,initialState} from '../_lib/reducer';
import type {AppState,AppAction,PersonaId,ViewId,DialogState} from '../_lib/types';
import {useUploads} from '../_hooks/useUploads';
type Context={uploads:ReturnType<typeof useUploads>;persona:PersonaId;view:ViewId;state:AppState;dispatch:Dispatch<AppAction>;navigate:(view:ViewId,item?:string)=>void;setPersona:(persona:PersonaId)=>void;dialog:DialogState;openDialog:(dialog:DialogState)=>void;closeDialog:()=>void;feedback:string;notify:(message:string)=>void;signedOut:boolean;setSignedOut:(value:boolean)=>void;resetVersion:number;reset:()=>void};
const AppContext=createContext<Context|null>(null);
export function AppProvider({children}:{children:ReactNode}){
  const router=useRouter(),params=useSearchParams(),{view,persona}=parseNavigation(params);
  const [state,dispatch]=useReducer(appReducer,undefined,initialState);
  const uploads=useUploads(persona);
  const [manualDialog,setDialog]=useState<DialogState>(null),[dismissedItem,setDismissedItem]=useState(''),[feedback,notify]=useState(''),[signedOut,setSignedOut]=useState(false),[resetVersion,setResetVersion]=useState(0);
  const item=params.get('item'),selectionKey=`${persona}-${view}-${item||''}`;
  let selectionDialog:DialogState=null;
  if(item&&dismissedItem!==selectionKey&&hasAccess(persona,view)){
    if(view==='zenna'&&APPLICATIONS.some(a=>a.id===item))selectionDialog={kind:'application',id:item};
    if(view==='connect'&&MENTORS.some(m=>m.id===item))selectionDialog={kind:'booking',id:item};
  }
  const dialog=manualDialog||selectionDialog;
  const closeDialog=()=>{setDialog(null);setDismissedItem(selectionKey);};
  const openDialog=(value:DialogState)=>{setDismissedItem(selectionKey);setDialog(value);};
  // Query navigation is an external state change: transient overlays must close.
  useEffect(()=>{ /* eslint-disable react-hooks/set-state-in-effect */ setDialog(null);notify(''); /* eslint-enable react-hooks/set-state-in-effect */ },[persona,view]);
  const navigate=(next:ViewId,item?:string)=>{closeDialog();router.push(`/figma/dashboard?view=${next}&persona=${persona}${item?`&item=${encodeURIComponent(item)}`:''}`,{scroll:true});};
  const setPersona=(next:PersonaId)=>{closeDialog();router.push(`/figma/dashboard?view=${view}&persona=${next}`,{scroll:false});};
  const reset=()=>{dispatch({type:'reset'});uploads.reset();setResetVersion(v=>v+1);closeDialog();setSignedOut(true);};
  return <AppContext.Provider value={{uploads,persona,view,state,dispatch,navigate,setPersona,dialog,openDialog,closeDialog,feedback,notify,signedOut,setSignedOut,resetVersion,reset}}>{children}</AppContext.Provider>;
}
export function useApp(){const ctx=useContext(AppContext);if(!ctx)throw new Error('App provider missing');return ctx;}
