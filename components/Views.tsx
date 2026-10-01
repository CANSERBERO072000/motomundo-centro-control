"use client";
import { useState } from "react";
import { PieChart,Pie,Cell,BarChart,Bar as RB,XAxis,YAxis,Tooltip,ResponsiveContainer,LineChart,Line } from "recharts";
import * as XLSX from "xlsx"; import jsPDF from "jspdf";
import { useOps } from "./Store"; import { Badge,Card,Bar } from "./Ui"; import { COLOR } from "@/lib/data";

export function AndenTable({sel,onSel,filtro}:{sel?:string;onSel?:(id:string)=>void;filtro?:string}){
  const {andenes}=useOps(); const rows=andenes.filter(a=>!filtro||a.estado===filtro);
  return <table className="w-full text-sm"><thead className="text-slate-400 text-xs"><tr>{["ANDÉN","PLACA","N° CARGA","DESTINO","ENTRADA","ESTADO","PROGRESO"].map(h=><th key={h} className="text-left p-1">{h}</th>)}</tr></thead>
  <tbody>{rows.map(a=><tr key={a.id} onClick={()=>onSel?.(a.id)} className={`cursor-pointer border-t border-slate-800 hover:bg-slate-800 ${sel===a.id?"bg-slate-800":""}`}>
   <td className="p-1 font-bold">{a.id}</td><td>{a.placa??"------"}</td><td>{a.carga??"-------"}</td><td>{a.destino??"LIBRE"}</td><td>{a.entrada??"-----"}</td><td><Badge e={a.estado}/></td>
   <td className="w-32">{a.estado==="LIBRE"?<span className="text-emerald-400">● Disponible</span>:<Bar v={a.prog} c={COLOR[a.estado]}/>}</td></tr>)}</tbody></table>;
}
export function AndenMap(){ const {andenes}=useOps();
  return <div className="grid grid-cols-8 gap-2">{andenes.map(a=><div key={a.id} className="text-center text-xs"><div className="font-bold">{a.id}</div><Badge e={a.estado}/><div className="mt-1 mx-auto w-6 h-12 rounded" style={{background:a.estado==="LIBRE"?"#e2e8f0":COLOR[a.estado]}}/></div>)}</div>; }

export function Programacion(){ const {andenes,notifs,despachos}=useOps(); const [sel,setSel]=useState("A02"); const a=andenes.find(x=>x.id===sel)!;
  return <div className="grid lg:grid-cols-2 gap-3"><div className="space-y-3"><Card t="01. CONTROL DE TRANSPORTE (PATIO Y ANDENES)"><AndenTable sel={sel} onSel={setSel}/></Card><Card t="MAPA DE ANDENES (PATIO VISUAL)"><AndenMap/></Card></div>
  <Card t="02. CONTROL DE CARGA (DESPACHO)"><div className="flex justify-between"><div><b className="text-xl">{a.carga??"--"}</b> <span className="text-slate-400">{a.destino}</span><div>{a.placa} · ANDÉN {a.id}</div></div><div className="text-right text-xs">TIEMPO PARA CIERRE<div className="text-emerald-400 text-2xl font-bold">00:30 min</div></div></div>
   <div className="my-3 text-xs">AVANCE DE CARGA 72%<Bar v={72}/></div>
   <div className="grid grid-cols-4 gap-2 text-center">{[["Planificadas",120],["Preparadas",105],["Cargadas",86],["Pendientes",34]].map(([l,v])=><div key={l} className="bg-slate-950 p-2 rounded"><b className="text-lg">{v}</b><div className="text-[10px] text-slate-400">{l}</div></div>)}</div>
   <p className="text-sm my-2">92 Motos · 18 Accesorios · 10 Repuestos</p>
   <table className="w-full text-sm"><thead className="text-xs text-slate-400"><tr><th className="text-left">CARGA POR TIENDA</th><th>PLAN</th><th>CARGADA</th><th>FALTA</th></tr></thead><tbody>{[["La Lima",30,30],["Villanueva",20,18],["Cofradía",15,10],["El Progreso",18,18]].map(([t,p,c])=>{const f=Number(p)-Number(c);return <tr key={t as string} className="text-center border-t border-slate-800"><td className="text-left">{t}</td><td>{p}</td><td>{c}</td><td title={f>=5?"Faltante pendiente de carga":""}>{f} {f>=5&&<span className="text-amber-400">⚠</span>}</td></tr>})}</tbody></table>
   <div className="mt-3 p-2 border border-emerald-500 rounded text-emerald-400 text-sm">{notifs[0]?.texto}</div>
   <p className="mt-2 text-sm text-blue-400">→ Próximas placas disponibles en patio: JDA3940, TCB1639</p></Card>
  <Card cls="lg:col-span-2" t="PRÓXIMAS SALIDAS"><div className="flex gap-4 text-sm flex-wrap">{despachos.slice(0,3).map(d=><div key={d.id}>{d.hora} | {d.destino} | {d.anden} — {d.placa} <Badge e={d.estado}/></div>)}<div className="ml-auto font-bold">CARGA COMPLETA, ENTREGAS A TIEMPO.</div></div></Card></div>; }

