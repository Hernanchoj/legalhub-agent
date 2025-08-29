const { useEffect, useMemo, useState } = React;

// ====== MARCA LEGALHUB ======
const BRAND = {
  bg: "#F2F2F7",
  primary: "#60189C",
  primaryDark: "#330D53",
  teal: "#00B989",
  navy: "#172755",
  cyan: "#41E1F2"
};

const SPECIALTIES = [
  "Gestión del Conocimiento",
  "Alertas Judiciales",
  "Gestión de Reclamos (Soul)",
  "Web Scraping",
  "Bastanteo",
  "Automatización de Procesos",
  "RPA",
  "Clasificación Automática",
  "Text-Mining",
  "Document & Contract Automation",
  "Legal Process Outsourcing",
  "Legal Analytics & Dashboarding"
];

const DEFAULT_PARAMS = {
  objetivo: "captar leads de estudios jurídicos",
  audiencia: "abogados y estudios pequeños en Argentina",
  tono: "profesional y cercano, con autoridad",
  voz: "LegalHub",
  idioma: "es-AR",
  cta: "Reservá tu diagnóstico"
};

function App() {
  const [selected, setSelected] = useState(SPECIALTIES[0]);
  const [topic, setTopic] = useState("");
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [apiKey, setApiKey] = useState(localStorage.getItem("lh_key") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
 codex/remove-unwanted-initial-appearance-me40hy
  const [activeTool, setActiveTool] = useState(null);
  const [contentType, setContentType] = useState("");
  const [platform, setPlatform] = useState("");
  const [format, setFormat] = useState("");
  const [extra, setExtra] = useState("");

  const [images, setImages] = useState([]);
  const [apiKey, setApiKey] = useState(localStorage.getItem("lh_key")||"");
  const [showAgent, setShowAgent] = useState(false);
 main

  useEffect(() => {
    // fonts already injected by index.html
  }, []);

  const brief = useMemo(
    () => ({
      ...params,
      topico: topic,
      especialidad: selected,
      tipo: contentType,
      plataforma: platform,
      formato: format,
      extra,
      marca: "LegalHub"
    }),
    [params, topic, selected, contentType, platform, format, extra]
  );

  function templated() {
    const top = brief.topico;
    const spec = brief.especialidad;
    const cta = brief.cta;
    const mk = net =>
      `➡️ ${top} (${spec}).\n• Más consultas calificadas\n• Procesos medibles\n• Menos tareas manuales\n${cta} #legalhub #marketinglegal #${net}`;
    return {
      posts: {
        instagram: [mk("instagram"), mk("instagram2")],
        linkedin: [mk("linkedin"), mk("linkedin2")],
        x: [mk("x"), mk("x2")]
      }
    };
  }

  async function generate() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      let json = null;
      if (apiKey) {
        try {
          const SYSTEM =
            "Eres un agente de marketing legal con más de 15 años de experiencia. Genera publicaciones creativas. Devuelve JSON con {posts}. Español es-AR.";
          const USER = `Brief JSON\n${JSON.stringify(
            brief
          )}\nTareas: 2 variantes por red. Responde SOLO JSON.`;
          const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              temperature: 0.9,
              response_format: { type: "json_object" },
              messages: [{ role: "system", content: SYSTEM }, { role: "user", content: USER }]
            })
          });
          if (res.ok) {
            const data = await res.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) json = JSON.parse(content);
          } else {
            const txt = await res.text();
            console.warn("OpenAI error:", txt);
          }
        } catch (err) {
          console.warn("Fallo OpenAI, uso plantillas.", err);
        }
      }
      if (!json) json = templated();
      setResult(json);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

