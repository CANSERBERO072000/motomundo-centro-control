create table andenes(id text primary key,placa text,carga text,destino text,entrada text,estado text default 'LIBRE',prog int default 0);
create table cargas(id text primary key,anden text,placa text,plan int,preparadas int,cargadas int);
create table demoras(n int primary key,placa text,carga text,destino text,anden text,tiempo text,causa text,resuelta boolean default false);
create table despachos(id text primary key,manifiesto text,placa text,motorista text,destino text,anden text,plan int,carg int,doc text,estado text,hora text);
create table notificaciones(id bigserial primary key,texto text,hora text);
alter publication supabase_realtime add table andenes,cargas,demoras,despachos,notificaciones;
create table rutas(placa text primary key,capacidad int,motorista text,hora text,ruta_final text,punto1 text,punto2 text);
alter publication supabase_realtime add table rutas;
