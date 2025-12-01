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
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-serif font-bold">{title}</h2>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={userContext.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userContext.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              {userContext.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="p-2">
          {customNav ? (
            customNav
          ) : (
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      isActive ? "bg-primary/10 text-primary font-semibold" : ""
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};
