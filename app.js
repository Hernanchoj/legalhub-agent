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
    action: input => `Post creativo sobre "${input}".`
  },
  {
    id: "propuestas",
    title: "Generación de Propuestas",
    icon: "📄",
    description: "Estructura propuestas comerciales personalizadas.",
    action: input => `Propuesta para "${input}" lista.`
  },
  {
    id: "presentaciones",
    title: "Presentaciones",
    icon: "📊",
    description: "Crea diapositivas profesionales para tus reuniones.",
    action: input => `Presentación para "${input}" creada.`
  },
  {
    id: "branding",
    title: "Branding",
    icon: "🎨",
    description: "Define tono y estilo de tu marca.",
    action: input => `Guía de branding para "${input}".`
  },
  {
    id: "email",
    title: "Email Marketing & CRM",
    icon: "📧",
    description: "Secuencias automatizadas para convertir leads.",
    action: input => `Secuencia de email sobre "${input}".`
  },
  {
    id: "seo",
    title: "Optimización SEO Legal",
    icon: "🔍",
    description: "Palabras clave y optimización on-page.",
    action: input => `Ideas de SEO para "${input}".`
  },
  {
    id: "apolo",
    title: "Apolo Legal",
    icon: "🚀",
    description: "Planifica lanzamientos con IA.",
    action: input => `Lanzamiento planificado para "${input}".`
  },
  {
    id: "agenda",
    title: "Agenda",
    icon: "🗓️",
    description: "Organiza contenidos y recordatorios.",
    action: input => `Evento añadido: "${input}".`
  },
  {
    id: "medidor",
    title: "Medidor de Alcance",
    icon: "📈",
    description: "Estimá el alcance de tus campañas.",
    action: input => `Alcance estimado para "${input}" de 1000+ usuarios.`
  }
];

function ToolModal({ tool, onClose }) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold" style={{ color: BRAND.navy }}>
            {tool.title}
          </h3>
          <button onClick={onClose} className="text-gray-500">
            ✖️
          </button>
        </div>
        <textarea
          className="w-full border rounded-xl p-2"
          placeholder="Describe tu necesidad"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button
          onClick={() => setOutput(tool.action(input))}
          className="px-4 py-2 rounded-xl text-white"
          style={{ background: BRAND.teal }}
        >
          Generar
        </button>
        {output && (
          <pre className="bg-gray-100 p-3 rounded-xl whitespace-pre-wrap text-sm">
            {output}
          </pre>
        )}
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

