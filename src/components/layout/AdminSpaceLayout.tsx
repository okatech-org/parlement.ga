import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpaceSidebar, NavItemType } from "./SpaceSidebar";
import { MobileBottomNav } from "./MobileBottomNav";
import { IAstedButton } from "../iasted/IAstedButton";
import { useNavigate, useLocation } from "react-router-dom";
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
  onLogout?: () => void;
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
  onLogout,
}: AdminSpaceLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [iastedOpen, setIastedOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    const isDemo = sessionStorage.getItem('is_demo') === 'true';
    const origin = sessionStorage.getItem('auth_origin');

    // Clear Session
    sessionStorage.removeItem('user_data');
    sessionStorage.removeItem('current_role');
    sessionStorage.removeItem('auth_origin');

    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });

    if (origin) {
      if (isDemo) {
        if (origin === '/an') navigate('/an/demo');
        else if (origin === '/senat') navigate('/senat/demo');
        else navigate('/congres/demo');
      } else {
        navigate(origin);
      }
      return;
    }

    if (isDemo) {
      if (location.pathname.includes('/senat')) {
        navigate('/senat/demo');
      } else {
        navigate('/congres/demo');
      }
    } else {
      if (location.pathname.includes('/senat')) {
        navigate('/senat');
      } else if (location.pathname.includes('/an')) {
        navigate('/an');
      } else {
        navigate('/parlement');
      }
    }
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-sidebar border-r border-sidebar-border z-20 flex-shrink-0">
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        >
          <aside
            className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h2 className="text-xl font-serif font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{title}</h2>
              <Button variant="ghost" size="icon" onClick={closeSidebar} className="neu-icon-btn">
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="neu-icon-btn">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-serif font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{title}</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto pb-24 md:pb-8 p-4 md:p-8">
          <div className="max-w-7xl mx-auto animate-fade-in">
            {children}
          </div>
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
