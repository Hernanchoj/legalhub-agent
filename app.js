const { useState } = React;

async function generateText(prompt, apiKey) {
  if (!apiKey) {
    return `LITE: ${prompt}`;
  }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
  } catch (err) {
    console.error(err);
    return "";
  }
}

function download(filename, content, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function ModeToggle({ mode, onToggle, apiKey, onApiKey }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <label className="font-medium">Modo:</label>
      <button
        onClick={onToggle}
        className="px-3 py-1 rounded text-white"
        style={{ background: "var(--lh-primary)" }}
      >
        {mode === "lite" ? "LITE" : "PRO"}
      </button>
      {mode === "pro" && (
        <input
          type="password"
          placeholder="API key OpenAI"
          value={apiKey}
          onChange={onApiKey}
          className="border p-2 rounded flex-1"
        />
      )}
    </div>
  );
}

function Sidebar({ section, setSection }) {
  const items = [
    { id: "agent", label: "Agente" },
    { id: "brief", label: "Brief" },
    { id: "library", label: "Biblioteca" },
    { id: "generators", label: "Generadores" },
    { id: "calendar", label: "Calendario" },
    { id: "history", label: "Historial" }
  ];
  return (
    <aside className="bg-white shadow md:h-screen md:w-64">
      <nav className="p-4 space-y-2">
        {items.map(it => (
          <button
            key={it.id}
            onClick={() => setSection(it.id)}
            className={`block w-full text-left px-3 py-2 rounded ${
              section === it.id ? "bg-purple-600 text-white" : "hover:bg-purple-100"
            }`}
          >
            {it.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function AgentPanel({ agent, setAgent }) {
  const update = e => setAgent({ ...agent, [e.target.name]: e.target.value });
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Agente Especialista</h2>
      <input
        name="voice"
        value={agent.voice}
        onChange={update}
        placeholder="Voz de marca"
        className="w-full border p-2 rounded"
      />
      <select
        name="style"
        value={agent.style}
        onChange={update}
        className="w-full border p-2 rounded"
      >
        <option value="formal">Formal</option>
        <option value="consultivo">Consultivo</option>
      </select>
      <textarea
        name="restrictions"
        value={agent.restrictions}
        onChange={update}
        placeholder="Restricciones"
        className="w-full border p-2 rounded"
      />
      <textarea
        name="compliance"
        value={agent.compliance}
        onChange={update}
        placeholder="Compliance / Disclaimers por país"
        className="w-full border p-2 rounded"
      />
    </div>
  );
}

function BriefPanel({ brief, setBrief }) {
  const update = e => setBrief({ ...brief, [e.target.name]: e.target.value });
  const fields = [
    { name: "brand", label: "Marca" },
    { name: "audience", label: "Público" },
    { name: "tone", label: "Tono" },
    { name: "objectives", label: "Objetivos" },
    { name: "cta", label: "CTA" },
    { name: "channels", label: "Canales" }
  ];
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Brief</h2>
      {fields.map(f => (
        <input
          key={f.name}
          name={f.name}
          value={brief[f.name]}
          onChange={update}
          placeholder={f.label}
          className="w-full border p-2 rounded"
        />
      ))}
    </div>
  );
}

function Library() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Biblioteca de Assets</h2>
      <img
        src="https://dummyimage.com/200x80/60189C/fff&text=LegalHub"
        alt="Logo"
        className="rounded"
      />
      <div>
        <p className="font-medium">Paleta de colores:</p>
        <div className="flex gap-2">
          {["primary", "teal", "navy", "cyan"].map(c => (
            <span
              key={c}
              className="w-8 h-8 rounded"
              style={{ background: `var(--lh-${c})` }}
            ></span>
          ))}
        </div>
      </div>
      <p>
        <strong>Eslogan:</strong> Protección legal al alcance de todos.
      </p>
      <p className="text-xs text-gray-600">
        <strong>Disclaimer:</strong> Este contenido es informativo y no constituye
        asesoramiento legal.
      </p>
    </div>
  );
}

function PostGenerator({ brief, apiKey, onResult }) {
  const [platform, setPlatform] = useState("X");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const generate = async () => {
    const prompt = `Escribe un post para ${platform} sobre ${topic}. Marca: ${brief.brand}. Público: ${brief.audience}. Tono: ${brief.tone}. Objetivos: ${brief.objectives}. CTA: ${brief.cta}.`;
    const text = await generateText(prompt, apiKey);
    setResult(text);
    onResult({ platform, text });
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          value={platform}
          onChange={e => setPlatform(e.target.value)}
          className="border p-2 rounded"
        >
          <option>X</option>
          <option>Instagram</option>
          <option>LinkedIn</option>
        </select>
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Tema"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={generate}
          className="px-4 py-2 rounded text-white"
          style={{ background: "var(--lh-primary)" }}
        >
          Generar
        </button>
      </div>
      {result && (
        <div className="bg-white p-3 rounded shadow text-sm whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}

function ScriptGenerator({ brief, apiKey, onResult }) {
  const [type, setType] = useState("video");
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const generate = async () => {
    const prompt = `Crea un guión de ${
      type === "video" ? "video corto" : "podcast"
    } con hook, body y CTA sobre ${topic}. Marca: ${brief.brand}. Público: ${brief.audience}. Tono: ${brief.tone}.`;
    const text = await generateText(prompt, apiKey);
    setResult(text);
    onResult({ subtype: type, text });
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="video">Video corto</option>
          <option value="podcast">Podcast</option>
        </select>
        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Tema"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={generate}
          className="px-4 py-2 rounded text-white"
          style={{ background: "var(--lh-primary)" }}
        >
          Generar
        </button>
      </div>
      {result && (
        <div className="bg-white p-3 rounded shadow text-sm whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}

function ImageGenerator({ apiKey, onResult }) {
  const [prompt, setPrompt] = useState("");
  const [url, setUrl] = useState("");
  const generate = async () => {
    if (apiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({ prompt, size: "512x512" })
        });
        const data = await res.json();
        const imageUrl = data.data?.[0]?.url || "";
        setUrl(imageUrl);
        onResult(imageUrl);
      } catch (e) {
        console.error(e);
      }
    } else {
      const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(
        prompt
      )}/512/512`;
      setUrl(imageUrl);
      onResult(imageUrl);
    }
  };
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Prompt de imagen"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={generate}
          className="px-4 py-2 rounded text-white"
          style={{ background: "var(--lh-primary)" }}
        >
          Generar
        </button>
      </div>
      {url && <img src={url} alt="Generada" className="max-w-full rounded" />}
    </div>
  );
}

function Generators({ brief, apiKey, history, setHistory }) {
  const [tab, setTab] = useState("post");
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[
          { id: "post", label: "Post Redes" },
          { id: "script", label: "Guiones" },
          { id: "image", label: "Imágenes" }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-1 rounded ${
              tab === t.id ? "bg-purple-600 text-white" : "bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "post" && (
        <PostGenerator
          brief={brief}
          apiKey={apiKey}
          onResult={item => setHistory([...history, { type: "post", ...item }])}
        />
      )}
      {tab === "script" && (
        <ScriptGenerator
          brief={brief}
          apiKey={apiKey}
          onResult={item =>
            setHistory([...history, { type: "script", ...item }])
          }
        />
      )}
      {tab === "image" && (
        <ImageGenerator
          apiKey={apiKey}
          onResult={url => setHistory([...history, { type: "image", url }])}
        />
      )}
    </div>
  );
}

function Calendar({ calendar, setCalendar, history, setHistory }) {
  const generate = () => {
    const start = new Date();
    const events = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return { date, title: `Post ${i + 1}` };
    });
    setCalendar(events);
    setHistory([...history, { type: "calendar", events }]);
  };
  const exportCSV = () => {
    if (!calendar.length) return;
    const rows = [
      ["date", "title"],
      ...calendar.map(e => [e.date.toISOString().split("T")[0], e.title])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    download("calendario.csv", csv, "text/csv");
  };
  const exportICS = () => {
    if (!calendar.length) return;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "CALSCALE:GREGORIAN"
    ];
    calendar.forEach((e, i) => {
      const dt = e.date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${Date.now()}-${i}@legalhub`);
      lines.push(`DTSTAMP:${dt}`);
      lines.push(`DTSTART:${dt}`);
      lines.push(`SUMMARY:${e.title}`);
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    download("calendario.ics", lines.join("\n"), "text/calendar");
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Calendario</h2>
      <div className="flex gap-2">
        <button
          onClick={generate}
          className="px-4 py-2 rounded text-white"
          style={{ background: "var(--lh-primary)" }}
        >
          Generar Plan Semanal
        </button>
        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded bg-gray-200"
        >
          Exportar CSV
        </button>
        <button
          onClick={exportICS}
          className="px-4 py-2 rounded bg-gray-200"
        >
          Exportar ICS
        </button>
      </div>
      <ul className="list-disc pl-5">
        {calendar.map((e, i) => (
          <li key={i}>
            {e.date.toDateString()} - {e.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

function History({ history }) {
  const exportDoc = item => {
    const text = item.text || JSON.stringify(item, null, 2);
    const doc = new docx.Document({
      sections: [{ children: [new docx.Paragraph(text)] }]
    });
    docx.Packer.toBlob(doc).then(blob =>
      download(
        "pieza.docx",
        blob,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
    );
  };
  const exportPitch = () => {
    const pptx = new PptxGenJS();
    history.slice(0, 5).forEach(h => {
      const slide = pptx.addSlide();
      slide.addText(h.text || h.title || "Contenido", {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 5,
        fontSize: 18
      });
    });
    pptx.writeFile("pitch.pptx");
  };
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Historial</h2>
      <button
        onClick={exportPitch}
        className="px-4 py-2 rounded bg-gray-200"
      >
        Exportar Pitch (PPTX)
      </button>
      {history.length === 0 && (
        <p className="text-gray-600">Sin contenido aún.</p>
      )}
      {history.map((item, i) => (
        <div key={i} className="bg-white p-3 rounded shadow space-y-2">
          <div className="text-sm text-gray-500">{item.type}</div>
          {item.text && (
            <pre className="whitespace-pre-wrap text-sm">{item.text}</pre>
          )}
          {item.url && <img src={item.url} className="max-w-xs" />}
          {item.events && (
            <div className="text-sm">{item.events.length} eventos</div>
          )}
          {item.text && (
            <button
              onClick={() => exportDoc(item)}
              className="px-3 py-1 rounded bg-gray-200 text-sm"
            >
              Exportar DOCX
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [section, setSection] = useState("generators");
  const [mode, setMode] = useState("lite");
  const [apiKey, setApiKey] = useState(
    localStorage.getItem("openai_api_key") || ""
  );
  const [brief, setBrief] = useState({
    brand: "",
    audience: "",
    tone: "",
    objectives: "",
    cta: "",
    channels: ""
  });
  const [agent, setAgent] = useState({
    voice: "",
    style: "formal",
    restrictions: "",
    compliance: ""
  });
  const [history, setHistory] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const toggleMode = () => setMode(m => (m === "lite" ? "pro" : "lite"));
  const handleApiKey = e => {
    setApiKey(e.target.value);
    localStorage.setItem("openai_api_key", e.target.value);
  };
  return (
    <div className="md:flex" style={{ background: "var(--lh-bg)" }}>
      <Sidebar section={section} setSection={setSection} />
      <main className="flex-1 p-4 space-y-6 md:ml-64">
        <ModeToggle
          mode={mode}
          onToggle={toggleMode}
          apiKey={apiKey}
          onApiKey={handleApiKey}
        />
        {section === "agent" && <AgentPanel agent={agent} setAgent={setAgent} />}
        {section === "brief" && <BriefPanel brief={brief} setBrief={setBrief} />}
        {section === "library" && <Library />}
        {section === "generators" && (
          <Generators
            brief={brief}
            apiKey={mode === "pro" ? apiKey : ""}
            history={history}
            setHistory={setHistory}
          />
        )}
        {section === "calendar" && (
          <Calendar
            calendar={calendar}
            setCalendar={setCalendar}
            history={history}
            setHistory={setHistory}
          />
        )}
        {section === "history" && <History history={history} />}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
