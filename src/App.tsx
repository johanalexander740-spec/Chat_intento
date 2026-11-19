import { useRef, useState } from "react";
import { ExternalLink } from "lucide-react";
import { ProcolmatChat } from "./components/ProcolmatChat";
import { EMPRESA_PROCOLMAT, FUENTES_PROCOLMAT } from "./data/catalogoProcolmat";
import { ChatMessage, generateBotResponse } from "./engine/procolmatChatEngine";

function getTimeLabel(): string {
  return new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const thinkingTimerRef = useRef<number | null>(null);

  const handleSendMessage = (text: string) => {
    const cleanText = text.trim();
    if (!cleanText || isThinking) return;

    if (thinkingTimerRef.current !== null) {
      window.clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: "user",
      text: cleanText,
      timestamp: getTimeLabel(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    // Simulación realista del estado "pensando" (preparado para futura latencia de API)
    thinkingTimerRef.current = window.setTimeout(() => {
      const reply = generateBotResponse(cleanText);
      const botMsg: ChatMessage = {
        ...reply,
        id: `bot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: getTimeLabel(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsThinking(false);
      thinkingTimerRef.current = null;
    }, 750);
  };

  const handleReset = () => {
    if (thinkingTimerRef.current !== null) {
      window.clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    setIsThinking(false);
    setMessages([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#111315]">
      {/* Barra superior limpia de 3 zonas */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <a
            href={EMPRESA_PROCOLMAT.sitioWebUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-bold tracking-tight text-[#111315] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF9119] rounded"
          >
            {EMPRESA_PROCOLMAT.nombre}
          </a>

          <nav
            aria-label="Fuentes oficiales de PROCOLMAT"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href={FUENTES_PROCOLMAT.web.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111315] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Sitio web
            </a>
            <a
              href={FUENTES_PROCOLMAT.csv.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111315] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Precios CSV
            </a>
            <a
              href={FUENTES_PROCOLMAT.pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111315] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Información PDF
            </a>
          </nav>

          <div className="flex items-center shrink-0">
            <a
              href={EMPRESA_PROCOLMAT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#111315] bg-[#FF9119] hover:bg-[#e57f10] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9119]"
            >
              <span>Hablar con asesor</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* Área principal centrada y sin sobrecarga visual */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <ProcolmatChat
          messages={messages}
          isThinking={isThinking}
          onSendMessage={handleSendMessage}
          onReset={handleReset}
        />
      </main>

      {/* Pie de página discreto */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            <span className="font-semibold text-[#1E2B3D]">
              {EMPRESA_PROCOLMAT.nombre}
            </span>{" "}
            · {EMPRESA_PROCOLMAT.razonSocial} · {EMPRESA_PROCOLMAT.ciudadBase}
          </p>
          <div className="flex items-center gap-3">
            <a
              href={EMPRESA_PROCOLMAT.sitioWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#111315] transition-colors"
            >
              {EMPRESA_PROCOLMAT.sitioWeb}
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={EMPRESA_PROCOLMAT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono tabular-nums hover:text-[#111315] transition-colors"
            >
              {EMPRESA_PROCOLMAT.whatsappNumero}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
