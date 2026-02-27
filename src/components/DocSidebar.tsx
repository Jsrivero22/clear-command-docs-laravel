import { useState, useMemo } from "react";
import { commands, categoryIcons } from "@/data/artisanCommands";
import { Search, Terminal, X } from "lucide-react";

interface DocSidebarProps {
  activeCommand: string | null;
  onSelectCommand: (category: string, commandName: string) => void;
}

const DocSidebar = ({ activeCommand, onSelectCommand }: DocSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return commands;

    const query = searchQuery.toLowerCase();
    const filtered: typeof commands = {};

    Object.entries(commands).forEach(([category, cmds]) => {
      const matchedCmds = cmds.filter(
        (cmd) =>
          cmd.name.toLowerCase().includes(query) ||
          cmd.description.toLowerCase().includes(query) ||
          cmd.tags.some((t) => t.toLowerCase().includes(query))
      );
      if (matchedCmds.length > 0) {
        filtered[category] = matchedCmds;
      }
    });

    return filtered;
  }, [searchQuery]);

  const totalCommands = useMemo(
    () => Object.values(commands).reduce((acc, cmds) => acc + cmds.length, 0),
    []
  );

  return (
    <aside className="w-72 shrink-0 h-screen sticky top-0 overflow-y-auto glass-strong border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-border/30">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient-accent">Artisan CLI</h1>
            <p className="text-xs text-muted-foreground">Laravel 11 & 12 • {totalCommands} comandos</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar comandos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-sm rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {Object.keys(filteredCategories).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No se encontraron comandos
          </div>
        ) : (
          Object.entries(filteredCategories).map(([category, cmds]) => (
            <div key={category} className="mb-4">
              <div className="flex items-center gap-1.5 px-2 mb-1.5">
                <span className="text-xs">{categoryIcons[category] || "📦"}</span>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {category}
                </span>
                <span className="text-[10px] text-muted-foreground/60 ml-auto">{cmds.length}</span>
              </div>
              <ul className="space-y-0.5">
                {cmds.map((cmd) => (
                  <li key={cmd.name}>
                    <button
                      onClick={() => onSelectCommand(category, cmd.name)}
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-md transition-all duration-200 font-mono ${
                        activeCommand === cmd.name
                          ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/20"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground hover:translate-x-1"
                      }`}
                    >
                      {cmd.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </nav>
    </aside>
  );
};

export default DocSidebar;
