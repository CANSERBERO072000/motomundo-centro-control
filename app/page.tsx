"use client";
import { useEffect, useState } from "react";
import { OpsProvider, useOps } from "@/components/Store";
import Sidebar from "@/components/Sidebar"; import Despachos from "@/components/Despachos"; import Patio from "@/components/Patio";
import { Demoras, Metricas } from "@/components/Views"; import Programacion from "@/components/Programacion";
const Admin = () => <div className="p-6 text-slate-400">Administración (pendiente)</div>;
const TABS = [["PROGRAMACIÓN", "(Cargar/Editar Excel)", Programacion], ["PATIO / ANDENES", "(Asignación Drag & Drop)", Patio], ["DEMORAS", "(Registro de Causa)", Demoras], ["DESPACHOS", "(Liberar Guías/Factura)", Despachos], ["MÉTRICAS Y REPORTES", "(KPIs y Tiempos de Carga)", Metricas]] as const;
function App() {
  const [t, setT] = useState(3); const [now, setNow] = useState(new Date()); const { toast, andenes, demoras, despachos } = useOps();
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(i); }, []);
  const V = t === 5 ? Admin : TABS[t][2];
  const cnt = ["14", `${andenes.filter(a => a.estado !== "LIBRE").length}/8`, String(demoras.filter(d => !d.resuelta).length), String(despachos.length), ""];
  return (
    <div className="flex min-h-screen"><Sidebar view={t} onView={setT}/>
      <main className="flex-1 p-3 space-y-3 min-w-0">
        <header className="flex items-center gap-4 border-b border-slate-800 pb-2"><h1 className="font-bold text-lg">CENTRO DE CONTROL - AMARATECA</h1>
          <div className="ml-auto flex gap-3 items-center text-sm">{now.toLocaleDateString("es-HN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()} | {now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}<span className="text-emerald-400 animate-pulse">● (EN VIVO)</span></div></header>
        <nav className="grid grid-cols-5 gap-2">{TABS.map(([n, s], i) => <button key={n} onClick={() => setT(i)} className={`rounded-lg border p-2 text-left ${t === i ? (i === 2 ? "bg-red-600 border-red-500" : "bg-blue-600 border-blue-500") : "bg-slate-900 border-slate-800"}`}><div className="font-bold text-sm">{n} {cnt[i] && `(${cnt[i]})`}</div><div className="text-xs text-slate-300">{s}</div></button>)}</nav>
        <V/>{toast && <div className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-lg shadow-lg z-50">{toast}</div>}
      </main></div>); }
export default function Page() { return <OpsProvider><App/></OpsProvider>; }