codex/remove-unwanted-initial-appearance-me40hy
  const tools = [
    {
      icon: "📱",
      title: "Contenido Multimedia",
      desc: "Crea posteos, videos y podcasts de forma unificada",
      action: () => setActiveTool("contenido")
    },
    {
      icon: "📊",
      title: "Excel de Publicaciones",
      desc: "Organiza y planifica tus publicaciones",
      action: () => setActiveTool("excel")
    },
    {
      icon: "📝",
      title: "Generación de Propuestas",
      desc: "Crea propuestas y presupuestos",
      action: () => setActiveTool("propuestas")
    },
    {
      icon: "📽️",
      title: "Presentaciones",
      desc: "Slides impactantes para demos",
      action: () => setActiveTool("presentaciones")
    },
    {
      icon: "🎨",
      title: "Branding",
      desc: "Guías de identidad visual",
      action: () => setActiveTool("branding")
    },
    {
      icon: "📧",
      title: "Email Marketing & CRM",
      desc: "Conecta con tus contactos",
      action: () => setActiveTool("email")
    },
    {
      icon: "🔍",
      title: "Herramientas SEO",
      desc: "Optimiza tu presencia en buscadores",
      action: () => setActiveTool("seo")
    },
    {
      icon: "📈",
      title: "Medidor de Alcance",
      desc: "Evalúa el impacto de tus publicaciones",
      action: () => setActiveTool("alcance")
    },
    {
      icon: "🚀",
      title: "Apollo Legal",
      desc: "Prospección automática de clientes",
      action: () => window.open("https://legalhub.la", "_blank")
    },
    {
      icon: "🗓️",
      title: "Agenda",
      desc: "Planifica tu estrategia de contenido legal",
      action: () => setActiveTool("agenda")
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
    {icon:'📱',title:'Contenido Multimedia',desc:'Crea posteos, videos y podcasts de forma unificada',action:()=>{ setShowAgent(true); setTab('posts'); }},
    {icon:'📊',title:'Excel de Publicaciones',desc:'Organiza y planifica tus publicaciones',action:()=>{ setShowAgent(true); setTab('planner'); }},
    {icon:'📝',title:'Generación de Propuestas',desc:'Crea propuestas y presupuestos',action:()=>{ setShowAgent(true); }},
    {icon:'📽️',title:'Presentaciones',desc:'Slides impactantes para demos',action:()=>{ setShowAgent(true); }},
    {icon:'🎨',title:'Branding',desc:'Guías de identidad visual',action:()=>{ setShowAgent(true); setTab('branding'); }},
    {icon:'📧',title:'Email Marketing & CRM',desc:'Conecta con tus contactos',action:()=>{ setShowAgent(true); setTab('email'); }},
    {icon:'🔍',title:'Herramientas SEO',desc:'Optimiza tu presencia en buscadores',action:()=>{ setShowAgent(true); setTab('seo'); }},
    {icon:'📈',title:'Medidor de Alcance',desc:'Evalúa el impacto de tus publicaciones',action:()=>{ setShowAgent(true); setTab('reach'); }},
    {icon:'🚀',title:'Apollo Legal',desc:'Prospección automática de clientes',action:()=>window.open('https://legalhub.la','_blank')},
    {icon:'🗓️',title:'Agenda',desc:'Planifica tu estrategia de contenido legal',action:()=>{ setShowAgent(true); setTab('planner'); }}
 main
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 backdrop-blur border-b bg-white/80">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: BRAND.primary, color: "white" }}
            >
              LH
            </span>
            <h1 className="text-xl font-bold" style={{ color: BRAND.primaryDark }}>
              LegalHub – Marketing Intelligence
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <input
              type="password"
              placeholder="(opcional) OpenAI API Key"
              className="w-64 px-3 py-2 rounded-xl border"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <button
              onClick={() => localStorage.setItem("lh_key", apiKey)}
              className="px-3 py-2 rounded-xl text-white"
              style={{ background: BRAND.teal }}
            >
              Guardar
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
 codex/remove-unwanted-initial-appearance-me40hy
        {!activeTool && <ToolsGrid tools={tools} />}
        {activeTool && (
          <ToolConfig
            onClose={() => setActiveTool(null)}
            selected={selected}
            setSelected={setSelected}
            topic={topic}
            setTopic={setTopic}
            params={params}
            setParams={setParams}
            contentType={contentType}
            setContentType={setContentType}
            platform={platform}
            setPlatform={setPlatform}
            format={format}
            setFormat={setFormat}
            extra={extra}
            setExtra={setExtra}
            generate={generate}
            loading={loading}
            result={result}
            error={error}
          />
        )}
      </div>
    </div>
  );
}

