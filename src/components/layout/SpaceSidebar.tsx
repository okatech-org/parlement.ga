import { ReactNode } from "react";
import { Shield, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface NavItemType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface SpaceSidebarProps {
  title: string;
  userContext: {
    name: string;
    role: string;
    avatar?: string;
  };
  navItems: NavItemType[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  customNav?: ReactNode;
  onLogout: () => void;
  hideBranding?: boolean;
}

export const SpaceSidebar = ({
  title,
  userContext,
  navItems,
  activeSection,
  setActiveSection,
  customNav,
  onLogout,
  hideBranding,
}: SpaceSidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Branding */}
      {!hideBranding && (
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl neu-inset text-primary">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-serif font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{title}</h2>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="p-6 border-b border-border/50">
        <div className="neu-raised p-4 rounded-xl flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
            <AvatarImage src={userContext.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{userContext.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {userContext.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-4">
          {customNav ? (
            customNav
          ) : (
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${isActive
                        ? "neu-inset text-primary"
                        : "neu-raised hover:text-primary hover:translate-y-[-2px]"
                      }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t border-border/50">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 neu-raised"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};
