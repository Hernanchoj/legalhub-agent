const { useState } = React;

// Paleta de colores de LegalHub
const BRAND = {
  bg: "#F2F2F7",
  primary: "#60189C",
  teal: "#00B989",
  navy: "#172755"
};

// Definición de herramientas disponibles
const TOOLS = [
  {
    id: "multimedia",
    title: "Contenido Multimedia",
    icon: "🎬",
    description:
      "Generación de posts creativos con enfoque audio-visual y recomendaciones de imágenes.",
    action(input) {
      return {
        hook: `Captá la atención hablando de ${input} con un recurso visual potente`,
        value: `Mostrá el valor de ${input} utilizando formatos multimedia`,
        cta: `Invitá a profundizar en ${input} con un video o podcast`,
        hashtags: "#multimedia #LegalHub"
      };
    }
  },
  {
    id: "propuestas",
    title: "Generación de Propuestas",
    icon: "📄",
    description: "Estructura propuestas comerciales personalizadas.",
    action(input) {
      return {
        hook: `Introducí ${input} destacando el problema del cliente`,
        value: `Explicá cómo tu propuesta de ${input} resuelve la necesidad`,
        cta: `Cerrá invitando a revisar la propuesta de ${input} en detalle`,
        hashtags: "#propuesta #LegalHub"
      };
    }
  },
  {
    id: "presentaciones",
    title: "Presentaciones",
    icon: "📊",
    description: "Crea diapositivas profesionales para tus reuniones.",
    action(input) {
      return {
        hook: `Abrí la presentación sobre ${input} con un dato impactante`,
        value: `Desarrollá la idea central de ${input} con gráficos claros`,
        cta: `Finalizá invitando a actuar sobre ${input}`,
        hashtags: "#presentaciones #LegalHub"
      };
    }
  },
  {
    id: "branding",
    title: "Branding",
    icon: "🎨",
    description: "Define tono y estilo de tu marca.",
    action(input) {
      return {
        hook: `Conectá con tu audiencia resaltando ${input}`,
        value: `Explicá el ADN de marca alrededor de ${input}`,
        cta: `Invitá a vivir la experiencia ${input}`,
        hashtags: "#branding #LegalHub"
      };
    }
  },
  {
    id: "email",
    title: "Email Marketing & CRM",
    icon: "📧",
    description: "Secuencias automatizadas para convertir leads.",
    action(input) {
      return {
        hook: `Comenzá el correo sobre ${input} con una frase empática`,
        value: `Detallá beneficios clave de ${input} en tu mensaje`,
        cta: `Concluí invitando a responder sobre ${input}`,
        hashtags: "#emailmarketing #LegalHub"
      };
    }
  },
  {
    id: "seo",
    title: "Optimización SEO Legal",
    icon: "🔍",
    description: "Palabras clave y optimización on-page.",
    action(input) {
      return {
        hook: `Llamá la atención sobre ${input} con una pregunta`,
        value: `Desarrollá contenido optimizado para ${input}`,
        cta: `Invitá a leer más sobre ${input} en tu sitio`,
        hashtags: "#seo #LegalHub"
      };
    }
  },
  {
    id: "apolo",
    title: "Apolo Legal",
    icon: "🚀",
    description: "Planifica lanzamientos con IA.",
    action(input) {
      return {
        hook: `Generá expectativa sobre el lanzamiento de ${input}`,
        value: `Mostrá la propuesta de valor detrás de ${input}`,
        cta: `Invitá a sumarse al lanzamiento de ${input}`,
        hashtags: "#apolo #LegalHub"
      };
    }
  },
  {
    id: "agenda",
    title: "Agenda",
    icon: "🗓️",
    description: "Organiza contenidos y recordatorios.",
    action(input) {
      return {
        hook: `Anunciá el evento ${input} destacando su relevancia`,
        value: `Recordá los detalles clave de ${input}`,
        cta: `Invitá a agendar ${input}`,
        hashtags: "#agenda #LegalHub"
      };
    }
  },
  {
    id: "medidor",
    title: "Medidor de Alcance",
    icon: "📈",
    description: "Estimá el alcance de tus campañas.",
    action(input) {
      return {
        hook: `Presentá la campaña ${input} con una promesa de alcance`,
        value: `Compartí proyecciones de resultados para ${input}`,
        cta: `Motivá a lanzar la campaña ${input}`,
        hashtags: "#medidordealcance #LegalHub"
      };
    }
  }
];

