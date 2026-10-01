export type Estado = "LIBRE"|"LISTO"|"DOC"|"ESPERA"|"CARGANDO"|"RETRASO"|"DEMORA";
export const COLOR: Record<string,string> = { LIBRE:"#10B981",DESPACHADO:"#10B981",COMPLETA:"#10B981",LISTO:"#3B82F6",DOC:"#3B82F6","EN VALIDACION":"#3B82F6",CARGANDO:"#F59E0B",DEMORA:"#EF4444",ESPERA:"#94A3B8",RETRASO:"#EF4444","CON INCIDENCIA":"#EF4444" };
export type Anden = { id:string; placa:string|null; carga:string|null; destino:string|null; entrada:string|null; estado:Estado; prog:number };
export type Despacho = { id:string; manifiesto:string; placa:string; motorista:string; destino:string; anden:string; plan:number; carg:number; doc:string; estado:string; hora:string };
export type Demora = { n:number; placa:string; carga:string; destino:string; anden:string; tiempo:string; causa:string; resuelta:boolean };
export type Notif = { id:number; texto:string; hora:string };
const libre=(id:string):Anden=>({id,placa:null,carga:null,destino:null,entrada:null,estado:"LIBRE",prog:0});
export const ANDENES: Anden[] = [libre("A01"),
 {id:"A02",placa:"JDI2023",carga:"C-085",destino:"OC",entrada:"09:15 AM",estado:"LISTO",prog:75},
 {id:"A03",placa:"PDC1845",carga:"C-086",destino:"BA",entrada:"09:45 AM",estado:"DOC",prog:45},
 {id:"A04",placa:"HJK7788",carga:"C-087",destino:"SPS",entrada:"10:10 AM",estado:"ESPERA",prog:20},
 libre("A05"),libre("A06"),libre("A07"),libre("A08")];
const D=(i:number,p:string,m:string,d:string,a:string,pl:number,c:number,doc:string,e:string,h:string):Despacho=>({id:`D-00${i}`,manifiesto:`M-00${i}`,placa:p,motorista:m,destino:d,anden:a,plan:pl,carg:c,doc,estado:e,hora:h});
export const DESPACHOS: Despacho[] = [
 D(1,"HAA-4567","Juan Pérez","SPS","A01",30,30,"Completa","LISTO","11:00 AM"),D(2,"JDI2023","Carlos López","OC","A02",20,18,"Pendiente","EN VALIDACION","11:30 AM"),
 D(3,"PDC1845","Luis García","BA","A03",15,10,"Incompleta","DOC","12:00 PM"),D(4,"HJK7788","Roberto Díaz","SPS","A04",18,18,"Completa","LISTO","01:00 PM"),
 D(5,"QWE2371","Andrés Rivas","OC","A05",28,25,"Completa","EN VALIDACION","01:30 PM"),D(6,"RTY5643","Diego Torres","BA","A06",22,20,"Faltan docs","CON INCIDENCIA","02:00 PM")];
export const DEMORAS: Demora[] = [
 ["HAA-4567","C-085","OC","A02","01:15","Revisión documental"],["PDC1845","C-086","BA","A03","00:45","Carga incompleta"],["HJK7788","C-087","SPS","A04","00:20","Espera en patio"],
 ["JDA3940","C-090","OC","A05","00:35","Trámite aduanal"],["TCB1639","C-091","BA","A06","00:50","Falla en equipo"],["QWE2371","C-092","SPS","A07","00:25","Congestión vial"],["RTY5643","C-093","OC","A08","00:40","Documentación"]
].map((r,i)=>({n:i+1,placa:r[0],carga:r[1],destino:r[2],anden:r[3],tiempo:r[4],causa:r[5],resuelta:false}));