function ToolConfig({
  onClose,
  selected,
  setSelected,
  topic,
  setTopic,
  params,
  setParams,
  contentType,
  setContentType,
  platform,
  setPlatform,
  format,
  setFormat,
  extra,
  setExtra,
  generate,
  loading,
  result,
  error
}) {
  const suggestions = useMemo(() => {
    const best = {
      instagram: "11AM-1PM, 7PM-9PM",
      linkedin: "9AM-12PM, 1PM-3PM",
      x: "5PM-7PM"
    };
    return {
      hook: `¿Sabías que ${topic || "tu estudio"}?`,
      valor: `${selected} puede ayudarte a ${params.objetivo}`,
      cta: params.cta,
      hashtags: [
        "legalhub",
        "marketinglegal",
        selected.replace(/\s+/g, "").toLowerCase()
      ],
      horarios: best[platform] || "—"
    };
  }, [topic, selected, params, platform]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold" style={{ color: BRAND.navy }}>
          Configuración de Contenido
        </h2>
        <button
          onClick={onClose}
          className="text-sm px-2 py-1 rounded bg-gray-200"
        >
          Volver
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo de Contenido</label>
              <select
                className="w-full px-3 py-2 rounded-xl"
                value={contentType}
                onChange={e => setContentType(e.target.value)}
              >
                <option value="">Seleccione un tipo</option>
                <option value="post">Post</option>
                <option value="video">Video</option>
                <option value="podcast">Podcast</option>
              </select>

        {showAgent && (
          <>
        <section className="rounded-3xl p-6" style={{background:`linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.teal} 100%)`, color:"white"}}>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Agente de Marketing Inteligente</h2>
              <button onClick={()=>setShowAgent(false)} className="text-sm px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30">Cerrar</button>
            </div>
            <p className="text-sm text-white/90">Generá posteos, guiones de video, podcast, agenda, presentaciones y propuestas con un brief.</p>
            <div className="grid md:grid-cols-4 gap-3">
              <div className="space-y-2"><label className="text-sm font-medium">Especialidad</label><select className="w-full px-3 py-2 rounded-xl text-black" value={selected} onChange={e=>setSelected(e.target.value)}>{SPECIALTIES.map(s=>(<option key={s} value={s}>{s}</option>))}</select></div>
              <div className="space-y-2 md:col-span-1"><label className="text-sm font-medium">Tópico</label><input className="w-full px-3 py-2 rounded-xl text-black" value={topic} onChange={e=>setTopic(e.target.value)} placeholder="SEO local para estudios jurídicos"/></div>
              <div className="space-y-2"><label className="text-sm font-medium">Audiencia</label><input className="w-full px-3 py-2 rounded-xl text-black" value={params.audiencia} onChange={e=>setParams({...params,audiencia:e.target.value})}/></div>
              <div className="space-y-2"><label className="text-sm font-medium">CTA</label><input className="w-full px-3 py-2 rounded-xl text-black" value={params.cta} onChange={e=>setParams({...params,cta:e.target.value})}/></div>
 main
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Plataforma</label>
              <select
                className="w-full px-3 py-2 rounded-xl"
                value={platform}
                onChange={e => setPlatform(e.target.value)}
              >
                <option value="">Seleccione plataforma</option>
                <option value="instagram">Instagram</option>
                <option value="linkedin">LinkedIn</option>
                <option value="x">X</option>
              </select>
            </div>
          </div>
 codex/remove-unwanted-initial-appearance-me40hy

          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">Especialidad Legal Hub</label>
              <select
                className="w-full px-3 py-2 rounded-xl"
                value={selected}
                onChange={e => setSelected(e.target.value)}
              >
                {SPECIALTIES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Formato de contenido</label>
              <select
                className="w-full px-3 py-2 rounded-xl"
                value={format}
                onChange={e => setFormat(e.target.value)}
              >
                <option value="">Seleccione formato</option>
                <option value="texto">Texto</option>
                <option value="carrusel">Carrusel</option>
                <option value="reel">Reel</option>
              </select>
            </div>
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
          </>
        )}
        <ToolsGrid tools={tools} />
      </div>
    </div>
  );
}
main

          <div className="space-y-1">
            <label className="text-sm font-medium">Audiencia Objetivo</label>
            <input
              className="w-full px-3 py-2 rounded-xl"
              value={params.audiencia}
              onChange={e => setParams({ ...params, audiencia: e.target.value })}
              placeholder="Definí la audiencia"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Tema del Contenido</label>
            <input
              className="w-full px-3 py-2 rounded-xl"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="E.g. Automatización de contratos con IA"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Contenido Adicional</label>
            <textarea
              className="w-full px-3 py-2 rounded-xl"
              rows={3}
              value={extra}
              onChange={e => setExtra(e.target.value)}
              placeholder="Incluye detalles, tono, call to action, etc."
            />
          </div>
        </div>

        <div className="space-y-3">
          <Card title="Hook Emocional">{suggestions.hook}</Card>
          <Card title="Valor Educativo">{suggestions.valor}</Card>
          <Card title="Call to Action">{suggestions.cta}</Card>
          <Card title="Hashtags Relevantes">
            <div className="flex flex-wrap gap-2">
              {suggestions.hashtags.map(h => (
                <span
                  key={h}
                  className="px-2 py-1 rounded-full text-xs"
                  style={{ background: "#EDE9FE", color: "#4C1D95" }}
                >
                  #{h}
                </span>
              ))}
            </div>
          </Card>
          <Card title="Mejores Horarios por Plataforma">
            {suggestions.horarios}
          </Card>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-2 rounded-xl text-white"
          style={{ background: BRAND.teal }}
        >
          {loading ? "Generando…" : "Generar Contenido con IA"}
        </button>
        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>

      {result && (
        <div className="mt-6">
          <PostBlock
            title={`Publicaciones para ${platform || "redes"}`}
            items={result.posts?.[platform] || []}
          />
        </div>
      )}
    </section>
  );
}