function ToolModal({ tool, onClose }) {
  const [config, setConfig] = useState({
    type: "",
    specialty: "",
    platform: "",
    format: "",
    audience: "",
    context: ""
  });
  const [strategy, setStrategy] = useState(null);

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    setStrategy(tool.action(config.context));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold" style={{ color: BRAND.navy }}>
            {tool.title}
          </h3>
          <button onClick={onClose} className="text-gray-500">
            ✖️
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold" style={{ color: BRAND.primary }}>
              Configuración del Contenido
            </h4>
            <select
              className="w-full border rounded-xl p-2"
              value={config.type}
              onChange={e => handleChange("type", e.target.value)}
            >
              <option value="">Tipo de Contenido</option>
              <option>Post</option>
              <option>Video</option>
              <option>Artículo</option>
            </select>
            <select
              className="w-full border rounded-xl p-2"
              value={config.specialty}
              onChange={e => handleChange("specialty", e.target.value)}
            >
              <option value="">Especialidad Legal Hub</option>
              <option>Corporativo</option>
              <option>Laboral</option>
              <option>Tributario</option>
            </select>
            <select
              className="w-full border rounded-xl p-2"
              value={config.platform}
              onChange={e => handleChange("platform", e.target.value)}
            >
              <option value="">Plataforma</option>
              <option>Instagram</option>
              <option>LinkedIn</option>
              <option>YouTube</option>
            </select>
            <select
              className="w-full border rounded-xl p-2"
              value={config.format}
              onChange={e => handleChange("format", e.target.value)}
            >
              <option value="">Formato de Contenido</option>
              <option>Reel</option>
              <option>Posteo</option>
              <option>Blog</option>
            </select>
            <select
              className="w-full border rounded-xl p-2"
              value={config.audience}
              onChange={e => handleChange("audience", e.target.value)}
            >
              <option value="">Audiencia Objetivo</option>
              <option>Público general</option>
              <option>Empresas</option>
              <option>Startups</option>
            </select>
            <textarea
              className="w-full border rounded-xl p-2"
              placeholder="Contexto adicional"
              value={config.context}
              onChange={e => handleChange("context", e.target.value)}
            />
            <button
              onClick={handleGenerate}
              className="px-4 py-2 rounded-xl text-white"
              style={{ background: BRAND.teal }}
            >
              Generar
            </button>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold" style={{ color: BRAND.primary }}>
              Estrategia de Contenido
            </h4>
            {strategy ? (
              <>
                <div>
                  <h5 className="text-sm font-semibold text-purple-600">
                    Hook Emocional
                  </h5>
                  <p className="bg-gray-100 p-2 rounded-xl text-sm">{strategy.hook}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-teal-600">
                    Valor Educativo
                  </h5>
                  <p className="bg-gray-100 p-2 rounded-xl text-sm">{strategy.value}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-orange-500">
                    Call to Action
                  </h5>
                  <p className="bg-gray-100 p-2 rounded-xl text-sm">{strategy.cta}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-blue-600">
                    Hashtags Relevantes
                  </h5>
                  <p className="bg-gray-100 p-2 rounded-xl text-sm">{strategy.hashtags}</p>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Completá la configuración y generá la estrategia.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [active, setActive] = useState(null);
  return (
    <div className="min-h-screen" style={{ background: BRAND.bg }}>
      <header className="text-center py-10 space-y-3">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-400 bg-clip-text text-transparent">
          Marketing Legal Hub
        </h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Potenciá tu estrategia de marketing con análisis psicográfico profundo y contenido especializado para cada área de Legal Hub
        </p>
        <nav className="flex justify-center gap-4 pt-4">
          {["Analítica Predictiva", "IA Especializada", "SEO Legal"].map(item => (
            <a
              key={item}
              className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
              style={{ background: BRAND.primary }}
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      <section className="max-w-5xl mx-auto px-4 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2" style={{ color: BRAND.navy }}>
            Herramientas de Marketing Intelligence
          </h2>
          <p className="text-gray-600">
            Cada herramienta está diseñada para crear contenido que resuene emocionalmente con los escenarios específicos de tus clientes potenciales
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {TOOLS.map(tool => (
            <div
              key={tool.id}
              onClick={() => setActive(tool)}
              className="bg-white rounded-2xl shadow p-5 cursor-pointer hover:shadow-lg transition space-y-2"
            >
              <div className="text-3xl">{tool.icon}</div>
              <h3 className="font-semibold text-lg" style={{ color: BRAND.navy }}>
                {tool.title}
              </h3>
              <p className="text-sm text-gray-600">{tool.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 mt-10 pb-10 text-center space-y-2">
        <h2 className="text-2xl font-semibold" style={{ color: BRAND.navy }}>
          Tendencias del Mercado Legal
        </h2>
        <p className="text-gray-600">
          Actualizate constantemente con las últimas tendencias y oportunidades del sector legal
        </p>
      </section>

      {active && <ToolModal tool={active} onClose={() => setActive(null)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

