"use client";
import { useEffect, useRef, useState } from "react";
import { Download, Upload, X, Truck, User, Package, Clock, MapPin, Timer, AlertTriangle, Megaphone, Plane } from "lucide-react";
import * as XLSX from "xlsx";
import { useOps } from "./Store"; import { Badge, Card, Bar } from "./Ui"; import { COLOR, Anden, Ruta } from "@/lib/data";

const HEAD = ["Placa", "Capacidad Motos Ideal", "Motorista", "Hora de carga", "Ruta Final", "Punto 1", "Punto 2"] as const;
const LEYENDA = [["LIBRE", "#10B981"], ["CARGANDO", "#F59E0B"], ["LISTO", "#3B82F6"], ["DOC", "#3B82F6"], ["ESPERA", "#94A3B8"], ["RETRASO", "#EF4444"]];
const inp = "w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm";
const pad = (n: number) => String(n).padStart(2, "0");
const toHora = (v: unknown) => { if (typeof v === "number") { const s = Math.round(v * 86400); return `${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`; } return String(v ?? "").trim(); };
const segundosDesde = (entrada: string | null, now: Date) => { const m = entrada?.match(/(\d+):(\d+)\s*(AM|PM)/i); if (!m) return 0;
  let h = +m[1] % 12; if (m[3].toUpperCase() === "PM") h += 12; const t = new Date(now); t.setHours(h, +m[2], 0, 0); return Math.max(0, Math.floor((now.getTime() - t.getTime()) / 1000)); };
const fmt = (s: number) => `${Math.floor(s / 3600)}h ${pad(Math.floor(s / 60) % 60)}m ${pad(s % 60)}s`;

function descargarPlantilla() {
  const ws = XLSX.utils.aoa_to_sheet([[...HEAD], ["JDA3940", 21, "Adan Martinez", "09:00:00", "ZN, OLAN", "UMMM VICTORIA", "UMMM YORO"]]);
  ws["!cols"] = HEAD.map(h => ({ wch: Math.max(14, h.length + 2) }));
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Programación"); XLSX.writeFile(wb, "Plantilla_Programacion_Motomundo.xlsx");
}

function ModalProgramar({ onClose }: { onClose: () => void }) {
  const { agregarRutas } = useOps(); const ref = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState(""); const [f, setF] = useState<Ruta>({ placa: "", capacidad: 0, motorista: "", hora: "", ruta_final: "", punto1: "", punto2: "" });
  const subir = async (file: File) => {
    try { const wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[wb.SheetNames[0]], { defval: "" });
      const rutas: Ruta[] = rows.map(r => ({ placa: String(r["Placa"]).trim().toUpperCase(), capacidad: Number(r["Capacidad Motos Ideal"]) || 0, motorista: String(r["Motorista"]).trim(),
        hora: toHora(r["Hora de carga"]), ruta_final: String(r["Ruta Final"]).trim(), punto1: String(r["Punto 1"]).trim(), punto2: String(r["Punto 2"]).trim() })).filter(r => r.placa);
      if (!rutas.length) { setMsg("No se encontraron filas válidas. Revise que los encabezados coincidan con la plantilla."); return; }
      agregarRutas(rutas); setMsg(`✔ ${rutas.length} ruta(s) cargadas de ${rows.length} fila(s).`);
    } catch { setMsg("No se pudo leer el archivo. Use .xlsx o .csv con la plantilla."); } };
  const campo = (k: keyof Ruta, l: string, type = "text") => <label className="text-xs text-slate-400">{l}<input type={type} className={inp} value={f[k]} onChange={e => setF({ ...f, [k]: type === "number" ? +e.target.value : e.target.value })}/></label>;
  return (<div className="fixed inset-0 bg-black/70 grid place-items-center z-50 p-4"><div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-[460px] max-w-full space-y-3">
    <div className="flex justify-between"><h3 className="font-bold">Cargar / Programar Ruta</h3><button onClick={onClose}><X size={18}/></button></div>
    <div className="border border-dashed border-slate-600 rounded p-3 text-sm">
      <p className="mb-2 text-slate-300">Subir Excel completado (.xlsx / .csv)</p>
      <input ref={ref} type="file" accept=".xlsx,.csv" hidden onChange={e => e.target.files?.[0] && subir(e.target.files[0])}/>
      <button onClick={() => ref.current?.click()} className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded"><Upload size={14}/>Seleccionar archivo</button>
      {msg && <p className="mt-2 text-xs text-amber-300">{msg}</p>}</div>
    <p className="text-xs text-slate-400">— o programar manualmente —</p>
    <div className="grid grid-cols-2 gap-2">{campo("placa", "Placa")}{campo("motorista", "Motorista")}{campo("capacidad", "Capacidad Motos Ideal", "number")}{campo("hora", "Hora de carga (HH:MM:SS)")}{campo("ruta_final", "Ruta Final")}{campo("punto1", "Punto 1")}{campo("punto2", "Punto 2")}</div>
    <div className="flex justify-end gap-2"><button onClick={onClose}>Cerrar</button>
      <button disabled={!f.placa || !f.motorista} onClick={() => { agregarRutas([{ ...f, placa: f.placa.trim().toUpperCase() }]); onClose(); }} className="bg-emerald-600 disabled:opacity-40 px-3 py-1 rounded">Guardar ruta</button></div></div></div>);
}