function ToolCard({ icon, title, desc, action }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-2xl"
        style={{ background: BRAND.primary, color: "white" }}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-1 text-center" style={{ color: BRAND.navy }}>
        {title}
      </h3>
      <p className="text-sm text-gray-600 flex-1 text-center">{desc}</p>
      <button
        onClick={action}
        className="mt-4 px-4 py-2 rounded-xl text-white"
        style={{ background: BRAND.teal }}
      >
        Comenzar
      </button>
    </div>
  );
}

function ToolsGrid({ tools }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4" style={{ color: BRAND.navy }}>
        Herramientas
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((t, i) => (
          <ToolCard key={i} {...t} />
        ))}
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      {title && (
        <h4 className="font-semibold mb-2" style={{ color: BRAND.navy }}>
          {title}
        </h4>
      )}
      <div className="prose prose-sm max-w-none">{children}</div>
    </div>
  );
}

function PostBlock({ title, items }) {
  return (
    <Card title={title}>
      {(!items || items.length === 0) && (
        <p className="text-sm text-gray-500">No hay contenido generado.</p>
      )}
      <div className="space-y-3">
        {items?.map((c, i) => (
          <div key={i} className="rounded-xl border p-3 bg-gray-50">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="text-sm font-medium">Variante {i + 1}</div>
              <button
                onClick={() => navigator.clipboard.writeText(c)}
                className="px-3 py-1.5 rounded-xl text-white"
                style={{ background: BRAND.primary }}
              >
                Copiar
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-6">{c}</pre>
          </div>
        ))}
      </div>
    </Card>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

