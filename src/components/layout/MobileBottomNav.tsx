import { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavItemType } from "./SpaceSidebar";

interface MobileBottomNavProps {
  items: NavItemType[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  onMenuClick: () => void;
  iastedButton: ReactNode;
}

export const MobileBottomNav = ({
  items,
  activeSection,
  setActiveSection,
  onMenuClick,
  iastedButton,
}: MobileBottomNavProps) => {
  // Limit to 3 quick access items for symmetry (2 left + center + 1 right + menu)
  const displayItems = items.slice(0, 3);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 z-40 shadow-elegant">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - First 2 items */}
        <div className="flex gap-2">
          {displayItems.slice(0, 2).map((item) => {
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
        </div>

        {/* Center - iAsted Button */}
        <div className="flex-shrink-0 -mt-8">{iastedButton}</div>

        {/* Right side - 3rd item + Menu */}
        <div className="flex gap-2">
          {displayItems[2] && (
            <button
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${activeSection === displayItems[2].id
                  ? "neu-inset text-primary"
                  : "text-muted-foreground hover:text-primary"
                }`}
              onClick={() => setActiveSection(displayItems[2].id)}
            >
              {(() => {
                const Icon = displayItems[2].icon;
                return <Icon className="h-5 w-5" />;
              })()}
              <span className="text-[10px] font-medium">{displayItems[2].label}</span>
            </button>
          )}
          <button
            className="flex flex-col items-center gap-1 p-2 rounded-xl text-muted-foreground hover:text-primary transition-all duration-200"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
