import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpaceSidebar, NavItemType } from "./SpaceSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { IAstedButton } from "../iasted/IAstedButton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface AdminSpaceLayoutProps {
  children: ReactNode;
  title: string;
  userContext: {
    name: string;
    role: string;
    avatar?: string;
  };
  navItems: NavItemType[];
  activeSection: string;
  setActiveSection: (section: string) => void;
  customSidebarNav?: ReactNode;
  quickAccessItems?: NavItemType[];
}

export const AdminSpaceLayout = ({
  children,
  title,
  userContext,
  navItems,
  activeSection,
  setActiveSection,
  customSidebarNav,
  quickAccessItems,
}: AdminSpaceLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [iastedOpen, setIastedOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    navigate("/");
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-border bg-card">
        <SpaceSidebar
          title={title}
          userContext={userContext}
          navItems={navItems}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          customNav={customSidebarNav}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        >
          <aside
            className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-serif font-bold">{title}</h2>
              <Button variant="ghost" size="icon" onClick={closeSidebar}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SpaceSidebar
              title={title}
              userContext={userContext}
              navItems={navItems}
              activeSection={activeSection}
              setActiveSection={(section) => {
                setActiveSection(section);
                closeSidebar();
              }}
              customNav={customSidebarNav}
              onLogout={handleLogout}
              hideBranding
            />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-sm font-serif font-bold">{title}</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>

        {/* Desktop iAsted Button (Floating) */}
        <div className="hidden md:block fixed bottom-8 right-8 z-30">
          <IAstedButton
            isOpen={iastedOpen}
            onToggle={() => setIastedOpen(!iastedOpen)}
          />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <MobileBottomNav
            items={quickAccessItems || navItems.slice(0, 3)}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            onMenuClick={toggleSidebar}
            iastedButton={
              <IAstedButton
                isOpen={iastedOpen}
                onToggle={() => setIastedOpen(!iastedOpen)}
                variant="mobile"
              />
            }
          />
        </div>
      </div>
    </div>
  );
};
