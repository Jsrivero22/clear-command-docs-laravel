import { useState, useMemo } from "react";
import { Command } from "@/data/artisanCommands";
import { Copy, Check, ChevronRight, AlertTriangle } from "lucide-react";

interface CommandViewerProps {
  command: Command;
  category: string;
}

const CommandViewer = ({ command, category }: CommandViewerProps) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const isDangerous = command.tags.includes("peligroso");

  return (
    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <h2 className="text-3xl font-bold text-foreground">{command.name}</h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground">
            {category}
          </span>
          {isDangerous && (
            <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-destructive/20 text-destructive">
              <AlertTriangle className="w-3 h-3" />
              Peligroso
            </span>
          )}
        </div>
        <div className="p-4 rounded-lg glass border-l-4 border-l-primary">
          <p className="text-muted-foreground leading-relaxed">{command.description}</p>
        </div>
      </div>

      {/* Examples */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-primary" />
          Ejemplos de uso
        </h3>
        <div className="space-y-3">
          {command.examples.map((example, i) => (
            <div
              key={i}
              className="group relative rounded-xl bg-code-bg border border-code-border/20 hover:border-code-border/40 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5"
            >
              <button
                onClick={() => handleCopy(example, i)}
                className="absolute top-3 right-3 p-2 rounded-lg bg-secondary/80 hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200 opacity-0 group-hover:opacity-100"
                aria-label="Copiar comando"
              >
                {copiedIndex === i ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <pre className="p-4 pr-14 overflow-x-auto">
                <code className="text-sm font-mono text-code-text">{example}</code>
              </pre>
            </div>
          ))}
        </div>
      </div>

      {/* Options */}
      {command.options && command.options.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-primary" />
            Opciones disponibles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {command.options.map((opt, i) => (
              <div
                key={i}
                className="glass rounded-xl p-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="font-mono text-sm font-semibold text-primary mb-1 group-hover:text-foreground transition-colors">
                  {opt.name}
                </div>
                <div className="text-sm text-muted-foreground">{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {command.tags.map((tag, i) => (
          <span
            key={i}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-105 ${
              tag === "peligroso"
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : tag === "producción"
                ? "border-warning/30 bg-warning/10 text-warning"
                : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-primary/10 hover:border-primary/30"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default CommandViewer;
