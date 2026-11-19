import React, { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Globe,
  RotateCcw,
  Send,
} from "lucide-react";
import { EMPRESA_PROCOLMAT } from "../data/catalogoProcolmat";
import {
  ChatMessage,
  SUGERENCIAS_INICIALES,
} from "../engine/procolmatChatEngine";

interface ProcolmatChatProps {
  messages: ChatMessage[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
  onReset: () => void;
}

export const ProcolmatChat: React.FC<ProcolmatChatProps> = ({
  messages,
  isThinking,
  onSendMessage,
  onReset,
}) => {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isThinking) return;
    onSendMessage(trimmed);
    setInputValue("");
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (text: string) => {
    if (isThinking) return;
    onSendMessage(text);
    inputRef.current?.focus();
  };

  const renderSourceIcon = (id: "web" | "csv" | "pdf") => {
    if (id === "web") return <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
    if (id === "csv") {
      return <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
    }
    return <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />;
  };

  const isEmptyState = messages.length === 0 && !isThinking;

  return (
    <section
      aria-label="Asistente Virtual PROCOLMAT"
      className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-[calc(100vh-11.5rem)] min-h-[540px] max-h-[780px]"
    >
      {/* AVISO LEGAL Y DE TRANSPARENCIA IA (VISIBLE Y LLAMATIVO EN LA PARTE SUPERIOR) */}
      <div
        role="note"
        aria-label="Aviso de inteligencia artificial"
        className="bg-[#1E2B3D] text-white px-4 py-3 border-b-2 border-[#FF9119] flex items-start justify-between gap-3 shrink-0"
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <AlertTriangle
            className="w-4 h-4 text-[#FF9119] mt-0.5 shrink-0"
            aria-hidden="true"
          />
          <p className="text-xs leading-relaxed text-slate-100">
            <strong className="text-[#FF9119] font-semibold">
              Estás hablando con una IA y esta puede cometer errores.
            </strong>{" "}
            Este chat automatizado es informativo; confirma vigencia de precios,
            disponibilidad y especificaciones técnicas con un asesor humano de{" "}
            {EMPRESA_PROCOLMAT.nombre}.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={onReset}
            title="Reiniciar conversación"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#FF9119]"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Reiniciar</span>
          </button>
        )}
      </div>

      {/* CUERPO DEL CHAT */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 bg-slate-50/60"
      >
        {/* ESTADO VACÍO: SUGERENCIAS CLARAS Y SIN SOBRECARGA */}
        {isEmptyState && (
          <div className="h-full flex flex-col justify-center max-w-xl mx-auto py-4 space-y-6">
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111315] text-balance">
                Asistente de Productos y Soluciones PROCOLMAT
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {EMPRESA_PROCOLMAT.lema} Pregúntame por pegantes, estucos,
                masillas, impermeabilizantes, lechadas, pinturas o información de
                nuestra empresa.
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-500">
                Sugerencias para empezar
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUGERENCIAS_INICIALES.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => handleSuggestionClick(sug)}
                    className="text-left px-3.5 py-3 text-sm font-medium text-[#1E2B3D] bg-white hover:bg-orange-50/60 border border-slate-200 hover:border-[#FF9119] rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-[#FF9119]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MENSAJES DE LA CONVERSACIÓN */}
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] bg-[#1E2B3D] text-white rounded-2xl rounded-br-xs px-4 py-3 text-sm leading-relaxed">
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div className="mt-1 text-right text-[11px] text-slate-300 font-mono tabular-nums">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[95%] sm:max-w-[88%] bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3.5 text-sm text-[#111315] space-y-3">
                <div className="flex items-center justify-between gap-4 text-xs text-slate-500">
                  <span className="font-semibold text-[#1E2B3D]">
                    Asistente IA PROCOLMAT
                  </span>
                  <span className="font-mono tabular-nums">{msg.timestamp}</span>
                </div>

                <p className="leading-relaxed whitespace-pre-line text-slate-800">
                  {msg.text}
                </p>

                {/* TABLA COMPACTA DE PRODUCTOS Y PRECIOS DEL CSV */}
                {msg.productos && msg.productos.length > 0 && (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                            <th className="py-2 px-3 font-semibold">Producto</th>
                            <th className="py-2 px-3 font-semibold">Presentación</th>
                            <th className="py-2 px-3 font-semibold text-right">Precio</th>
                            <th className="py-2 px-3 font-semibold">Observaciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {msg.productos.map((item, idx) => (
                            <tr
                              key={`${item.producto}-${item.presentacion}-${idx}`}
                              className="hover:bg-slate-50/70"
                            >
                              <td className="py-2 px-3 font-medium text-[#111315]">
                                {item.producto}
                              </td>
                              <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                                {item.presentacion}
                              </td>
                              <td className="py-2 px-3 font-mono font-semibold text-[#1E2B3D] text-right tabular-nums whitespace-nowrap">
                                {item.precio} {item.moneda}
                              </td>
                              <td className="py-2 px-3 text-slate-500">
                                {item.observaciones}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* BOTÓN DE AGENDAMIENTO / CONTACTO CON ASESOR */}
                {msg.whatsappCta && (
                  <div className="pt-1">
                    <a
                      href={msg.whatsappCta.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[#111315] bg-[#FF9119] hover:bg-[#e57f10] rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9119]"
                    >
                      <span>{msg.whatsappCta.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                )}

                {/* FUENTES VERIFICABLES PARA QUE EL USUARIO PUEDA CONFIRMAR */}
                {msg.fuentes && msg.fuentes.length > 0 && (
                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
                    <span className="font-medium text-slate-600">Fuentes:</span>
                    {msg.fuentes.map((fuente) => (
                      <a
                        key={fuente.id}
                        href={fuente.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#1E2B3D] hover:text-[#e57f10] underline underline-offset-2 transition-colors"
                      >
                        {renderSourceIcon(fuente.id)}
                        <span>{fuente.etiqueta}</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* SUGERENCIAS DE SEGUIMIENTO */}
                {msg.sugerencias && msg.sugerencias.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {msg.sugerencias.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleSuggestionClick(sug)}
                        className="px-2.5 py-1.5 text-xs font-medium text-[#1E2B3D] bg-slate-100 hover:bg-orange-50 hover:text-[#111315] border border-slate-200 hover:border-[#FF9119] rounded-lg transition-colors whitespace-nowrap"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* ESTADO RESPONDIENDO: ANIMACIÓN DE "PENSANDO" / "ESCRIBIENDO" */}
        {isThinking && (
          <div className="flex justify-start" aria-live="polite">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-1" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-[#FF9119] thinking-dot-1" />
                <span className="w-2 h-2 rounded-full bg-[#1E2B3D] thinking-dot-2" />
                <span className="w-2 h-2 rounded-full bg-[#FF9119] thinking-dot-3" />
              </div>
              <span className="text-xs font-medium text-slate-600">
                Pensando y consultando las fuentes de PROCOLMAT...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* BARRA DE ENTRADA DEL CHAT */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-t border-slate-200 px-4 py-3 flex items-center gap-2.5 shrink-0"
      >
        <label htmlFor="procolmat-chat-input" className="sr-only">
          Escribe tu pregunta sobre productos o información de PROCOLMAT
        </label>
        <input
          id="procolmat-chat-input"
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pregunta por cualquier producto, precio o información de PROCOLMAT..."
          className="flex-1 min-w-0 h-11 px-3.5 text-sm text-[#111315] placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1E2B3D] focus:bg-white transition-colors"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isThinking}
          className="h-11 px-4 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1E2B3D] hover:bg-[#111315] disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF9119]"
        >
          <span>Enviar</span>
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </section>
  );
};
