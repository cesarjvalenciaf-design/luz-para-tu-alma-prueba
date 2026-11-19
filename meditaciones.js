// Módulo aislado: no modifica Escuela Bíblica, Música ni Administración.
// Los textos publicados en Supabase, categoría Meditación, se reutilizan aquí.
const MEDITACIONES_AUDIOS = [
 {numero:9,titulo:'El hombre que construyó un puente',ref:'Gálatas 6:9',archivo:'audios/meditacion-09.mp3'},
 {numero:10,titulo:'El cántaro agrietado',ref:'Zacarías 4:10',archivo:'audios/meditacion-10.mp3'}
];
let medActual=null;
function medNormalizar(t){return String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function medBuscarPublicacion(titulo){return (typeof items!=='undefined'?items:[]).find(x=>categoriaFiltro(x.category)==='meditaciones'&&medNormalizar(x.title)===medNormalizar(titulo));}
function abrirMeditaciones(){show('meditaciones');renderMeditaciones();}
function renderMeditaciones(){
 const cont=document.getElementById('meditacionesLista');if(!cont)return;
 cont.replaceChildren();
 const audios=MEDITACIONES_AUDIOS.map(x=>({...x,post:medBuscarPublicacion(x.titulo)}));
 const otros=(typeof items!=='undefined'?items:[]).filter(x=>categoriaFiltro(x.category)==='meditaciones'&&!audios.some(a=>a.post?.id===x.id)).map(x=>({titulo:x.title,ref:x.ref,post:x}));
 const lista=[...audios,...otros];
 if(!lista.length){cont.textContent='Todavía no hay meditaciones publicadas.';return;}
 for(const m of lista){
   const card=document.createElement('div');card.className='card';
   const subt=document.createElement('small');subt.textContent=(m.numero?'Meditación '+m.numero+' · ':'')+(m.ref||'');
   const h=document.createElement('h3');h.textContent=m.titulo;
   const btn=document.createElement('button');btn.textContent='Escuchar / Leer';btn.onclick=()=>abrirMeditacion(m);
   card.append(subt,h,btn);cont.append(card);
 }
}
function abrirMeditacion(m){
 medActual=m;const d=document.getElementById('meditacionDetalle');d.replaceChildren();d.classList.remove('hide');
 const titulo=document.createElement('h2');titulo.textContent=m.titulo;
 const ref=document.createElement('p');ref.className='muted';ref.textContent=m.ref||'';
 const tabs=document.createElement('div');tabs.className='med-opciones';
 const escuchar=document.createElement('button'),leer=document.createElement('button');
 escuchar.textContent='🎧 Escuchar';leer.textContent='📖 Leer';tabs.append(escuchar,leer);
 const contenido=document.createElement('div');
 function modo(tipo){
  escuchar.setAttribute('aria-pressed',String(tipo==='audio'));leer.setAttribute('aria-pressed',String(tipo==='texto'));
  contenido.replaceChildren();
  if(tipo==='audio'){
   if(!m.archivo){contenido.textContent='Este audio todavía no está disponible.';return;}
   const a=document.createElement('audio');a.controls=true;a.preload='metadata';a.className='med-audio';a.src=m.archivo;
   const p=document.createElement('p');p.textContent='Narración musicalizada';
   const link=document.createElement('a');link.className='med-descarga';link.href=m.archivo;link.download='';link.textContent='⬇ Guardar MP3';
   contenido.append(p,a,link);
  }else{
   const post=m.post||medBuscarPublicacion(m.titulo);
   if(!post?.body){contenido.textContent='El texto completo todavía no está publicado. Puedes incorporarlo desde Administración, en la categoría Meditación, usando este mismo título.';return;}
   const lectura=document.createElement('div');lectura.className='med-lectura';lectura.textContent=post.body;contenido.append(lectura);
  }
 }
 escuchar.onclick=()=>modo('audio');leer.onclick=()=>modo('texto');
 d.append(titulo,ref,tabs,contenido);modo(m.archivo?'audio':'texto');d.scrollIntoView({behavior:'smooth',block:'start'});
}
// Si la biblioteca termina de cargar después de abrir la sección, actualizar la lista.
window.addEventListener('online',()=>{if(!document.getElementById('meditaciones')?.classList.contains('hide'))renderMeditaciones()});
