"use client";
import { COLOR } from "@/lib/data";
export const Badge=({e}:{e:string})=><span className="px-2 py-0.5 rounded text-[11px] font-bold text-slate-950" style={{background:COLOR[e]??"#94A3B8"}}>{e}</span>;
export const Card=({t,children,cls=""}:{t?:string;children:React.ReactNode;cls?:string})=>
  <section className={`bg-slate-900 border border-slate-800 rounded-lg p-3 ${cls}`}>{t&&<h3 className="font-bold text-sm mb-2 tracking-wide">{t}</h3>}{children}</section>;
export const Bar=({v,c="#10B981"}:{v:number;c?:string})=><div className="h-1.5 bg-slate-800 rounded"><div className="h-full rounded" style={{width:`${v}%`,background:c}}/></div>;
