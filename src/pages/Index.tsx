import { useState, useMemo } from "react";
import DocSidebar from "@/components/DocSidebar";
import CommandViewer from "@/components/CommandViewer";
import MobileSidebar from "@/components/MobileSidebar";
import { commands } from "@/data/artisanCommands";
import { Terminal, BookOpen, Menu } from "lucide-react";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Generales");
  const [activeCommandName, setActiveCommandName] = useState("about");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeCommand = useMemo(() => {
    return commands[activeCategory]?.find((c) => c.name === activeCommandName) || null;
  }, [activeCategory, activeCommandName]);

  const handleSelectCommand = (category: string, commandName: string) => {
    setActiveCategory(category);
    setActiveCommandName(commandName);
    setMobileOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block relative z-10">
        <DocSidebar activeCommand={activeCommandName} onSelectCommand={handleSelectCommand} />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        activeCommand={activeCommandName}
        onSelectCommand={handleSelectCommand}
      />

      {/* Main content */}
      <main className="flex-1 relative z-10 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-20 glass-strong border-b border-border/30 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg bg-secondary hover:bg-primary/20 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm text-gradient-accent">Artisan CLI</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-10 lg:py-14">
          {/* Hero - only shows when first command */}
          {activeCommandName === "about" && activeCategory === "Generales" && (
            <header className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-gradient-hero mb-3 leading-tight">
                Guía Completa de Artisan CLI
              </h1>
              <p className="text-lg text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Referencia interactiva de todos los comandos Artisan para Laravel
              </p>
            </header>
          )}

          {activeCommand && (
            <CommandViewer command={activeCommand} category={activeCategory} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
