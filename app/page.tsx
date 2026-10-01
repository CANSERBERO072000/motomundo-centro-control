import React, { useState } from 'react';
import { 
  Bike, Truck, ClipboardList, AlertTriangle, FileText, BarChart3, 
  Clock, Calendar, Package, Hourglass, Bell, CheckCircle2, 
  ArrowRight, Megaphone, PlaneTakeoff, ShieldAlert, HardHat, Radio
} from 'lucide-react';

export default function ProgramacionModule() {
  const [selectedAnden, setSelectedAnden] = useState('A01');

  const andenes = [
    { id: 'A01', placa: '------', carga: '-------', destino: 'LIBRE', entrada: '-----', estado: 'LIBRE', timeText: 'Disponible', prog: 0, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', truckColor: 'bg-slate-700' },
    { id: 'A02', placa: 'JDI2023', carga: 'C-085', destino: 'OC', entrada: '09:15 AM', estado: 'LISTO', timeText: '~1h 15m trans.', prog: 100, color: 'bg-blue-500/20 text-blue-400 border-blue-500/40', truckColor: 'bg-amber-500' },
    { id: 'A03', placa: 'PDC1845', carga: 'C-086', destino: 'BA', entrada: '09:45 AM', estado: 'DOC.', timeText: '~0h 45m trans.', prog: 85, color: 'bg-blue-600/20 text-blue-400 border-blue-500/40', truckColor: 'bg-blue-600' },
    { id: 'A04', placa: 'HJK7788', carga: 'C-087', destino: 'SPS', entrada: '10:10 AM', estado: 'ESPERA', timeText: '~0h 20m trans.', prog: 20, color: 'bg-slate-700/50 text-slate-300 border-slate-600', truckColor: 'bg-red-600' },
    { id: 'A05', placa: '------', carga: '-------', destino: 'LIBRE', entrada: '-----', estado: 'LIBRE', timeText: 'Disponible', prog: 0, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', truckColor: 'bg-slate-700' },
    { id: 'A06', placa: '------', carga: '-------', destino: 'LIBRE', entrada: '-----', estado: 'LIBRE', timeText: 'Disponible', prog: 0, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', truckColor: 'bg-slate-700' },
    { id: 'A07', placa: '------', carga: '-------', destino: 'LIBRE', entrada: '-----', estado: 'LIBRE', timeText: 'Disponible', prog: 0, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', truckColor: 'bg-slate-700' },
    { id: 'A08', placa: '------', carga: '-------', destino: 'LIBRE', entrada: '-----', estado: 'LIBRE', timeText: 'Disponible', prog: 0, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', truckColor: 'bg-slate-700' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-3 space-y-3">
      
      {/* 1. HEADER BRANDING Y RELOJ */}
      <header className="flex flex-col md:flex-row items-center justify-between bg-[#0f172a] border border-slate-800 rounded-lg px-4 py-2 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-1.5 rounded-lg text-white">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-red-500 block leading-none">MOTOMUNDO</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight">Distribución de Motocicletas</span>
            </div>
          </div>
          <span className="text-slate-700 text-xl font-light mx-2">|</span>
          <div className="flex items-center gap-2 text-slate-200">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
            <h1 className="text-sm font-bold tracking-wide uppercase">CENTRO DE CONTROL - AMARATECA</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 bg-[#020617] px-3 py-1 rounded border border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-200">28 MAY 2026</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#020617] px-3 py-1 rounded border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono text-amber-400 font-bold">10:30 AM</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 font-bold text-[11px]">(EN VIVO)</span>
          </div>
        </div>
      </header>

      {/* 2. PESTAÑAS NAVEGACIÓN SUPERIOR CON ICONOS */}
      <nav className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <button className="flex items-center gap-3 p-2.5 bg-blue-600 border-2 border-blue-400 text-white rounded-lg text-left shadow-lg">
          <ClipboardList className="w-6 h-6 shrink-0" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wide">PROGRAMACIÓN (14)</div>
            <div className="text-[10px] text-blue-100 opacity-90">(Cargar/Editar Excel)</div>
          </div>
        </button>

        <button className="flex items-center gap-3 p-2.5 bg-[#0f172a] border border-slate-800 text-slate-300 hover:border-slate-700 rounded-lg text-left">
          <Truck className="w-6 h-6 shrink-0 text-slate-400" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wide">PATIO / ANDENES (3/8)</div>
            <div className="text-[10px] text-slate-500">(Asignación Drag & Drop)</div>
          </div>
        </button>

        <button className="flex items-center gap-3 p-2.5 bg-[#0f172a] border border-slate-800 text-slate-300 hover:border-slate-700 rounded-lg text-left">
          <AlertTriangle className="w-6 h-6 shrink-0 text-amber-500" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wide">DEMORAS (1)</div>
            <div className="text-[10px] text-slate-500">(Registro de Causa)</div>
          </div>
        </button>

        <button className="flex items-center gap-3 p-2.5 bg-[#0f172a] border border-slate-800 text-slate-300 hover:border-slate-700 rounded-lg text-left">
          <FileText className="w-6 h-6 shrink-0 text-slate-400" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wide">DESPACHOS (11)</div>
            <div className="text-[10px] text-slate-500">(Liberar Guías/Factura)</div>
          </div>
        </button>

        <button className="flex items-center gap-3 p-2.5 bg-[#0f172a] border border-slate-800 text-slate-300 hover:border-slate-700 rounded-lg text-left">
          <BarChart3 className="w-6 h-6 shrink-0 text-slate-400" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wide">MÉTRICAS Y REPORTES</div>
            <div className="text-[10px] text-slate-500">(KPIs y Tiempos de Carga)</div>
          </div>
        </button>
      </nav>

      {/* 3. GRID PRINCIPAL (DOS COLUMNAS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        
        {/* PANEL IZQUIERDO: CONTROL DE TRANSPORTE & MAPA DE PATIO */}
        <div className="lg:col-span-6 space-y-3">
          
          {/* TABLA DE TRANSPORTE */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-3 shadow-xl">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-800">
              <Truck className="w-4 h-4 text-blue-400" />
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                01. CONTROL DE TRANSPORTE (PATIO Y ANDENES)
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="pb-2 font-semibold">ANDÉN</th>
                    <th className="pb-2 font-semibold">PLACA</th>
                    <th className="pb-2 font-semibold">Nº CARGA</th>
                    <th className="pb-2 font-semibold">DESTINO</th>
                    <th className="pb-2 font-semibold">ENTRADA</th>
                    <th className="pb-2 font-semibold">ESTADO</th>
                    <th className="pb-2 font-semibold">PROGRESO/TIEMPO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {andenes.map((a) => (
                    <tr 
                      key={a.id} 
                      onClick={() => setSelectedAnden(a.id)}
                      className={`hover:bg-slate-800/40 cursor-pointer transition ${selectedAnden === a.id ? 'bg-blue-950/30' : ''}`}
                    >
                      <td className="py-1.5 font-bold text-slate-100">{a.id}</td>
                      <td className="py-1.5 font-mono text-slate-300">{a.placa}</td>
                      <td className="py-1.5 font-mono text-slate-300">{a.carga}</td>
                      <td className="py-1.5 text-slate-200">{a.destino}</td>
                      <td className="py-1.5 text-slate-400">{a.entrada}</td>
                      <td className="py-1.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${a.color}`}>
                          {a.estado}
                        </span>
                      </td>
                      <td className="py-1.5">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 block font-mono">{a.timeText}</span>
                          {a.prog > 0 && (
                            <div className="w-24 bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${a.prog}%` }}></div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MAPA VISUAL DE PATIO CON ILUSTRACIÓN DE BODEGA/CAMIONES */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-3 shadow-xl space-y-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                MAPA DE ANDENES (PATIO VISUAL)
              </span>
            </div>

            {/* MARCO GRÁFICO TIPO BAHÍA BODEGA */}
            <div className="bg-[#020617] border border-slate-800 rounded-lg p-3 relative overflow-hidden">
              <div className="grid grid-cols-8 gap-2 relative z-10">
                {andenes.map((a) => (
                  <div key={a.id} className="flex flex-col items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-300">{a.id}</span>
                    <span className={`px-1 py-0.2 text-[8px] font-extrabold rounded ${a.color}`}>
                      {a.estado}
                    </span>
                    {/* REPRESENTACIÓN DE CAMIÓN ILUSTRADO POR COLORES */}
                    <div className="w-full h-16 bg-slate-900 border border-slate-800 rounded flex flex-col justify-between items-center p-1 relative shadow-inner">
                      <div className={`w-full h-8 rounded-sm shadow ${a.truckColor} opacity-90`}></div>
                      <div className="w-3/4 h-2 bg-slate-800 rounded-t-sm border-t border-slate-700"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LEYENDA */}
            <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1 font-semibold">
              <span className="text-slate-200">LEYENDA:</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> LIBRE</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> CARGANDO</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> LISTO</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> DOC</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400"></span> ESPERA</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> RETRASO</span>
            </div>
          </div>

        </div>

        {/* PANEL DERECHO: CONTROL DE CARGA (DESPACHO) */}
        <div className="lg:col-span-6 space-y-3">
          
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-3 shadow-xl space-y-3">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  02. CONTROL DE CARGA (DESPACHO)
                </h2>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block font-semibold uppercase">TIEMPO PARA CIERRE</span>
                <span className="text-sm font-mono font-bold text-emerald-400">00:30 min</span>
                <span className="text-[9px] text-slate-500 block">(Cierre: 11:00 AM)</span>
              </div>
            </div>

            {/* CABECERA CAMIÓN Y DESTINO */}
            <div className="flex items-center justify-between bg-[#020617] p-2.5 rounded border border-slate-800">
              <div className="flex items-center gap-3">
                <Bike className="w-7 h-7 text-amber-400 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-100 font-mono">C-084</span>
                    <span className="text-slate-300 font-bold">HAA-4567</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    SPS <span className="text-slate-600">|</span> ANDÉN: <strong className="text-slate-200">A01</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* BARRA AVANCE DE CARGA */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-300 uppercase tracking-wider text-[11px]">AVANCE DE CARGA</span>
                <span className="text-emerald-400 font-mono text-base font-black">72%</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '72%' }}></div>
              </div>
            </div>

            {/* 4 CARDS DE CONTEO METRICO */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-[#020617] p-2 rounded border border-slate-800">
                <ClipboardList className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                <span className="text-sm font-bold text-slate-100 block font-mono">120</span>
                <span className="text-[9px] text-slate-400 block font-semibold">Planificadas</span>
              </div>
              <div className="bg-[#020617] p-2 rounded border border-slate-800">
                <Package className="w-4 h-4 mx-auto text-blue-400 mb-1" />
                <span className="text-sm font-bold text-blue-400 block font-mono">105</span>
                <span className="text-[9px] text-slate-400 block font-semibold">Preparadas</span>
              </div>
              <div className="bg-[#020617] p-2 rounded border border-slate-800">
                <Truck className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
                <span className="text-sm font-bold text-emerald-400 block font-mono">86</span>
                <span className="text-[9px] text-slate-400 block font-semibold">Cargadas</span>
              </div>
              <div className="bg-[#020617] p-2 rounded border border-slate-800">
                <Hourglass className="w-4 h-4 mx-auto text-amber-400 mb-1" />
                <span className="text-sm font-bold text-amber-400 block font-mono">34</span>
                <span className="text-[9px] text-slate-400 block font-semibold">Pendientes</span>
              </div>
            </div>

            {/* TIPO DE CARGA */}
            <div className="flex justify-between items-center bg-[#020617] p-2 rounded border border-slate-800 text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5"><Bike className="w-4 h-4 text-amber-400" /> 92 Motos</span>
              <span className="flex items-center gap-1.5"><HardHat className="w-4 h-4 text-blue-400" /> 18 Accesorios</span>
              <span className="flex items-center gap-1.5"><Package className="w-4 h-4 text-emerald-400" /> 10 Repuestos</span>
            </div>

            {/* CARGA POR TIENDA */}
            <div className="space-y-1 pt-1">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800 text-[10px]">
                    <th className="pb-1 font-semibold">CARGA POR TIENDA</th>
                    <th className="pb-1 font-semibold text-center">PLAN</th>
                    <th className="pb-1 font-semibold text-center">CARGADA</th>
                    <th className="pb-1 font-semibold text-right">FALTA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40 text-slate-200 font-medium text-[11px]">
                  <tr>
                    <td className="py-1">La Lima</td>
                    <td className="text-center font-mono">30</td>
                    <td className="text-center font-mono">30</td>
                    <td className="text-right font-mono font-bold text-emerald-400">0</td>
                  </tr>
                  <tr>
                    <td className="py-1">Villanueva</td>
                    <td className="text-center font-mono">20</td>
                    <td className="text-center font-mono">18</td>
                    <td className="text-right font-mono font-bold text-amber-400">2</td>
                  </tr>
                  <tr>
                    <td className="py-1">Cofradía</td>
                    <td className="text-center font-mono">15</td>
                    <td className="text-center font-mono">10</td>
                    <td className="text-right font-mono font-bold text-amber-400 flex items-center justify-end gap-1">
                      5 <AlertTriangle className="w-3 h-3 text-amber-400" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">El Progreso</td>
                    <td className="text-center font-mono">18</td>
                    <td className="text-center font-mono">18</td>
                    <td className="text-right font-mono font-bold text-emerald-400">0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ALERTAS OPERATIVAS Y REASIGNACION */}
            <div className="bg-[#020617] border border-emerald-500/40 rounded p-2.5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Bell className="w-4 h-4 text-amber-400" />
                <span>ALERTAS OPERATIVAS Y REASIGNACIÓN DE PLACAS</span>
              </div>
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded p-2 flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>¡NOTIFICACIÓN: ANDÉN A01 LIBERADO! (HAA-4567 Despachado)</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                <span>Próximas placas disponibles en patio: <strong className="text-slate-200 font-mono">JDA3940, TCB1639</strong></span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 4. CINTILLO INFERIOR: PRÓXIMAS SALIDAS */}
      <footer className="bg-[#0f172a] border border-slate-800 rounded-lg p-2 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 uppercase tracking-wider shrink-0">
            <PlaneTakeoff className="w-4 h-4 text-blue-400" />
            <span>PRÓXIMAS SALIDAS</span>
          </div>

          <div className="flex gap-2 overflow-x-auto text-xs font-medium">
            <div className="bg-[#020617] px-2.5 py-1 rounded border border-slate-800 flex items-center gap-2 shrink-0">
              <span className="font-mono text-emerald-400 font-bold">11:00 AM</span>
              <span className="text-slate-300 font-bold">SPS</span>
              <span className="text-slate-500">A01</span>
              <span className="font-mono text-amber-400">HAA-4567</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.2 rounded font-bold">DESPACHADO</span>
            </div>

            <div className="bg-[#020617] px-2.5 py-1 rounded border border-slate-800 flex items-center gap-2 shrink-0">
              <span className="font-mono text-emerald-400 font-bold">11:30 AM</span>
              <span className="text-slate-300 font-bold">OC</span>
              <span className="text-slate-500">A02</span>
              <span className="font-mono text-amber-400">JDI2023</span>
              <span className="bg-blue-500/20 text-blue-400 text-[9px] px-1.5 py-0.2 rounded font-bold">LISTO</span>
            </div>

            <div className="bg-[#020617] px-2.5 py-1 rounded border border-slate-800 flex items-center gap-2 shrink-0">
              <span className="font-mono text-emerald-400 font-bold">12:00 PM</span>
              <span className="text-slate-300 font-bold">BA</span>
              <span className="text-slate-500">A03</span>
              <span className="font-mono text-amber-400">PDC1845</span>
              <span className="bg-blue-600/20 text-blue-400 text-[9px] px-1.5 py-0.2 rounded font-bold">DOC.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#020617] px-3 py-1 rounded border border-slate-800 text-xs shrink-0">
          <Megaphone className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-slate-300 font-medium text-[11px]">
            MENSAJE DEL DÍA: <strong className="text-slate-100">CARGA COMPLETA, ENTREGAS A TIEMPO.</strong>
          </span>
        </div>
      </footer>

    </div>
  );
}
