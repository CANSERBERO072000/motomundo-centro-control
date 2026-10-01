"use client";
import { useState } from "react";
import { Home, ClipboardList, Truck, Clock, FileText, BarChart3, Settings, ChevronLeft, ChevronRight } from "lucide-react";
export const MENU = [
  { n:"Panel Principal", i:Home, v:0 }, { n:"Programación", i:ClipboardList, v:0 }, { n:"Patio / Andenes", i:Truck, v:1 },
  { n:"Demoras", i:Clock, v:2 }, { n:"Despachos", i:FileText, v:3 }, { n:"Métricas y Reportes", i:BarChart3, v:4 }, { n:"Administración", i:Settings, v:5 },
];
export default function Sidebar({ view, onView }: { view: number; onView: (v: number) => void }) {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`${open ? "w-56" : "w-16"} shrink-0 bg-slate-900 border-r border-slate-800 transition-all flex flex-col`}>
      <div className="h-14 flex items-center justify-between px-3 border-b border-slate-800">
        {open && <b className="italic"><span>MOTO</span><span className="text-red-500">MUNDO</span></b>}
        <button onClick={() => setOpen(!open)} aria-label="Colapsar menú">{open ? <ChevronLeft size={18}/> : <ChevronRight size={18}/>}</button>
      </div>
      <nav className="p-2 space-y-1">
        {MENU.map((m) => { const act = view === m.v && m.n !== "Panel Principal";
          return (
            <button key={m.n} onClick={() => onView(m.v)} title={m.n}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-left border-l-4 ${act ? "bg-blue-600/20 text-white border-blue-500 shadow-[0_0_12px_#3B82F6]" : "border-transparent text-slate-400 hover:bg-slate-800"}`}>
              <m.i size={18}/>{open && m.n}
            </button>); })}
      </nav>
    </aside>
  );
}
