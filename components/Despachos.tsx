"use client";
import { useState } from "react";
import { Search, Eye, Pencil, Trash2, Plus, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx"; import jsPDF from "jspdf";
import { useOps } from "./Store"; import { Badge, Card } from "./Ui"; import { Despacho } from "@/lib/data";
const TABS = ["A. Datos del transporte", "B. Productos", "C. Cantidades", "D. Documentos", "E. Historial", "F. Liberación"];
const DOCS = ["Manifiesto", "Factura / Documento comercial", "Guía de transporte", "Confirmación de carga", "Inspección final", "Identificación del motorista", "Placa del vehículo"];
const VACIO: Despacho = { id: "", manifiesto: "", placa: "", motorista: "", destino: "SPS", anden: "A01", plan: 0, carg: 0, doc: "Pendiente", estado: "DOC", hora: "" };
const inp = "w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-sm";

function Modal({ ini, onSave, onClose }: { ini: Despacho; onSave: (d: Despacho) => void; onClose: () => void }) {
  const [f, setF] = useState(ini); const set = (k: keyof Despacho, v: string | number) => setF({ ...f, [k]: v });
  const campo = (k: keyof Despacho, l: string, num = false) => <label className="text-xs text-slate-400">{l}<input className={inp} type={num ? "number" : "text"} value={f[k]} onChange={e => set(k, num ? +e.target.value : e.target.value)}/></label>;
  return (<div className="fixed inset-0 bg-black/70 grid place-items-center z-50"><div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-[420px] space-y-2">
    <h3 className="font-bold">{ini.id ? `Editar ${ini.id}` : "Nuevo despacho"}</h3>
    <div className="grid grid-cols-2 gap-2">{campo("placa", "Placa")}{campo("motorista", "Motorista")}{campo("destino", "Destino")}{campo("anden", "Andén")}{campo("plan", "Unid. plan.", true)}{campo("carg", "Unid. carg.", true)}{campo("hora", "Hora prog.")}
      <label className="text-xs text-slate-400">Documentación<select className={inp} value={f.doc} onChange={e => set("doc", e.target.value)}>{["Completa", "Pendiente", "Incompleta", "Faltan docs"].map(x => <option key={x}>{x}</option>)}</select></label></div>
    <div className="flex justify-end gap-2 pt-2"><button onClick={onClose}>Cancelar</button><button disabled={!f.placa} onClick={() => onSave(f)} className="bg-blue-600 disabled:opacity-40 px-3 py-1 rounded">Guardar</button></div></div></div>);
}
export default function Despachos() {
  const { despachos, liberar, incidencia, guardar, eliminar } = useOps();
  const [q, setQ] = useState(""), [fecha, setFecha] = useState("2026-05-28"), [est, setEst] = useState("Todos"), [dest, setDest] = useState("Todos");
  const [sel, setSel] = useState("D-001"), [tab, setTab] = useState(0), [modal, setModal] = useState<Despacho | null>(null);
  const [chk, setChk] = useState<Record<string, boolean[]>>({}); const [hist, setHist] = useState<Record<string, string[]>>({});
  const d = despachos.find(x => x.id === sel) ?? despachos[0];
  const rows = despachos.filter(x => (est === "Todos" || x.estado === est) && (dest === "Todos" || x.destino === dest) && JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));
  const log = (id: string, t: string) => setHist(h => ({ ...h, [id]: [`${new Date().toLocaleTimeString("es-HN")} · ${t}`, ...(h[id] ?? [])] }));
  const docs = d ? (chk[d.id] ?? DOCS.map(() => d.doc === "Completa")) : [];
  const nDocs = docs.filter(Boolean).length;
  const toggle = (i: number) => { const n = [...docs]; n[i] = !n[i]; setChk({ ...chk, [d.id]: n }); log(d.id, `${DOCS[i]} ${n[i] ? "validado" : "desmarcado"}`); };
  const excel = () => { const data = rows.map((x, i) => ({ "#": i + 1, "N° Despacho": x.id, "N° Manifiesto": x.manifiesto, Placa: x.placa, Motorista: x.motorista, Destino: x.destino, Andén: x.anden, "Unid. Plan.": x.plan, "Unid. Carg.": x.carg, Documentación: x.doc, Estado: x.estado, "Hora Prog.": x.hora }));
    const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), "Despachos"); XLSX.writeFile(wb, "despachos.xlsx"); };
  const pdf = () => { const p = new jsPDF(); p.setFontSize(16); p.text("Comprobante de despacho - Motomundo", 14, 20); p.setFontSize(11);
    [`Despacho: ${d.id}`, `Manifiesto: ${d.manifiesto}`, `Placa: ${d.placa}`, `Motorista: ${d.motorista}`, `Destino: ${d.destino}`, `Anden: ${d.anden}`, `Unidades: ${d.carg}/${d.plan}`, `Documentos: ${nDocs}/7`, `Estado: ${d.estado}`, `Emitido: ${new Date().toLocaleString("es-HN")}`].forEach((l, i) => p.text(l, 14, 35 + i * 8));
    p.save(`comprobante-${d.id}.pdf`); log(d.id, "Comprobante generado"); };
  const guardarForm = (f: Despacho) => { const n = despachos.length + 1; const id = f.id || `D-${String(n).padStart(3, "0")}`; guardar({ ...f, id, manifiesto: f.manifiesto || `M-${id.slice(2)}` }); log(id, f.id ? "Editado" : "Creado"); setSel(id); setModal(null); };
  if (!d) return <Card>Sin despachos. <button className="text-blue-400" onClick={() => setModal(VACIO)}>Crear uno</button></Card>;
  const listo = d.estado === "LISTO" && nDocs === 7;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2 text-center">{[["Pendientes de despacho", despachos.filter(x => x.estado === "DOC").length], ["En validación documental", despachos.filter(x => x.estado === "EN VALIDACION").length], ["Listos para liberar", despachos.filter(x => x.estado === "LISTO").length], ["Despachados hoy", despachos.filter(x => x.estado === "DESPACHADO").length], ["Con incidencias", despachos.filter(x => x.estado === "CON INCIDENCIA").length]].map(([l, v]) => <Card key={l}><div className="text-xs text-slate-400">{l}</div><b className="text-2xl">{v}</b></Card>)}</div>
      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-3">
        <Card t="LISTA DE DESPACHOS">
          <div className="flex flex-wrap gap-2 mb-2 items-end">
            <div className="relative flex-1 min-w-[180px]"><Search size={14} className="absolute left-2 top-2 text-slate-500"/><input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por manifiesto, placa, destino, etc..." className={inp + " pl-7"}/></div>
            <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className={inp + " w-36"}/>
            <select value={est} onChange={e => setEst(e.target.value)} className={inp + " w-36"}>{["Todos", "LISTO", "EN VALIDACION", "DOC", "CON INCIDENCIA", "DESPACHADO"].map(x => <option key={x}>{x}</option>)}</select>
            <select value={dest} onChange={e => setDest(e.target.value)} className={inp + " w-24"}>{["Todos", "SPS", "OC", "BA"].map(x => <option key={x}>{x}</option>)}</select>
            <button onClick={excel} className="flex items-center gap-1 border border-emerald-500 text-emerald-400 px-2 py-1 rounded text-sm"><FileSpreadsheet size={14}/>Exportar Excel</button>
            <button onClick={() => setModal(VACIO)} className="flex items-center gap-1 bg-blue-600 px-2 py-1 rounded text-sm"><Plus size={14}/>Nuevo Despacho</button></div>
          <div className="overflow-x-auto"><table className="w-full text-xs"><thead className="text-slate-400"><tr>{["#", "N° Despacho", "N° Manifiesto", "Placa", "Motorista", "Destino", "Andén", "Unid. Plan.", "Unid. Carg.", "Documentación", "Estado", "Hora Prog.", "Acciones"].map(h => <th key={h} className="text-left p-1">{h}</th>)}</tr></thead>
            <tbody>{rows.map((x, i) => (<tr key={x.id} className={`border-t border-slate-800 ${sel === x.id ? "bg-slate-800" : ""}`}><td className="p-1">{i + 1}</td><td>{x.id}</td><td>{x.manifiesto}</td><td>{x.placa}</td><td>{x.motorista}</td><td>{x.destino}</td><td>{x.anden}</td><td>{x.plan}</td><td>{x.carg}</td>
              <td className={x.doc === "Completa" ? "text-emerald-400" : "text-amber-400"}>{x.doc}</td><td><Badge e={x.estado}/></td><td>{x.hora}</td>
              <td><span className="flex gap-2"><button title="Ver" onClick={() => { setSel(x.id); setTab(0); }}><Eye size={14}/></button><button title="Editar" onClick={() => setModal(x)}><Pencil size={14}/></button><button title="Eliminar" className="text-red-400" onClick={() => confirm(`¿Eliminar ${x.id}?`) && eliminar(x.id)}><Trash2 size={14}/></button></span></td></tr>))}</tbody></table></div>
        </Card>
        <Card t={`DETALLE DE DESPACHO · ${d.id} · ${d.placa} · ${d.motorista} · ${d.destino}`}>
          <div className="mb-2"><Badge e={d.estado}/> <span className="text-xs text-slate-400">Andén {d.anden} · Manifiesto {d.manifiesto}</span></div>
          <div className="flex flex-wrap border-b border-slate-800 mb-2 text-xs">{TABS.map((t, i) => <button key={t} onClick={() => setTab(i)} className={`px-2 py-1 ${tab === i ? "bg-blue-600 rounded-t" : "text-slate-400"}`}>{i === 3 ? `D. Documentos (${nDocs}/7)` : t}</button>)}</div>
          <div className="text-sm min-h-[150px]">
            {tab === 0 && <ul className="space-y-1"><li>Fecha programada: 28/05/2026 {d.hora}</li><li>Vehículo: {d.placa} (Camión)</li><li>Motorista: {d.motorista}</li><li>Destino: {d.destino}</li><li>Andén asignado: {d.anden}</li></ul>}
            {tab === 1 && <ul className="space-y-1"><li>Motocicletas: {Math.round(d.carg * 0.77)}</li><li>Accesorios: {Math.round(d.carg * 0.15)}</li><li>Repuestos: {d.carg - Math.round(d.carg * 0.77) - Math.round(d.carg * 0.15)}</li></ul>}
            {tab === 2 && <div><p>Planificadas: {d.plan} · Cargadas: {d.carg} · Pendientes: {d.plan - d.carg}</p><div className="h-2 bg-slate-800 rounded mt-2"><div className="h-full bg-emerald-500 rounded" style={{ width: `${d.plan ? (d.carg / d.plan) * 100 : 0}%` }}/></div></div>}
            {tab === 3 && <ul className="space-y-1">{DOCS.map((n, i) => <li key={n}><label className="flex justify-between cursor-pointer"><span><input type="checkbox" checked={docs[i]} onChange={() => toggle(i)} className="mr-2"/>{n}</span>{docs[i] && <span className="text-emerald-400 text-xs">✓ Validado</span>}</label></li>)}</ul>}
            {tab === 4 && <ul className="space-y-1 text-xs">{(hist[d.id] ?? ["Sin eventos registrados en esta sesión"]).map((h, i) => <li key={i}>{h}</li>)}</ul>}
            {tab === 5 && <p>{listo ? "Listo para liberar el vehículo y el andén." : "Requiere estado LISTO y 7/7 documentos validados."}</p>}
          </div>
          <div className="flex gap-2 flex-wrap mt-3">
            <button onClick={pdf} className="bg-blue-600 px-3 py-2 rounded text-sm">Generar comprobante de despacho</button>
            <button onClick={() => setModal(d)} className="border border-slate-500 px-3 py-2 rounded text-sm">Editar</button>
            <button onClick={() => { incidencia(d.id); log(d.id, "Marcado CON INCIDENCIA"); }} className="border border-red-500 text-red-400 px-3 py-2 rounded text-sm">Cancelar</button>
            <button disabled={!listo} title={listo ? "" : "Requiere LISTO y 7/7 documentos"} onClick={() => { liberar(d.id); log(d.id, "Vehículo liberado"); }} className="border border-emerald-400 text-emerald-400 disabled:opacity-40 px-3 py-2 rounded text-sm font-bold">Liberar vehículo</button></div>
        </Card>
      </div>
      {modal && <Modal ini={modal} onSave={guardarForm} onClose={() => setModal(null)}/>}
    </div>);
}
