const { useEffect, useMemo, useRef, useState } = React;

// ====== MARCA LEGALHUB ======
const BRAND = { bg: "#F2F2F7", primary: "#60189C", primaryDark: "#330D53", teal: "#00B989", navy: "#172755", cyan: "#41E1F2" };
const SPECIALTIES = [
  "Gestión del Conocimiento","Alertas Judiciales","Gestión de Reclamos (Soul)","Web Scraping","Bastanteo","Automatización de Procesos","RPA","Clasificación Automática","Text-Mining","Document & Contract Automation","Legal Process Outsourcing","Legal Analytics & Dashboarding",
];
const DEFAULT_PARAMS = { objetivo:"captar leads de estudios jurídicos", audiencia:"abogados y estudios pequeños en Argentina", tono:"profesional y cercano, con autoridad", voz:"LegalHub", idioma:"es-AR", cta:"Reservá tu diagnóstico" };

function cx(...a){return a.filter(Boolean).join(" ");}

function App(){
  const [selected, setSelected] = useState(SPECIALTIES[0]);
  const [topic, setTopic] = useState("SEO local para estudios jurídicos");
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("posts");
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem("lh_key")||"");

  useEffect(()=>{
    // fonts already injected by index.html
  },[]);

  const brief = useMemo(()=> ({...params, topico:topic, especialidad:selected, marca:"LegalHub"}), [params, topic, selected]);

  // Basic template generation (works offline; no keys)
  function templated(){
    const top = brief.topico, cta = brief.cta, spec = brief.especialidad;
    const mk = (net)=>`➡️ ${top} (${spec}).\n• Más consultas calificadas\n• Procesos medibles\n• Menos tareas manuales\n${cta} #legalhub #marketinglegal #${net}`;
    const video={ title:`${top} en 60 segundos`, hook:"¿Tu estudio recibe pocas consultas de calidad?", script:`HOOK: ¿Tu estudio recibe pocas consultas de calidad?\n1) Problema: visibilidad y seguimiento.\n2) Solución: ${spec} en tu estrategia.\n3) Plan 3 pasos: SEO local + contenido útil + automatización.\nCTA: ${cta}.`, captions:["Más consultas calif.","Procesos medibles","Automatizá el funnel",cta], shots:["Plano medio","Dashboard","CTA"], broll:["Ícono balanza","Gráfico ascendente","Agenda"] };
    const podcast={ title:`${top} – LegalHub Podcast`, outline:["Introducción","Contexto del mercado",`Rol de ${spec}`,"Checklist","Cierre"], script:`Bienvenidos al podcast de LegalHub. Hoy: ${top}.`, duration_minutes:9 };
    const images=[ {name:"portada_landing", prompt:`LegalHub, portada minimal en violeta (${BRAND.primary}) y verde (${BRAND.teal}), íconos legales sutiles, estilo limpio, espacio para titular.`, negative_prompt:"manos extrañas, texto incrustado, watermark", aspect_ratio:"16:9", variantes:2}, {name:"post_carrusel", prompt:`Carrusel sobre ${top}, tipografía Poppins para títulos, acentos cian (${BRAND.cyan}) y navy (${BRAND.navy}).`, negative_prompt:"bajo contraste, artefactos", aspect_ratio:"1:1", variantes:2} ];
    const seo = { title: `${top} | LegalHub`, meta_description: `Estrategias para ${top} en estudios jurídicos.`, keywords:["marketing legal","abogados","seo jurídico","legaltech"] };
    const email = { subject: `${top} – LegalHub`, body: `Hola,\n\nTe acercamos ideas sobre ${top} y cómo ${spec} puede ayudarte.\n${cta}.\n\nSaludos,\nLegalHub` };
    return { posts:{ instagram:[mk("instagram"), mk("instagram2")], linkedin:[mk("linkedin"), mk("linkedin2")], x:[mk("x"), mk("x2")] }, video, podcast, images, seo, email };
  }

  async function generate(){
    setLoading(true); setError(""); setResult(null); setImages([]);
    try{
      // Optional: try OpenAI if user enters a key (client‑only; for demos)
      let json = null;
      if(apiKey){
        try{
          const SYSTEM = "Eres un planner de marketing legal. Devuelve JSON con {posts, video, podcast, images, seo}. Español es-AR.";
          const USER = `Brief JSON\\n${JSON.stringify(brief)}\\nTareas: 2 variantes por red; guion video ≤60s + captions; outline+guion podcast 8–10min; 2 prompts de imagen (portada_landing, post_carrusel); SEO (title, meta, keywords). Responde SOLO JSON.`;
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {"Content-Type":"application/json", Authorization:`Bearer ${apiKey}`},
            body: JSON.stringify({ model:"gpt-4o-mini", temperature:0.9, response_format:{type:"json_object"}, messages:[{role:"system", content:SYSTEM},{role:"user", content:USER}] })
          });
          if(res.ok){
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;
            if(content) json = JSON.parse(content);
          } else {
            const txt = await res.text();
            console.warn("OpenAI error:", txt);
          }
        }catch(err){ console.warn("Fallo OpenAI, uso plantillas.", err); }
      }
      if(!json) json = templated();
      setResult(json); setTab("posts");
    }catch(e){ setError(String(e)); } finally{ setLoading(false); }
  }

  function genImages(){
    if(!result?.images?.length){ setError("No hay prompts"); return; }
    setImages(result.images.map((img,i)=>({ name: img.name, url: `https://image.pollinations.ai/prompt/${encodeURIComponent(img.prompt)}?width=1024&height=1024&seed=${i}` })));
    setTab("images");
  }

  // Podcast TTS
  function speak(){ if(!result?.podcast?.script) return; const u = new SpeechSynthesisUtterance(result.podcast.script); u.lang = params.idioma?.startsWith("es")?"es-AR":"en-US"; speechSynthesis.cancel(); speechSynthesis.speak(u); }
  function stopSpeak(){ speechSynthesis.cancel(); }

  function copy(text){ navigator.clipboard.writeText(text); }
  function downloadJSON(){ const blob = new Blob([JSON.stringify(result,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="legalhub-output.json"; a.click(); URL.revokeObjectURL(url); }

  // Planner CSV & ICS
  function downloadCSV(){ if(!result?.posts) return; const today=new Date(); let d=0; const rows=[]; for(const [net,items] of Object.entries(result.posts)){ for(const text of items){ const date=new Date(today.getTime()+d*86400000); d++; rows.push({fecha:date.toISOString().slice(0,10), red:net, titulo:topic, contenido:text}); } } const header="fecha,red,titulo,contenido\n"; const csv=header+rows.map(r=>`${r.fecha},${r.red},"${r.titulo}","${r.contenido.replace(/\"/g,'\"\"')}"`).join("\n"); const blob=new Blob([csv],{type:"text/csv"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="plan-publicaciones.csv"; a.click(); URL.revokeObjectURL(url); }
  function downloadICS(){ if(!result?.posts) return; const today=new Date(); const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//LegalHub//Content Planner//ES"]; let i=0; const stamp=(dt)=>dt.toISOString().split(".")[0].replaceAll("-","").replaceAll(":","")+"Z"; for(const [net,items] of Object.entries(result.posts)){ for(const content of items){ const start=new Date(today.getTime()+i*86400000); i++; lines.push("BEGIN:VEVENT"); lines.push(`UID:${(Math.random()+1).toString(36).slice(2)}@legalhub.la`); lines.push(`DTSTAMP:${stamp(start)}`); lines.push(`DTSTART:${stamp(start)}`); lines.push(`SUMMARY:${topic} – ${net}`); lines.push(`DESCRIPTION:${content.split("\n").join("\\n")}`); lines.push("END:VEVENT"); } } lines.push("END:VCALENDAR"); const blob=new Blob([lines.join("\n")],{type:"text/calendar"}); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="agenda-legalhub.ics"; a.click(); URL.revokeObjectURL(url); }

  async function downloadPPTX(){ const { default: PptxGenJS } = await import("https://esm.run/pptxgenjs"); const pptx=new PptxGenJS(); pptx.layout="16x9"; pptx.defineSlideMaster({ title:"MASTER", background:{color:"FFFFFF"}, objects:[ {rect:{x:0,y:0,w:"100%",h:0.6,fill:BRAND.primary}}, {text:{text:"LegalHub",options:{x:0.3,y:0.15,fontFace:"Poppins",color:"FFFFFF",fontSize:18,bold:true}}} ]}); const add=(title,bullets=[])=>{ const s=pptx.addSlide({masterName:"MASTER"}); s.addText(title,{x:0.5,y:0.9,fontFace:"Poppins",fontSize:30,bold:true,color:BRAND.primary}); s.addText(bullets.map(b=>"• "+b).join("\n"),{x:0.5,y:1.6,w:9,h:4,fontFace:"Open Sans",fontSize:18,color:BRAND.navy}); }; add(result?.video?.title||topic,[brief.especialidad,brief.objetivo,brief.cta]); add("Estructura del mensaje", result?.video?.captions||[]); add("Plan de Contenidos", Object.values(result?.posts||{}).flat().slice(0,6)); add("CTA",[brief.cta]); await pptx.writeFile({fileName:"presentacion-legalhub.pptx"}); }
  async function downloadDOCX(){ const { Document, Packer, Paragraph, HeadingLevel } = await import("https://esm.run/docx"); const doc=new Document({sections:[{children:[ new Paragraph({text:"Propuesta – LegalHub",heading:HeadingLevel.HEADING_1}), new Paragraph({text:`Tópico: ${topic}`}), new Paragraph({text:`Especialidad: ${brief.especialidad}`}), new Paragraph({text:"Objetivo"}), new Paragraph({text:brief.objetivo}), new Paragraph({text:"Beneficios"}), new Paragraph({text:"• Más consultas calificadas"}), new Paragraph({text:"• Procesos medibles"}), new Paragraph({text:"• Automatización"}), new Paragraph({text:"CTA"}), new Paragraph({text:brief.cta}), ]} ]}); const blob=await Packer.toBlob(doc); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="propuesta-legalhub.docx"; a.click(); URL.revokeObjectURL(url); }

  const tools=[
    {icon:'📱',title:'Contenido Multimedia',desc:'Crea posteos, videos y podcasts de forma unificada',action:()=>setTab('posts')},
    {icon:'📊',title:'Excel de Publicaciones',desc:'Organiza y planifica tus publicaciones',action:()=>result?setTab('planner'):alert('Generá contenido primero')},
    {icon:'📝',title:'Generación de Propuestas',desc:'Crea propuestas y presupuestos',action:()=>result?downloadDOCX():alert('Generá contenido primero')},
    {icon:'📽️',title:'Presentaciones',desc:'Slides impactantes para demos',action:()=>result?downloadPPTX():alert('Generá contenido primero')},
    {icon:'🎨',title:'Branding',desc:'Guías de identidad visual',action:()=>setTab('branding')},
    {icon:'📧',title:'Email Marketing & CRM',desc:'Conecta con tus contactos',action:()=>setTab('email')},
    {icon:'🔍',title:'Herramientas SEO',desc:'Optimiza tu presencia en buscadores',action:()=>setTab('seo')},
    {icon:'📈',title:'Medidor de Alcance',desc:'Evalúa el impacto de tus publicaciones',action:()=>result?setTab('reach'):alert('Generá contenido primero')},
    {icon:'🚀',title:'Apollo Legal',desc:'Prospección automática de clientes',action:()=>window.open('https://legalhub.la','_blank')},
    {icon:'🗓️',title:'Agenda',desc:'Planifica tu estrategia de contenido legal',action:()=>result?setTab('planner'):alert('Generá contenido primero')}
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 backdrop-blur border-b bg-white/80">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl" style={{background:BRAND.primary,color:"white"}}>LH</span>
            <div><h1 className="text-xl font-bold" style={{color:BRAND.primaryDark}}>LegalHub – Marketing Intelligence</h1><p className="text-xs text-gray-600 -mt-0.5">Profesional • Innovador • Cercano • Claro</p></div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <input type="password" placeholder="(opcional) OpenAI API Key" className="w-64 px-3 py-2 rounded-xl border" value={apiKey} onChange={e=>setApiKey(e.target.value)} />
            <button onClick={()=>localStorage.setItem("lh_key", apiKey)} className="px-3 py-2 rounded-xl text-white" style={{background:BRAND.teal}}>Guardar</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <ToolsGrid tools={tools} />
        <section className="rounded-3xl p-6" style={{background:`linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.teal} 100%)`, color:"white"}}>
          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-bold">Agente de Marketing Inteligente</h2>
            <p className="text-sm text-white/90">Generá posteos, guiones de video, podcast, agenda, presentaciones y propuestas con un brief.</p>
            <div className="grid md:grid-cols-4 gap-3">
              <div className="space-y-2"><label className="text-sm font-medium">Especialidad</label><select className="w-full px-3 py-2 rounded-xl text-black" value={selected} onChange={e=>setSelected(e.target.value)}>{SPECIALTIES.map(s=>(<option key={s} value={s}>{s}</option>))}</select></div>
              <div className="space-y-2 md:col-span-1"><label className="text-sm font-medium">Tópico</label><input className="w-full px-3 py-2 rounded-xl text-black" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="SEO local para estudios jurídicos"/></div>
              <div className="space-y-2"><label className="text-sm font-medium">Audiencia</label><input className="w-full px-3 py-2 rounded-xl text-black" value={params.audiencia} onChange={e=>setParams({...params,audiencia:e.target.value})}/></div>
              <div className="space-y-2"><label className="text-sm font-medium">CTA</label><input className="w-full px-3 py-2 rounded-xl text-black" value={params.cta} onChange={e=>setParams({...params,cta:e.target.value})}/></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={generate} disabled={loading} className="px-4 py-2 rounded-2xl bg-white text-black hover:opacity-90 disabled:opacity-50">{loading?"Generando…":"Generar Contenido"}</button>
              <button onClick={genImages} disabled={loading || !result} className="px-4 py-2 rounded-2xl" style={{background:BRAND.cyan, color:'#0b1120'}}>Generar Imágenes</button>
              {result && (<>
                <button onClick={downloadJSON} className="px-4 py-2 rounded-2xl bg-black/80 text-white">Descargar JSON</button>
                <button onClick={downloadCSV} className="px-4 py-2 rounded-2xl bg-white text-black">Plan CSV</button>
                <button onClick={downloadICS} className="px-4 py-2 rounded-2xl bg-white text-black">Agenda ICS</button>
                <button onClick={downloadPPTX} className="px-4 py-2 rounded-2xl bg-white text-black">Presentación PPTX</button>
                <button onClick={downloadDOCX} className="px-4 py-2 rounded-2xl bg-white text-black">Propuesta DOCX</button>
              </>)}
            </div>
            {error && <p className="text-sm" style={{color:'#FFE4E6'}}>{error}</p>}
          </div>
        </section>

        <div className="rounded-2xl shadow bg-white">
          <div className="border-b px-4 pt-4">
            <div className="flex flex-wrap gap-2">
                {[['posts','Posteos'],['video','Video'],['podcast','Podcast'],['images','Imágenes'],['seo','SEO'],['email','Email'],['branding','Branding'],['reach','Alcance'],['planner','Agenda'],['brief','Brief JSON']].map(([v,l])=>(
                <button key={v} onClick={()=>setTab(v)} className={cx('px-3 py-2 rounded-t-xl text-sm', tab===v?'text-white':'hover:bg-gray-100')} style={tab===v?{background:BRAND.primary}:{}}>{l}</button>
              ))}
            </div>
          </div>
          <div className="p-4">
            {tab==='posts' && <PostsTab result={result}/>}
            {tab==='video' && <VideoTab result={result}/>}
            {tab==='podcast' && <PodcastTab result={result} speak={speak} stopSpeak={stopSpeak}/>}
            {tab==='images' && <ImagesTab result={result} images={images}/>}
            {tab==='seo' && <SEOTab result={result} topic={topic}/>}
            {tab==='email' && <EmailTab result={result}/>}
            {tab==='branding' && <BrandingTab/>}
            {tab==='reach' && <ReachTab result={result}/>}
            {tab==='planner' && <PlannerTab result={result} downloadCSV={downloadCSV} downloadICS={downloadICS}/>}
            {tab==='brief' && <Card title="Brief enviado al agente"><pre className="text-xs whitespace-pre-wrap">{JSON.stringify(brief,null,2)}</pre></Card>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({title, children}){ return <div className="bg-white rounded-2xl shadow p-4">{title && <h4 className="font-semibold mb-2" style={{color:BRAND.navy}}>{title}</h4>}<div className="prose prose-sm max-w-none">{children}</div></div>; }
function Placeholder(){ return <div className="text-sm text-gray-500">Generá contenido con el botón "Generar Contenido" para ver resultados aquí.</div>; }
function PostBlock({title, items}){ return <Card title={title}>{(!items||items.length===0)&&<p className="text-sm text-gray-500">No hay contenido generado.</p>}<div className="space-y-3">{items?.map((c,i)=>(<div key={i} className="rounded-xl border p-3 bg-gray-50"><div className="flex items-center justify-between gap-2 mb-2"><div className="text-sm font-medium">Variante {i+1}</div><button onClick={()=>navigator.clipboard.writeText(c)} className="px-3 py-1.5 rounded-xl text-white" style={{background:BRAND.primary}}>Copiar</button></div><pre className="whitespace-pre-wrap text-sm leading-6">{c}</pre></div>))}</div></Card>; }
function PostsTab({result}){ return <div className="space-y-6">{!result&&<Placeholder/>}{result&&(<><PostBlock title="Instagram" items={result.posts?.instagram||[]}/><PostBlock title="LinkedIn" items={result.posts?.linkedin||[]}/><PostBlock title="X" items={result.posts?.x||[]}/></>)}</div>; }

function Teleprompter({text}){ const [speed,setSpeed]=useState(1.5); const [run,setRun]=useState(false); const boxRef=useRef(null); useEffect(()=>{let raf; const step=()=>{ if(run&&boxRef.current) boxRef.current.scrollTop += speed; raf=requestAnimationFrame(step); }; raf=requestAnimationFrame(step); return()=>cancelAnimationFrame(raf);},[run,speed]); return (<div><div className="flex items-center gap-2 mb-2"><button onClick={()=>setRun(!run)} className="px-3 py-1.5 rounded-xl" style={{background:BRAND.teal,color:'white'}}>{run?"Pausar":"Reproducir"}</button><label className="text-sm">Velocidad <input type="range" min="0" max="5" step="0.1" value={speed} onChange={e=>setSpeed(parseFloat(e.target.value))} className="ml-2"/></label><button onClick={()=>navigator.clipboard.writeText(text)} className="px-3 py-1.5 rounded-xl bg-white border">Copiar guion</button></div><div ref={boxRef} className="h-72 rounded-xl border bg-black text-green-200 p-6 overflow-auto"><div className="min-h-full text-xl leading-[2.2rem] font-medium select-none">{(text||'').split('\\n\\n').map((p,i)=>(<p key={i} className="mb-6">{p}</p>))}</div></div></div>); }
function SRTExporter({captions}){ const srt=(captions||[]).map((c,i)=>`${i+1}\n00:00:${String(i*2).padStart(2,'0')},000 --> 00:00:${String((i+1)*2).padStart(2,'0')},000\n${c}\n`).join('\\n'); const download=()=>{ const blob=new Blob([srt],{type:'text/plain'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='subtitulos.srt'; a.click(); URL.revokeObjectURL(url); }; return (<div className="flex items-center gap-2"><button onClick={()=>navigator.clipboard.writeText(srt)} className="px-3 py-1.5 rounded-xl text-white" style={{background:BRAND.primary}}>Copiar SRT</button><button onClick={download} className="px-3 py-1.5 rounded-xl bg-black text-white">Descargar SRT</button></div>); }
function VideoTab({result}){ return <div className="space-y-4">{!result&&<Placeholder/>}{result&&(<><h3 className="text-lg font-semibold" style={{color:BRAND.navy}}>{result.video?.title}</h3><div className="grid md:grid-cols-2 gap-4"><Card title="Hook">{result.video?.hook}</Card><Card title="Subtítulos sugeridos"><ul className="list-disc pl-5 space-y-1">{(result.video?.captions||[]).map((c,i)=>(<li key={i}>{c}</li>))}</ul></Card></div><Card title="Guion (Teleprompter)"><Teleprompter text={result.video?.script||""}/></Card><div className="grid md:grid-cols-2 gap-4"><Card title="Planos / Shots"><ol className="list-decimal pl-5 space-y-1">{(result.video?.shots||[]).map((s,i)=>(<li key={i}>{s}</li>))}</ol></Card><Card title="B‑roll sugerido"><ul className="list-disc pl-5 space-y-1">{(result.video?.broll||[]).map((b,i)=>(<li key={i}>{b}</li>))}</ul></Card></div><SRTExporter captions={(result.video?.captions||[])} /></>)} </div>; }
function PodcastTab({result, speak, stopSpeak}){ return <div className="space-y-4">{!result&&<Placeholder/>}{result&&(<><h3 className="text-lg font-semibold" style={{color:BRAND.navy}}>{result.podcast?.title}</h3><Card title="Outline"><ol className="list-decimal pl-5 space-y-1">{(result.podcast?.outline||[]).map((o,i)=>(<li key={i}>{o}</li>))}</ol></Card><Card title="Guion completo"><div className="flex flex-wrap gap-2 mb-2"><button onClick={()=>navigator.clipboard.writeText(result.podcast?.script||'')} className="px-3 py-1.5 rounded-xl text-white" style={{background:BRAND.primary}}>Copiar</button><button onClick={speak} className="px-3 py-1.5 rounded-xl" style={{background:BRAND.teal,color:'white'}}>Reproducir (TTS)</button><button onClick={stopSpeak} className="px-3 py-1.5 rounded-xl bg-red-600 text-white">Detener</button></div><pre className="whitespace-pre-wrap text-sm leading-6">{result.podcast?.script}</pre></Card></>)} </div>; }
function ImagesTab({result, images}){ return <div className="space-y-6">{!result&&<Placeholder/>}{result&&(<><Card title="Prompts de imagen"><div className="space-y-3">{(result.images||[]).map((img,i)=>(<div key={i} className="rounded-xl border p-3 bg-gray-50"><div className="flex flex-wrap items-center justify-between gap-2 mb-2"><div className="text-sm font-medium">{img.name} <span className="text-gray-500">({img.aspect_ratio})</span></div><button onClick={()=>navigator.clipboard.writeText(img.prompt)} className="px-3 py-1.5 rounded-xl text-white" style={{background:BRAND.primary}}>Copiar prompt</button></div><p className="text-sm mb-1"><span className="font-semibold">Prompt:</span> {img.prompt}</p><p className="text-xs text-gray-600"><span className="font-semibold">Negative:</span> {img.negative_prompt}</p></div>))}</div></Card>{images?.length>0&&(<Card title="Imágenes generadas (Pollinations)"><div className="grid md:grid-cols-3 gap-4">{images.map((im,idx)=>(<figure key={idx} className="rounded-2xl overflow-hidden border"><img src={im.url} alt={im.name} className="w-full h-auto"/><figcaption className="p-2 text-sm text-center">{im.name}</figcaption></figure>))}</div></Card>)}</>)}</div>; }
function SEOTab({result, topic}){ const schema={"@context":"https://schema.org","@type":"WebSite",name:"LegalHub Marketing",url:"https://legalhub.la",potentialAction:{"@type":"SearchAction",target:"https://legalhub.la/?q={search_term}","query-input":"required name=search_term"},about:topic}; return <div className="space-y-4">{!result&&<Placeholder/>}{result&&(<><Card title="SEO Title">{result.seo?.title}</Card><Card title="Meta Description">{result.seo?.meta_description}</Card><Card title="Keywords"><div className="flex flex-wrap gap-2">{(result.seo?.keywords||[]).map((k,i)=>(<span key={i} className="px-2 py-1 rounded-full text-xs" style={{background:'#EDE9FE',color:'#4C1D95'}}>{k}</span>))}</div></Card><Card title="Schema.org (JSON‑LD)"><pre className="text-xs whitespace-pre-wrap">{JSON.stringify(schema,null,2)}</pre><button onClick={()=>navigator.clipboard.writeText(JSON.stringify(schema))} className="mt-2 px-3 py-1.5 rounded-xl text-white" style={{background:BRAND.primary}}>Copiar JSON‑LD</button></Card></>)} </div>; }

function EmailTab({result}){
  if(!result) return <Placeholder/>;
  return (
    <div className="space-y-4">
      <Card title="Asunto">{result.email?.subject}</Card>
      <Card title="Cuerpo">
        <div className="flex gap-2 mb-2">
          <button onClick={()=>navigator.clipboard.writeText(result.email?.body||'')} className="px-3 py-1.5 rounded-xl text-white" style={{background:BRAND.primary}}>Copiar</button>
        </div>
        <pre className="whitespace-pre-wrap text-sm leading-6">{result.email?.body}</pre>
      </Card>
    </div>
  );
}

function BrandingTab(){
  return (
    <div className="space-y-4">
      <Card title="Colores">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(BRAND).map(([k,v])=> (
            <div key={k} className="flex items-center gap-2">
              <span className="inline-block w-6 h-6 rounded" style={{background:v}}></span>
              <span className="text-sm">{k}: {v}</span>
              <button onClick={()=>navigator.clipboard.writeText(v)} className="ml-auto px-2 py-1 text-xs rounded bg-white border">Copiar</button>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Tipografías"><p className="text-sm">Poppins (títulos) y Open Sans (texto)</p></Card>
    </div>
  );
}

function ReachTab({result}){
  if(!result) return <Placeholder/>;
  const posts = Object.values(result.posts||{}).flat();
  const totalChars = posts.reduce((s,p)=>s+p.length,0);
  const totalPosts = posts.length;
  const estReach = totalChars*10;
  return (
    <div className="space-y-4">
      <Card title="Métricas">
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Posteos totales: {totalPosts}</li>
          <li>Caracteres totales: {totalChars}</li>
          <li>Alcance estimado: {estReach}</li>
        </ul>
      </Card>
    </div>
  );
}

function PlannerTab({result, downloadCSV, downloadICS}){
  if(!result) return <Placeholder/>;
  const today = new Date();
  let i = 0;
  const rows = [];
  for(const [net,items] of Object.entries(result.posts||{})){
    for(const text of items){
      const date = new Date(today.getTime()+i*86400000);
      rows.push({date:date.toISOString().slice(0,10), net, text});
      i++;
    }
  }
  return (
    <div className="space-y-4">
      <Card title="Calendario de publicaciones">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead><tr><th className="text-left p-1">Fecha</th><th className="text-left p-1">Red</th><th className="text-left p-1">Contenido</th></tr></thead>
            <tbody>
              {rows.map((r,idx)=>(<tr key={idx} className="odd:bg-gray-50"><td className="p-1">{r.date}</td><td className="p-1 capitalize">{r.net}</td><td className="p-1">{r.text.slice(0,60)}...</td></tr>))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 mt-2">
          <button onClick={downloadCSV} className="px-3 py-1.5 rounded-xl bg-white border">Descargar CSV</button>
          <button onClick={downloadICS} className="px-3 py-1.5 rounded-xl bg-white border">Descargar ICS</button>
        </div>
      </Card>
    </div>
  );
}

function ToolCard({icon,title,desc,action}){
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl" style={{background:BRAND.primary,color:'white'}}>{icon}</div>
      <h3 className="font-semibold mb-1 text-center" style={{color:BRAND.navy}}>{title}</h3>
      <p className="text-sm text-gray-600 flex-1 text-center">{desc}</p>
      <button onClick={action} className="mt-4 px-4 py-2 rounded-xl text-white" style={{background:BRAND.teal}}>Comenzar</button>
    </div>
  );
}

function ToolsGrid({tools}){
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4" style={{color:BRAND.navy}}>Herramientas</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t,i)=>(<ToolCard key={i} {...t}/>))}
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
