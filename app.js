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
  const [platform, setPlatform] = useState("instagram");
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const [apiKey, setApiKey] = useState(localStorage.getItem("lh_key") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // fonts already injected by index.html
  }, []);

  const brief = useMemo(
    () => ({
      ...params,
      topico: topic,
      especialidad: selected,
      plataforma: platform,
      marca: "LegalHub"
    }),
    [params, topic, selected, platform]
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

      <section className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm font-medium">Especialidad</label>
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
            <label className="text-sm font-medium">Tópico</label>
            <input
              className="w-full px-3 py-2 rounded-xl"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="SEO local para estudios jurídicos"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Plataforma</label>
            <select
              className="w-full px-3 py-2 rounded-xl"
              value={platform}
              onChange={e => setPlatform(e.target.value)}
            >
              <option value="instagram">Instagram</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">CTA</label>
            <input
              className="w-full px-3 py-2 rounded-xl"
              value={params.cta}
              onChange={e => setParams({ ...params, cta: e.target.value })}
              placeholder="Reservá tu diagnóstico"
            />
          </div>
        </div>

        <div>
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
          <PostBlock
            title={`Publicaciones para ${platform}`}
            items={result.posts?.[platform] || []}
          />
        )}
      </section>
    </div>
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

