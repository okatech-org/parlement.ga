import { Menu } from "lucide-react";
import { NavItemType } from "./SpaceSidebar";

interface MobileBottomNavProps {
  items: NavItemType[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  onMenuClick: () => void;
}

export const MobileBottomNav = ({
  items,
  activeSection,
  setActiveSection,
  onMenuClick,
}: MobileBottomNavProps) => {
  // Limit to 4 quick access items for symmetry
  const displayItems = items.slice(0, 4);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-40 shadow-elegant">
      <div className="flex items-center justify-around px-4 py-3">
        {displayItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${isActive
                  ? "neu-inset text-primary"
                  : "text-muted-foreground hover:text-primary"
                }`}
              onClick={() => setActiveSection(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          className="flex flex-col items-center gap-1 p-2 rounded-xl text-muted-foreground hover:text-primary transition-all duration-200"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </div>
  );
};
