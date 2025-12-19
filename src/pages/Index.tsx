import { useState, useEffect } from "react";
import { Landmark, Users, FileText, Map, Vote, Shield, ChevronRight, BarChart3, Scale, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";
import { NotificationCenter } from "@/components/parliamentary/NotificationCenter";
import { AmendmentDetailModal } from "@/components/parliamentary/AmendmentDetailModal";
import { useParliamentaryNotifications } from "@/hooks/useParliamentaryNotifications";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage, dir } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedAmendmentId, setSelectedAmendmentId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  } = useParliamentaryNotifications(userId);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const handleNotificationClick = (notification: any) => {
    if (notification.metadata?.amendmentId) {
      setSelectedAmendmentId(notification.metadata.amendmentId);
    }
  };

  const features = [
    {
      icon: Vote,
      title: t('home.features.vote.title'),
      description: t('home.features.vote.desc'),
      color: "primary",
      path: "/vote"
    },
    {
      icon: FileText,
      title: t('home.features.legislation.title'),
      description: t('home.features.legislation.desc'),
      color: "secondary",
      path: "/legislation"
    },
    {
      icon: Map,
      title: t('home.features.territory.title'),
      description: t('home.features.territory.desc'),
      color: "accent",
      path: "/territoire"
    },
    {
      icon: BarChart3,
      title: t('home.features.statistics.title'),
      description: t('home.features.statistics.desc'),
      color: "primary",
      path: "/statistiques"
    }
  ];

  const stats = [
    { value: "14e", label: t('home.stats.legislature') },
    { value: "120", label: t('home.stats.deputies') },
    { value: "150+", label: t('home.stats.lawsVoted') },
    { value: "100%", label: t('home.stats.digital') }
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Landmark className="h-6 w-6 sm:h-8 sm:w-8 text-[#3A87FD]" />
              <div>
                <h1 className="text-base sm:text-xl font-serif font-bold text-foreground">{t('institutions.ASSEMBLY.name')}</h1>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              {/* Lien retour vers Parlement (hub central) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300"
              >
                <Scale className="h-4 w-4 mr-1" />
                {t('assembly.layout.parliament')}
              </Button>
              <div className="w-px h-6 bg-border" />
              <Button variant="ghost" size="sm" onClick={() => navigate("/an/actualites")}>
                {t('home.resources.news.title')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/an/sensibilisation")}>
                {t('home.resources.awareness.title')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/an/tutoriels")}>
                {t('home.resources.tutorials.title')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/an/processus")}>
                {t('assembly.nav.process')}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/an/demo")}>
                {t('assembly.nav.demo')}
              </Button>
            </nav>
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                className="text-sm border border-border rounded-md px-2 py-1 bg-background cursor-pointer hover:bg-muted transition-colors"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
                <option value="es">🇪🇸 Español</option>
                <option value="ar">🇸🇦 العربية</option>
                <option value="pt">🇵🇹 Português</option>
              </select>

              {/* Notification Center - Only for authenticated users */}
              {userId && (
                <NotificationCenter
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  onClear={clearNotifications}
                  onNotificationClick={handleNotificationClick}
                />
              )}

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                title={t('common.changeTheme')}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {mounted && theme === "dark" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </Button>

              {/* Login Button */}
              <Button variant="outline" size="sm" onClick={() => navigate("/an/login")} className="hidden sm:flex">
                {t('common.login')}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* Amendment Detail Modal */}
            <AmendmentDetailModal
              amendmentId={selectedAmendmentId}
              open={!!selectedAmendmentId}
              onOpenChange={(open) => !open && setSelectedAmendmentId(null)}
            />
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border py-3 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { navigate("/"); setMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                <Scale className="h-4 w-4 mr-2" />
                {t('assembly.layout.parliament')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { navigate("/an/actualites"); setMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                {t('home.resources.news.title')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { navigate("/an/sensibilisation"); setMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                {t('home.resources.awareness.title')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { navigate("/an/tutoriels"); setMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                {t('home.resources.tutorials.title')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { navigate("/an/processus"); setMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                {t('assembly.nav.process')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { navigate("/an/demo"); setMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                {t('assembly.nav.demo')}
              </Button>
              <div className="border-t border-border pt-2 mt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => { navigate("/an/login"); setMobileMenuOpen(false); }}
                  className="w-full"
                >
                  {t('common.login')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 py-12 sm:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-[#3A87FD]/10 text-[#3A87FD] border-[#3A87FD]/20" variant="outline">
              {t('home.badge')}
            </Badge>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold mb-4 sm:mb-6 animate-fade-in">
              {t('home.title')}
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
              {t('home.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Button size="lg" className="shadow-elegant" onClick={() => navigate("/legislation")}>
                <FileText className="mr-2 h-5 w-5" />
                {t('home.followLaws')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/territoire")}>
                <Map className="mr-2 h-5 w-5" />
                {t('home.exploreMap')}
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-10 sm:mt-16 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-4 sm:p-6 text-center bg-card shadow-card-custom border-border/50 hover:shadow-elegant transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="text-2xl sm:text-3xl font-serif font-bold text-[#3A87FD] mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-12 sm:py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-3 sm:mb-4">{t('home.resources.title')}</h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.resources.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card
              className="p-8 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 cursor-pointer border-red-600/20 animate-fade-in"
              onClick={() => navigate("/actualites")}
            >
              <div className="w-16 h-16 rounded-full bg-red-600/10 flex items-center justify-center mb-4 mx-auto">
                <FileText className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-center">{t('home.resources.news.title')}</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {t('home.resources.news.desc')}
              </p>
              <Button className="w-full shadow-elegant bg-red-600 hover:bg-red-700">
                {t('home.resources.news.action')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            <Card
              className="p-8 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 cursor-pointer border-amber-600/20 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
              onClick={() => navigate("/sensibilisation")}
            >
              <div className="w-16 h-16 rounded-full bg-amber-600/10 flex items-center justify-center mb-4 mx-auto">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-center">{t('home.resources.awareness.title')}</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {t('home.resources.awareness.desc')}
              </p>
              <Button className="w-full shadow-elegant bg-amber-600 hover:bg-amber-700">
                {t('home.resources.awareness.action')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>

            <Card
              className="p-8 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 cursor-pointer border-indigo-600/20 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
              onClick={() => navigate("/tutoriels")}
            >
              <div className="w-16 h-16 rounded-full bg-indigo-600/10 flex items-center justify-center mb-4 mx-auto">
                <BarChart3 className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-serif font-semibold mb-3 text-center">{t('home.resources.tutorials.title')}</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                {t('home.resources.tutorials.desc')}
              </p>
              <Button variant="outline" className="w-full shadow-elegant border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white">
                {t('home.resources.tutorials.action')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-3 sm:mb-4">{t('home.features.title')}</h2>
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 bg-card shadow-card-custom hover:shadow-elegant transition-all duration-300 cursor-pointer border-border/50 animate-slide-in-right"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => navigate(feature.path)}
                >
                  <div className={`w-12 h-12 rounded-lg bg-${feature.color}/10 flex items-center justify-center mb-4 transition-transform duration-300 ${hoveredCard === index ? 'scale-110' : ''}`}>
                    <Icon className={`h-6 w-6 text-${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-serif font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                  <ChevronRight className={`h-5 w-5 text-muted-foreground mt-4 transition-transform duration-300 ${hoveredCard === index ? 'translate-x-2' : ''}`} />
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Banner */}
      <section className="py-10 sm:py-16 bg-[#3A87FD]/5 border-y border-[#3A87FD]/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-[#3A87FD]" />
              <div>
                <div className="font-semibold text-sm sm:text-base">{t('home.security.maxSecurity')}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{t('home.security.encryption')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
              <div>
                <div className="font-semibold text-sm sm:text-base">{t('home.security.auth2fa')}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{t('home.security.secureAccess')}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Landmark className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
              <div>
                <div className="font-semibold text-sm sm:text-base">{t('home.security.sovereignty')}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{t('home.security.dataLoc')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-6 w-6 text-[#3A87FD]" />
                <span className="font-serif font-bold">{t('institutions.ASSEMBLY.name')}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('common.copyright')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('common.quickLinks')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/legislation" className="hover:text-[#3A87FD] transition-colors">{t('home.features.legislation.title')}</a></li>
                <li><a href="/vote" className="hover:text-[#3A87FD] transition-colors">{t('hub.roles.deputy.title')}</a></li>
                <li><a href="/territoire" className="hover:text-[#3A87FD] transition-colors">{t('home.features.territory.title')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('common.contact')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('common.address')}<br />
                {t('common.email')}
              </p>
            </div>
          </div>
          <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm text-muted-foreground">
            {t('common.copyright')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
