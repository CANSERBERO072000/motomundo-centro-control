"use client";
import { useState } from "react";
import { useOps } from "./Store"; import { Badge, Card, Bar } from "./Ui"; import { COLOR, Anden } from "@/lib/data";
const GRUPOS: Record<string, { l: string; e: string[]; c: string }> = {
  LIBRES: { l: "Libres", e: ["LIBRE"], c: "#10B981" }, CARGANDO: { l: "Cargando", e: ["CARGANDO"], c: "#F59E0B" },
  PROCESO: { l: "En proceso", e: ["LISTO", "DOC"], c: "#3B82F6" }, ESPERA: { l: "En espera", e: ["ESPERA"], c: "#94A3B8" }, RETRASADOS: { l: "Retrasados", e: ["RETRASO", "DEMORA"], c: "#EF4444" } };
function Camion({ a }: { a: Anden }) {
  const col = a.estado === "LIBRE" ? "#e2e8f0" : COLOR[a.estado] ?? "#94A3B8";
  return (<div className="mx-auto w-7 h-14 rounded-md relative" style={{ background: col }}><div className="absolute top-1 inset-x-1 h-3 bg-slate-800/70 rounded-sm"/><div className="absolute bottom-0 inset-x-0 h-2 bg-slate-900/40"/></div>);
}
export function VistaAerea({ onPick }: { onPick: (a: Anden) => void }) {
  const { andenes } = useOps();
  return (
    <div className="rounded-lg overflow-hidden border border-slate-800 bg-gradient-to-b from-slate-700 to-slate-800">
      <div className="h-10 bg-slate-600 border-b border-slate-500 text-center text-[10px] leading-10 tracking-widest text-slate-300">CENTRO DE DISTRIBUCIÓN AMARATECA</div>
      <div className="grid grid-cols-8 gap-1 p-2 pt-3">
        {andenes.map(a => (
          <button key={a.id} onClick={() => onPick(a)} className="text-center hover:bg-white/10 rounded p-1 border-x border-dashed border-yellow-500/40">
            <div className="text-xs font-bold">{a.id}</div><Badge e={a.estado}/>
            <div className="mt-2"><Camion a={a}/></div>
          </button>))}
      </div>
      <div className="h-8"/>
    </div>);
}
export default function Patio() {
  const { andenes, notifs } = useOps(); const [g, setG] = useState<string | null>(null); const [pop, setPop] = useState<Anden | null>(null);
  const cnt = (k: string) => andenes.filter(a => GRUPOS[k].e.includes(a.estado)).length;
  const rows = g ? andenes.filter(a => GRUPOS[g].e.includes(a.estado)) : andenes;
  const ocupados = andenes.filter(a => a.estado !== "LIBRE").length;
  return (
    <div className="space-y-3">
      <div className="grid lg:grid-cols-[1fr_220px] gap-3">
        <Card t="VISTA DE PATIO / ANDENES - DISTRIBUCIÓN EN TIEMPO REAL"><VistaAerea onPick={setPop}/></Card>
        <Card t="RESUMEN ACTUAL">
          <button onClick={() => setG(null)} className={`w-full text-left text-sm py-1 ${!g ? "font-bold" : ""}`}>{andenes.length} ANDENES TOTALES</button>
          {Object.keys(GRUPOS).map(k => (
            <button key={k} onClick={() => setG(g === k ? null : k)} className={`w-full flex items-center gap-2 text-sm py-1.5 rounded px-1 ${g === k ? "bg-slate-800" : ""}`}>
              <span className="w-3 h-3 rounded-full" style={{ background: GRUPOS[k].c }}/><b>{cnt(k)}</b> {GRUPOS[k].l.toUpperCase()}</button>))}
        </Card>
      </div>
      <Card t={`DETALLE DE ANDENES${g ? " · " + GRUPOS[g].l : ""}`}>
        <table className="w-full text-sm"><thead className="text-xs text-slate-400"><tr>{["ANDÉN","PLACA","N° CARGA","DESTINO","ESTADO","TIEMPO EN ANDÉN / PROGRESO"].map(h => <th key={h} className="text-left p-1">{h}</th>)}</tr></thead>
          <tbody>{rows.map(a => (<tr key={a.id} className="border-t border-slate-800"><td className="p-1 font-bold">{a.id}</td><td>{a.placa ?? "------"}</td><td>{a.carga ?? "-------"}</td><td>{a.destino ?? "LIBRE"}</td><td><Badge e={a.estado}/></td>
            <td className="w-56">{a.estado === "LIBRE" ? <span className="text-emerald-400">● Disponible</span> : <div><span className="text-xs">~{a.prog}% trans.</span><Bar v={a.prog} c={COLOR[a.estado]}/></div>}</td></tr>))}</tbody></table>
      </Card>
      <div className="grid lg:grid-cols-[2fr_1fr] gap-3">
        <Card t="DETALLE OPERATIVO"><div className="flex gap-6 text-sm flex-wrap"><span><b className="text-lg">{ocupados}/8</b> Andenes ocupados</span><span><b className="text-lg">105</b> Cargas en proceso</span><span><b className="text-lg">92</b> Motos</span><span><b className="text-lg">18</b> Accesorios</span><span><b className="text-lg">10</b> Repuestos</span></div></Card>
        <Card t="ÚLTIMAS NOTIFICACIONES">{notifs.slice(0, 3).map(n => <div key={n.id} className="text-xs text-emerald-400 border border-emerald-600 rounded p-1 mb-1 flex justify-between"><span>{n.texto}</span><span className="text-slate-400">{n.hora}</span></div>)}</Card>
      </div>
      {pop && (<div className="fixed inset-0 bg-black/60 grid place-items-center z-40" onClick={() => setPop(null)}><div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-72" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between mb-2"><b>ANDÉN {pop.id}</b><Badge e={pop.estado}/></div>
        <p className="text-sm">Placa: {pop.placa ?? "—"}<br/>Carga: {pop.carga ?? "—"}<br/>Destino: {pop.destino ?? "—"}<br/>Entrada: {pop.entrada ?? "—"}</p>
        <button className="mt-3 w-full bg-slate-800 rounded py-1" onClick={() => setPop(null)}>Cerrar</button></div></div>)}
    </div>);
}
