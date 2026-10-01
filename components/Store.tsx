"use client";
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { ANDENES, DESPACHOS, DEMORAS, Anden, Despacho, Demora, Notif } from "@/lib/data";
type Ctx = { andenes:Anden[]; despachos:Despacho[]; demoras:Demora[]; notifs:Notif[]; toast:string; liberar:(id:string)=>Promise<void>; incidencia:(id:string)=>void; resolver:(n:number)=>void };
const C = createContext<Ctx>(null as unknown as Ctx);
export const useOps = () => useContext(C);
const hora = () => new Date().toLocaleTimeString("es-HN",{hour:"2-digit",minute:"2-digit",hour12:true});
export function OpsProvider({children}:{children:ReactNode}) {
  const [andenes,setA]=useState(ANDENES), [despachos,setD]=useState(DESPACHOS), [demoras,setM]=useState(DEMORAS);
  const [notifs,setN]=useState<Notif[]>([{id:1,texto:"¡ANDÉN A01 LIBERADO! (HAA-4567 Despachado)",hora:"10:28 AM"}]);
  const [toast,setT]=useState("");
  const load = useCallback(async()=>{ if(!supabase) return;
    const [a,d,m,n]=await Promise.all(["andenes","despachos","demoras","notificaciones"].map(t=>supabase!.from(t).select("*")));
    if(a.data?.length) setA((a.data as Anden[]).sort((x,y)=>x.id.localeCompare(y.id)));
    if(d.data?.length) setD((d.data as Despacho[]).sort((x,y)=>x.id.localeCompare(y.id)));
    if(m.data?.length) setM((m.data as Demora[]).sort((x,y)=>x.n-y.n));
    if(n.data?.length) setN((n.data as Notif[]).sort((x,y)=>y.id-x.id)); },[]);
  useEffect(()=>{ load(); if(!supabase) return;
    const ch=supabase.channel("schema-db-changes");
    ["andenes","cargas","demoras","despachos","notificaciones"].forEach(table=>
      (["INSERT","UPDATE"] as const).forEach(event=>ch.on("postgres_changes",{event,schema:"public",table},()=>{load();})));
    ch.subscribe(); return ()=>{ supabase!.removeChannel(ch); }; },[load]);
  const liberar = async(id:string)=>{ const d=despachos.find(x=>x.id===id); if(!d) return;
    const msg=`¡ANDÉN ${d.anden} LIBERADO! (${d.placa} Despachado)`;
    setD(p=>p.map(x=>x.id===id?{...x,estado:"DESPACHADO"}:x));
    setA(p=>p.map(x=>x.id===d.anden?{...x,estado:"LIBRE",placa:null,carga:null,destino:null,entrada:null,prog:0}:x));
    setN(p=>[{id:Date.now(),texto:msg,hora:hora()},...p]); setT(msg); setTimeout(()=>setT(""),3500);
    if(supabase){ await supabase.from("despachos").update({estado:"DESPACHADO"}).eq("id",id);
      await supabase.from("andenes").update({estado:"LIBRE",placa:null,carga:null,destino:null,entrada:null,prog:0}).eq("id",d.anden);
      await supabase.from("notificaciones").insert({texto:msg,hora:hora()}); } };
  const incidencia=(id:string)=>{ setD(p=>p.map(x=>x.id===id?{...x,estado:"CON INCIDENCIA"}:x)); supabase?.from("despachos").update({estado:"CON INCIDENCIA"}).eq("id",id).then(()=>{}); };
  const resolver=(n:number)=>{ setM(p=>p.map(x=>x.n===n?{...x,resuelta:true}:x)); supabase?.from("demoras").update({resuelta:true}).eq("n",n).then(()=>{}); };
  return <C.Provider value={{andenes,despachos,demoras,notifs,toast,liberar,incidencia,resolver}}>{children}</C.Provider>;
}