function Ficha({ placa, now, onClose }: { placa: string; now: Date; onClose: () => void }) {
  const { andenes, rutas } = useOps(); const a = andenes.find(x => x.placa === placa); const r = rutas.find(x => x.placa === placa);
  const cargadas = r && a ? Math.round(r.capacidad * a.prog / 100) : 0;
  const fila = (I: typeof Truck, l: string, v: React.ReactNode) => <div className="flex gap-3 py-2 border-t border-slate-800"><I size={18} className="text-blue-400 mt-0.5"/><div><div className="text-xs text-slate-400">{l}</div><div className="text-sm font-semibold">{v}</div></div></div>;
  return (<div className="fixed inset-0 z-50 bg-black/60 flex justify-end" onClick={onClose}><aside className="w-96 max-w-full h-full bg-slate-900 border-l border-slate-700 p-4 overflow-y-auto" onClick={e => e.stopPropagation()}>
    <div className="flex justify-between items-center mb-2"><h3 className="font-bold">Detalle de Vehículo y Ruta</h3><button onClick={onClose}><X size={18}/></button></div>
    {a && <div className="mb-2 flex gap-2 items-center text-sm">Andén {a.id} <Badge e={a.estado}/></div>}
    {fila(Truck, "Placa del vehículo", placa)}
    {fila(User, "Motorista", r?.motorista ?? "Sin ruta programada")}
    {fila(Package, "Capacidad de carga", r ? `${r.capacidad} Motos Ideal | ${cargadas} Cargadas` : "—")}
    {fila(Clock, "Hora de ingreso a andén", a?.entrada ?? "No está en andén")}
    {fila(Timer, "Tiempo transcurrido en andén", a?.entrada ? `${fmt(segundosDesde(a.entrada, now))} transcurridos` : "—")}
    {fila(MapPin, "Tiendas / puntos de entrega", r ? <>Ruta: {r.ruta_final}<br/>Punto 1: {r.punto1}<br/>Punto 2: {r.punto2}</> : "Sin ruta programada")}
  </aside></div>);
}