export function Patio(){ const {andenes,notifs}=useOps(); const [f,setF]=useState<string|undefined>(); const c=(e:string)=>andenes.filter(a=>a.estado===e).length;
  return <div className="grid lg:grid-cols-2 gap-3"><div className="space-y-3"><Card t="CONTROL DE TRANSPORTE"><AndenTable/></Card><Card t="MAPA DE ANDENES"><AndenMap/></Card></div>
  <div className="space-y-3"><Card t="RESUMEN ACTUAL"><div className="flex gap-3 text-sm flex-wrap"><button onClick={()=>setF(undefined)}>8 Andenes</button>{[["LIBRE","Libres"],["CARGANDO","Cargando"],["DOC","En proceso"],["ESPERA","En espera"],["RETRASO","Retrasados"]].map(([e,l])=><button key={e} onClick={()=>setF(e)} style={{color:COLOR[e]}}>{c(e)} {l}</button>)}</div></Card>
  <Card t="DETALLE DE ANDENES"><AndenTable filtro={f}/></Card><Card t="ÚLTIMAS NOTIFICACIONES">{notifs.slice(0,4).map(n=><div key={n.id} className="text-sm text-emerald-400">{n.texto} <span className="text-slate-500">{n.hora}</span></div>)}</Card></div></div>; }

