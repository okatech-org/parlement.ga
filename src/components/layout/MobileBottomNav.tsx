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
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border z-40">
      <div className="flex items-center justify-between px-2 py-2">
        {/* Left side - First 2 items */}
        <div className="flex gap-1">
          {displayItems.slice(0, 2).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setActiveSection(item.id)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Center - iAsted Button */}
        <div className="flex-shrink-0">{iastedButton}</div>

        {/* Right side - 3rd item + Menu */}
        <div className="flex gap-1">
          {displayItems[2] && (
            <Button
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                activeSection === displayItems[2].id
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveSection(displayItems[2].id)}
            >
              {(() => {
                const Icon = displayItems[2].icon;
                return <Icon className="h-5 w-5" />;
              })()}
              <span className="text-xs font-medium">{displayItems[2].label}</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3 text-muted-foreground"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs font-medium">Menu</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