export default function Programacion() {
  const { andenes, despachos, notifs, rutas } = useOps();
  const [sel, setSel] = useState<Anden | null>(null); const [placa, setPlaca] = useState<string | null>(null); const [modal, setModal] = useState(false);
  const [now, setNow] = useState(new Date()); const [cierre, setCierre] = useState(30 * 60);
  useEffect(() => { const i = setInterval(() => { setNow(new Date()); setCierre(c => Math.max(0, c - 1)); }, 1000); return () => clearInterval(i); }, []);
  const act = sel ?? { id: "A01", placa: "HAA-4567", carga: "C-084", destino: "SPS" };
  const pendientes = rutas.filter(r => !andenes.some(a => a.placa === r.placa)).map(r => r.placa);
  const tiendas: [string, number, number][] = [["La Lima", 30, 30], ["Villanueva", 20, 18], ["Cofradía", 15, 10], ["El Progreso", 18, 18]];
  const verPlaca = (p: string | null, e: React.MouseEvent) => { if (p) { e.stopPropagation(); setPlaca(p); } };
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 justify-end">
        <button onClick={descargarPlantilla} className="flex items-center gap-1 border border-emerald-500 text-emerald-400 px-3 py-1.5 rounded text-sm"><Download size={14}/>Descargar Plantilla Excel</button>
        <button onClick={() => setModal(true)} className="flex items-center gap-1 bg-blue-600 px-3 py-1.5 rounded text-sm"><Upload size={14}/>Cargar / Programar Ruta</button></div>
      <div className="grid lg:grid-cols-2 gap-3">
        <div className="space-y-3">
          <Card t="01. CONTROL DE TRANSPORTE (PATIO Y ANDENES)">
            <table className="w-full text-sm"><thead className="text-xs text-slate-400"><tr>{["ANDÉN", "PLACA", "N° CARGA", "DESTINO", "ENTRADA", "ESTADO", "PROGRESO/TIEMPO"].map(h => <th key={h} className="text-left p-1">{h}</th>)}</tr></thead>
              <tbody>{andenes.map(a => (<tr key={a.id} onClick={() => setSel(a)} className={`cursor-pointer border-t border-slate-800 hover:bg-slate-800 ${sel?.id === a.id ? "bg-slate-800" : ""}`}>
                <td className="p-1 font-bold">{a.id}</td>
                <td>{a.placa ? <button onClick={e => verPlaca(a.placa, e)} className="text-blue-300 underline decoration-dotted">{a.placa}</button> : "------"}</td>
                <td>{a.carga ?? "-------"}</td><td>{a.destino ?? "LIBRE"}</td><td>{a.entrada ?? "-----"}</td><td><Badge e={a.estado}/></td>
                <td className="w-32">{a.estado === "LIBRE" ? <span className="text-emerald-400">● Disponible</span> : <div><span className="text-xs">~{fmt(segundosDesde(a.entrada, now)).slice(0, 6)} trans.</span><Bar v={a.prog} c={COLOR[a.estado]}/></div>}</td></tr>))}</tbody></table>
          </Card>
          <Card t="MAPA DE ANDENES (PATIO VISUAL)">
            <div className="grid grid-cols-8 gap-2 bg-slate-800 rounded p-2">{andenes.map(a => (
              <div key={a.id} className="text-center text-xs border-x border-dashed border-yellow-500/40 py-1"><div className="font-bold">{a.id}</div><Badge e={a.estado}/>
                <button disabled={!a.placa} onClick={e => verPlaca(a.placa, e)} className="block mx-auto mt-2" title={a.placa ?? "Libre"}>
                  <div className="w-7 h-14 rounded-md relative mx-auto" style={{ background: a.estado === "LIBRE" ? "#e2e8f0" : COLOR[a.estado] }}><div className="absolute top-1 inset-x-1 h-3 bg-slate-800/70 rounded-sm"/></div>
                  {a.placa && <span className="text-[9px] text-slate-200">{a.placa}</span>}</button></div>))}</div>
            <div className="flex flex-wrap gap-3 mt-2 text-xs"><b>LEYENDA:</b>{LEYENDA.map(([l, c]) => <span key={l} className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full" style={{ background: c }}/>{l}</span>)}</div>
          </Card>
        </div>
        <Card t="02. CONTROL DE CARGA (DESPACHO)">
          <div className="flex justify-between gap-2">
            <div className="flex gap-4 items-center"><Truck size={28}/><div><b className="text-xl">{act.carga}</b><div className="text-xs text-slate-400">{act.destino}</div></div><div><b className="text-lg">{act.placa}</b><div className="text-xs text-slate-400">ANDÉN: {act.id}</div></div></div>
            <div className="text-right text-xs bg-slate-950 rounded p-2">TIEMPO PARA CIERRE<div className="text-emerald-400 text-2xl font-bold">{pad(Math.floor(cierre / 60))}:{pad(cierre % 60)} min</div><div className="text-slate-400">(Cierre: 11:00 AM)</div></div></div>
          <div className="my-3 text-sm font-bold flex justify-between">AVANCE DE CARGA<span className="text-2xl">72%</span></div><Bar v={72}/>
          <div className="grid grid-cols-4 gap-2 text-center mt-3">{[["Planificadas", 120], ["Preparadas", 105], ["Cargadas", 86], ["Pendientes", 34]].map(([l, v]) => <div key={l} className="bg-slate-950 p-2 rounded"><b className="text-lg">{v}</b><div className="text-[10px] text-slate-400">{l}</div></div>)}</div>
          <div className="text-sm my-3"><b>TIPO DE CARGA:</b> <b>92</b> Motos · <b>18</b> Accesorios · <b>10</b> Repuestos</div>
          <table className="w-full text-sm"><thead className="text-xs text-slate-400"><tr><th className="text-left">CARGA POR TIENDA</th><th>PLAN</th><th>CARGADA</th><th>FALTA</th></tr></thead>
            <tbody>{tiendas.map(([t, p, c]) => { const f = p - c; return <tr key={t} className="text-center border-t border-slate-800"><td className="text-left">{t}</td><td>{p}</td><td>{c}</td><td>{f} {f >= 5 && <span title={`Faltan ${f} unidades por cargar`}><AlertTriangle size={14} className="inline text-amber-400"/></span>}</td></tr>; })}</tbody></table>
          <div className="mt-3 border border-slate-700 rounded p-2"><div className="flex items-center gap-2 text-sm font-bold mb-2"><Megaphone size={16} className="text-amber-400"/>ALERTAS OPERATIVAS Y REASIGNACIÓN DE PLACAS</div>
            <div className="border border-emerald-500 rounded p-2 text-emerald-400 text-sm">{notifs[0]?.texto ?? "Sin notificaciones"}</div>
            <p className="text-sm mt-2">→ Próximas placas disponibles en patio: {pendientes.length ? pendientes.map((p, i) => <span key={p}><button className="text-blue-300 underline" onClick={() => setPlaca(p)}>{p}</button>{i < pendientes.length - 1 && ", "}</span>) : "ninguna"}</p></div>
        </Card>
      </div>
      <Card><div className="flex flex-wrap gap-3 items-center"><div className="flex items-center gap-2 font-bold"><Plane size={22}/>PRÓXIMAS<br/>SALIDAS</div>
        {despachos.slice(0, 3).map(d => <div key={d.id} className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-sm">{d.hora} | {d.destino} | {d.anden}<br/>{d.placa} <Badge e={d.estado}/></div>)}
        <div className="ml-auto text-sm"><b>MENSAJE DEL DÍA:</b><br/>CARGA COMPLETA, ENTREGAS A TIEMPO.</div></div></Card>
      {modal && <ModalProgramar onClose={() => setModal(false)}/>}
      {placa && <Ficha placa={placa} now={now} onClose={() => setPlaca(null)}/>}
    </div>);
}
