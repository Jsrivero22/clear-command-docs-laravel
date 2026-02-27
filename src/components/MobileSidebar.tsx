import DocSidebar from "@/components/DocSidebar";
import { X } from "lucide-react";

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
  activeCommand: string | null;
  onSelectCommand: (category: string, commandName: string) => void;
}

const MobileSidebar = ({ open, onClose, activeCommand, onSelectCommand }: MobileSidebarProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="relative w-72 h-full animate-in slide-in-from-left duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg bg-secondary hover:bg-destructive/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <DocSidebar activeCommand={activeCommand} onSelectCommand={onSelectCommand} />
      </div>
    </div>
  );
};

export default MobileSidebar;
