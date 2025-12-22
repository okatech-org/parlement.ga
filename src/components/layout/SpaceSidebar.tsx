import { ReactNode } from "react";
import { LogOut, User, Sun, Moon, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "next-themes";
import { useState } from "react";
import RoleSwitcher from "@/components/RoleSwitcher";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export interface NavItemType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItemType[];
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
  const { theme, setTheme } = useTheme();
  const [openGroups, setOpenGroups] = useState<string[]>([navItems[0]?.id || ""]);

  const toggleGroup = (id: string) => {
    setOpenGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* User Profile Card */}
      <div className="p-4">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-sidebar-accent/50">
          <Avatar className="h-12 w-12 border-2 border-sidebar-border shrink-0">
            <AvatarImage src={userContext.avatar} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-lg font-bold">
              {userContext.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-base font-serif font-bold leading-tight text-white">
              {userContext.name}
            </p>
            <p className="text-sm text-sidebar-foreground/70 mt-0.5">
              {userContext.role}
            </p>
          </div>
        </div>
        <div className="mt-2">
          <RoleSwitcher />
        </div>
      </div>

      {/* Main Role Dropdown */}
      <div className="px-4 pb-2">
        <Collapsible open={openGroups.includes("role")} onOpenChange={() => toggleGroup("role")}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 transition-colors">
              <span className="font-medium text-sm">{title}</span>
              {openGroups.includes("role") ? (
                <ChevronUp className="h-4 w-4 text-sidebar-foreground/60" />
              ) : (
                <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
              )}
            </button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      {/* Navigation Label */}
      <div className="px-6 py-2">
        <span className="text-[10px] uppercase tracking-wider text-sidebar-foreground/40 font-medium">
          Navigation
        </span>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="space-y-1">
          {customNav ? (
            customNav
          ) : (
            navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const hasChildren = item.children && item.children.length > 0;

              if (hasChildren) {
                return (
                  <Collapsible
                    key={item.id}
                    open={openGroups.includes(item.id)}
                    onOpenChange={() => toggleGroup(item.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <button
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${isActive
                          ? "bg-sidebar-accent text-sidebar-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${openGroups.includes(item.id) ? "rotate-180" : ""}`} />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-6 space-y-1 mt-1">
                      {item.children?.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = activeSection === child.id;
                        return (
                          <button
                            key={child.id}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${isChildActive
                              ? "bg-sidebar-accent text-sidebar-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                              }`}
                            onClick={() => setActiveSection(child.id)}
                          >
                            <ChildIcon className="h-4 w-4" />
                            <span>{child.label}</span>
                          </button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                );
              }

              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${isActive
                    ? "bg-sidebar-accent text-sidebar-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 space-y-1 border-t border-sidebar-border">
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors text-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>{theme === "dark" ? "Clair" : "Sombre"}</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors text-sm"
          onClick={() => setActiveSection("parametres")}
        >
          <Settings className="h-4 w-4" />
          <span>Paramètres</span>
        </button>
        <button
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 hover:text-red-600 transition-colors text-sm"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};
