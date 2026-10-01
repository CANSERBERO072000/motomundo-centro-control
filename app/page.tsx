"use client";

import React, { useState, useEffect } from "react";
import { OpsProvider, useOps } from "@/components/Store";
import { Programacion, Patio, Demoras, Despachos, Metricas } from "@/components/Views";

function MainApp() {
  const [activeTab, setActiveTab] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const { toast, andenes, demoras, despachos } = useOps();

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Contadores dinámicos sincronizados con la base de datos
  const andenesOcupados = andenes ? andenes.filter((a: any) => a.estado !== "LIBRE").length : 2;
  const demorasActivas = demoras ? demoras.filter((d: any) => !d.resuelta).length : 7;
  const despachosCount = despachos ? despachos.length : 6;

  const tabs = [
    { label: "PROGRAMACIÓN", sub: "(Cargar/Editar Excel)", count: "14", comp: Programacion },
    { label: "PATIO / ANDENES", sub: "(Asignación Drag & Drop)", count: `${andenesOcupados}/8`, comp: Patio },
    { label: "DEMORAS", sub: "(Registro de Causa)", count: `${demorasActivas}`, comp: Demoras },
    { label: "DESPACHOS", sub: "(Liberar Guías/Factura)", count: `${despachosCount}`, comp: Despachos },
    { label: "MÉTRICAS Y REPORTES", sub: "(KPIs y Tiempos de Carga)", count: "", comp: Metricas },
  ];

  const ActiveComponent = tabs[activeTab].comp;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 p-3 space-y-3 font-sans">
      {/* HEADER PRINCIPAL */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-black text-white tracking-wider">MOTO</span>
            <span className="text-xl font-black text-red-500 tracking-wider">MUNDO</span>
          </div>
          <span className="text-slate-700 text-xl font-light">|</span>
          <h1 className="text-sm font-bold text-slate-200 tracking-wide uppercase">CENTRO DE CONTROL - AMARATECA</h1>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="bg-[#020617] px-3 py-1 rounded border border-slate-800 text-slate-200 font-semibold">
            {now ? now.toLocaleDateString("es-HN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase() : "28 MAY 2026"}
          </div>
          <div className="bg-[#020617] px-3 py-1 rounded border border-slate-800 font-mono text-amber-400 font-bold">
            {now ? now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true }) : "10:30:00 AM"}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 font-bold text-[11px]">(EN VIVO)</span>
          </div>
        </div>
      </header>

      {/* PESTAÑAS DE NAVEGACIÓN */}
      <nav className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`flex flex-col justify-between p-2.5 rounded-lg text-left transition border shadow-lg ${
              activeTab === idx
                ? "bg-blue-600 border-blue-400 text-white"
                : "bg-[#0f172a] border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wide flex items-center justify-between w-full">
              <span>{tab.label}</span>
              {tab.count && <span className="font-mono text-amber-300">({tab.count})</span>}
            </div>
            <div className={`text-[10px] mt-1 ${activeTab === idx ? "text-blue-100" : "text-slate-500"}`}>{tab.sub}</div>
          </button>
        ))}
      </nav>

      {/* VISTA DEL MÓDULO SELECCIONADO */}
      <section className="pt-1">
        <ActiveComponent />
      </section>

      {/* NOTIFICACIÓN TOAST EN VIVO */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-lg shadow-2xl z-50 border border-emerald-400 animate-bounce">
          {toast}
        </div>
      )}
    </main>
  );
}

export default function Page() {
  return (
    <OpsProvider>
      <MainApp />
    </OpsProvider>
  );
}