export function Demoras(){ const {demoras,resolver}=useOps(); const [sel,setSel]=useState(1); const [modal,setModal]=useState(false); const d=demoras.find(x=>x.n===sel)!;
  const causas=Object.entries(demoras.reduce((m:Record<string,number>,x)=>{m[x.causa]=(m[x.causa]||0)+1;return m;},{})).map(([name,value])=>({name,value}));
  const pal=["#3B82F6","#F59E0B","#10B981","#8B5CF6","#EF4444","#06B6D4","#94A3B8"];
  return <div className="grid lg:grid-cols-2 gap-3"><div className="space-y-3"><Card t="CONTROL DE DEMORAS"><table className="w-full text-sm"><tbody>{demoras.map(x=><tr key={x.n} className={`border-t border-slate-800 ${sel===x.n?"bg-red-950":""}`}><td>{x.n}</td><td>{x.placa}</td><td>{x.carga}</td><td>{x.anden}</td><td><Badge e={x.resuelta?"DESPACHADO":x.n===1?"DEMORA":"CARGANDO"}/></td><td>{x.tiempo} h</td><td>{x.causa}</td><td><button className="bg-blue-600 px-2 rounded text-xs" onClick={()=>setSel(x.n)}>Ver detalle</button></td></tr>)}</tbody></table></Card>
  <Card t="DETALLE DE LA DEMORA SELECCIONADA"><p className="text-sm">Placa {d.placa} · Andén {d.anden} · Carga {d.carga} · Causa {d.causa} · {d.tiempo} h</p><ul className="text-sm my-2 text-emerald-400"><li>✔ Verificar documentos en sistema</li><li>✔ Confirmar con cliente / tienda</li><li>✔ Liberar guía una vez validado</li></ul><button onClick={()=>setModal(true)} className="w-full bg-blue-600 rounded py-2">Actualizar estado</button></Card></div>
  <div className="space-y-3"><Card t="RESUMEN DE DEMORAS"><div className="grid grid-cols-4 gap-2 text-center text-sm"><div className="bg-red-600 p-2 rounded">1 Crítica</div><div className="bg-amber-500 p-2 rounded">6 En curso</div><div className="bg-blue-600 p-2 rounded">0 En revisión</div><div className="bg-emerald-600 p-2 rounded">{demoras.filter(x=>x.resuelta).length} Resueltas</div></div></Card>
  <Card t="CAUSAS MÁS FRECUENTES"><div className="h-48"><ResponsiveContainer><PieChart><Pie data={causas} dataKey="value" innerRadius={45} outerRadius={75}>{causas.map((_,i)=><Cell key={i} fill={pal[i]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div><p className="text-center">TIEMPO PROMEDIO: <b className="text-red-500">00:42 h</b> (+15% vs. ayer)</p></Card></div>
  {modal&&<div className="fixed inset-0 bg-black/70 grid place-items-center"><div className="bg-slate-900 p-5 rounded w-80"><p className="mb-3">¿Marcar la demora de {d.placa} como RESUELTA?</p><button className="bg-emerald-600 px-3 py-1 rounded mr-2" onClick={()=>{resolver(d.n);setModal(false)}}>Resolver</button><button onClick={()=>setModal(false)}>Cancelar</button></div></div>}</div>; }

export function Despachos(){ const {despachos,liberar,incidencia}=useOps(); const [q,setQ]=useState(""); const [sel,setSel]=useState("D-001"); const d=despachos.find(x=>x.id===sel)!;
  const rows=despachos.filter(x=>JSON.stringify(x).toLowerCase().includes(q.toLowerCase()));
  const excel=()=>{const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(despachos),"Despachos");XLSX.writeFile(wb,"despachos.xlsx");};
  const pdf=()=>{const p=new jsPDF();p.text("Comprobante de despacho - Motomundo",14,20);[`Despacho: ${d.id}`,`Manifiesto: ${d.manifiesto}`,`Placa: ${d.placa}`,`Motorista: ${d.motorista}`,`Destino: ${d.destino}`,`Anden: ${d.anden}`,`Estado: ${d.estado}`].forEach((l,i)=>p.text(l,14,35+i*8));p.save(`comprobante-${d.id}.pdf`);};
  const docs=["Manifiesto","Factura SAP F-4587","Guía G-1254","Confirmación CC-778","Inspección IF-001","Motorista ID-1258","Placa "+d.placa];
  return <div className="space-y-3"><div className="grid grid-cols-5 gap-2 text-center">{[["Pendientes",4],["En validación",7],["Listos",11],["Despachados hoy",8],["Incidencias",2]].map(([l,v])=><Card key={l}><div className="text-xs">{l}</div><b className="text-2xl">{v}</b></Card>)}</div>
  <div className="grid lg:grid-cols-2 gap-3"><Card t="LISTA DE DESPACHOS"><div className="flex gap-2 mb-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por manifiesto, placa, destino…" className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 text-sm"/><button onClick={excel} className="border border-emerald-500 text-emerald-400 px-2 rounded text-sm">Exportar Excel</button></div>
   <table className="w-full text-sm"><tbody>{rows.map(x=><tr key={x.id} onClick={()=>setSel(x.id)} className="border-t border-slate-800 cursor-pointer hover:bg-slate-800"><td>{x.id}</td><td>{x.placa}</td><td>{x.motorista}</td><td>{x.destino}</td><td>{x.anden}</td><td>{x.carg}/{x.plan}</td><td><Badge e={x.estado}/></td></tr>)}</tbody></table></Card>
  <Card t={`DETALLE DE DESPACHO · ${d.id} · ${d.placa} · ${d.motorista} · ${d.destino}`}><Badge e={d.estado}/> <span className="text-sm">Andén {d.anden} · Manifiesto {d.manifiesto}</span>
   <ul className="my-3 text-sm space-y-1">{docs.map(x=><li key={x} className="flex justify-between"><span>{x}</span><span className="text-emerald-400">✓ Validado</span></li>)}</ul>
   <div className="flex gap-2 flex-wrap"><button onClick={pdf} className="bg-blue-600 px-3 py-2 rounded">Generar comprobante de despacho</button><button onClick={()=>incidencia(d.id)} className="border border-red-500 text-red-400 px-3 py-2 rounded">Cancelar</button><button onClick={()=>liberar(d.id)} className="border border-emerald-400 text-emerald-400 px-3 py-2 rounded font-bold">Liberar vehículo</button></div></Card></div></div>; }

export function Metricas(){ const {despachos}=useOps();
  const dias=[["01/05",18],["05/05",24],["10/05",28],["15/05",32],["20/05",26],["25/05",21],["28/05",19]].map(([d,v])=>({d,v}));
  const kpis=[["Programados",120],["Despachos",108],["A tiempo","92.6%"],["Tiempo patio","1h 45m"],["Tiempo carga","1h 12m"],["Tiempo demora","2h 36m"],["Utilización andenes","78.4%"]];
  const xl=()=>{const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(despachos),"Despachos");XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(kpis.map(([k,v])=>({KPI:k,Valor:v}))),"KPIs");XLSX.writeFile(wb,"reporte.xlsx");};
  const pdf=()=>{const p=new jsPDF();p.text("Reporte general - Motomundo Amarateca",14,20);kpis.forEach(([k,v],i)=>p.text(`${k}: ${v}`,14,35+i*8));p.save("reporte-general.pdf");};
  return <div className="space-y-3"><Card><div className="flex gap-2 justify-end"><button onClick={xl} className="bg-emerald-700 px-3 py-1 rounded text-sm">Exportar Excel</button><button onClick={pdf} className="bg-blue-600 px-3 py-1 rounded text-sm">Generar PDF</button></div></Card>
  <div className="grid grid-cols-7 gap-2">{kpis.map(([k,v])=><Card key={k}><div className="text-[11px] text-slate-400">{k}</div><b className="text-xl">{v}</b></Card>)}</div>
  <div className="grid lg:grid-cols-3 gap-3"><Card t="Despachos por día"><div className="h-44"><ResponsiveContainer><BarChart data={dias}><XAxis dataKey="d"/><YAxis/><Tooltip/><RB dataKey="v" fill="#3B82F6"/></BarChart></ResponsiveContainer></div></Card>
  <Card t="Programados vs. despachados"><div className="h-44"><ResponsiveContainer><LineChart data={dias.map(x=>({...x,p:Number(x.v)+8}))}><XAxis dataKey="d"/><YAxis/><Tooltip/><Line dataKey="p" stroke="#3B82F6"/><Line dataKey="v" stroke="#10B981"/></LineChart></ResponsiveContainer></div></Card>
  <Card t="A tiempo vs. retrasados"><div className="h-44"><ResponsiveContainer><PieChart><Pie data={[{n:"A tiempo",v:92.6},{n:"Retrasados",v:7.4}]} dataKey="v" innerRadius={40} outerRadius={70}><Cell fill="#10B981"/><Cell fill="#EF4444"/></Pie></PieChart></ResponsiveContainer></div></Card></div></div>; }
