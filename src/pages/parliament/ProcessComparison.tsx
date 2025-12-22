import { useState, useEffect } from 'react';
import {
  ArrowRight, Scale, Gavel, FileText, CheckCircle, Clock, Users,
  Building, ArrowLeftRight, GitMerge, ArrowUpRight, BookOpen, Menu, Landmark, Shield
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import heroParliament from '@/assets/hero-parliament.jpg';

/**
 * Comparaison des Processus Législatifs
 * Design unifié avec HomeParliament
 */
const ProcessComparison = () => {
  const { t, language, setLanguage, dir } = useLanguage();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const openInNewTab = (path: string) => {
    window.open(path, '_blank', 'noopener,noreferrer');
  };

  const mobileNavItems = [
    { label: t('landing.header.assembly'), path: "/an", icon: Building },
    { label: t('landing.header.senate'), path: "/senat", icon: Landmark },
    { label: t('landing.header.archives'), path: "/archives" },
    { label: t('landing.header.process'), path: "/processus-comparaison" },
    { label: t('landing.header.demo'), path: "/parlement/demo" },
  ];

  const stats = [
    { value: "143", label: t('congress.common.deputies'), icon: Building, color: "text-[#3A87FD]" },
    { value: "102", label: t('congress.common.senators'), icon: Users, color: "text-[#D19C00]" },
    { value: "245", label: "Parlementaires", icon: Scale, color: "text-white" },
    { value: "2", label: "Chambres", icon: Gavel, color: "text-[#77BA41]" },
  ];

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header - Same as HomeParliament */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-slate-700 dark:text-slate-300" />
              <div>
                <h1 className="text-base sm:text-xl font-serif font-bold text-foreground">{t('landing.header.title')}</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openInNewTab("/an")}
                className="text-[#3A87FD] hover:bg-[#3A87FD]/10"
              >
                <Building className="h-4 w-4 mr-1" />
                {t('landing.header.assembly')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openInNewTab("/senat")}
                className="text-[#D19C00] hover:bg-[#D19C00]/10"
              >
                <Landmark className="h-4 w-4 mr-1" />
                {t('landing.header.senate')}
              </Button>
              <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />
              <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 dark:text-slate-400" onClick={() => navigate("/archives")}>
                {t('landing.header.archives')}
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 dark:text-slate-400 bg-slate-100 dark:bg-slate-800" onClick={() => navigate("/processus-comparaison")}>
                {t('landing.header.process')}
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:bg-slate-100 dark:text-slate-400" onClick={() => navigate("/parlement/demo")}>
                {t('landing.header.demo')}
              </Button>
            </nav>

            <div className="flex items-center gap-2">
              <select
                className="hidden sm:block text-sm border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 bg-background cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="en">🇬🇧 EN</option>
                <option value="es">🇪🇸 ES</option>
                <option value="ar">🇸🇦 AR</option>
                <option value="pt">🇵🇹 PT</option>
              </select>

              <Button
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:bg-slate-100"
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

              <Button variant="outline" size="sm" className="hidden sm:flex border-slate-400 text-slate-600 hover:bg-slate-50" onClick={() => navigate("/parlement/login")}>
                {t('landing.header.login')}
              </Button>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="sm">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <div className="flex flex-col gap-4 mt-8">
                    {mobileNavItems.map((item) => (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          if (item.path === '/an' || item.path === '/senat') {
                            openInNewTab(item.path);
                          } else {
                            navigate(item.path);
                          }
                          setMobileMenuOpen(false);
                        }}
                      >
                        {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                        {item.label}
                      </Button>
                    ))}
                    <div className="border-t pt-4">
                      <Button
                        className="w-full"
                        onClick={() => { navigate("/parlement/login"); setMobileMenuOpen(false); }}
                      >
                        {t('landing.header.login')}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroParliament} 
            alt="Processus Législatif Gabonais"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-800/70 to-slate-900/90"></div>
        </div>
        <div className="container mx-auto px-4 py-16 sm:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30" variant="outline">
              <ArrowLeftRight className="h-3 w-3 mr-1" />
              Navette Parlementaire
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4 sm:mb-6 animate-fade-in text-white">
              {t('congress.processComparison.header.title')}
            </h1>
            <p className="text-base sm:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto animate-fade-in px-4" style={{ animationDelay: "0.1s" }}>
              {t('congress.processComparison.header.subtitle')}
            </p>

            {/* Badges AN / Sénat */}
            <div className="flex justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Badge className="bg-[#3A87FD]/80 text-white border-[#3A87FD] px-4 py-2">
                <Building className="w-4 h-4 mr-2" />
                {t('congress.processComparison.header.btnAn')}
              </Badge>
              <Badge className="bg-[#D19C00]/80 text-white border-[#D19C00] px-4 py-2">
                <Landmark className="w-4 h-4 mr-2" />
                {t('congress.processComparison.header.btnSn')}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mt-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="p-4 sm:p-6 text-center bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl sm:text-3xl font-serif font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Navette Schema Section */}
      <section className="py-12 bg-slate-50 dark:bg-slate-950/30">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg">
            <CardHeader className="bg-white dark:bg-slate-900 border-b">
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-purple-600" />
                {t('congress.processComparison.navette.title')}
              </CardTitle>
              <CardDescription>
                {t('congress.processComparison.navette.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-slate-900">
              <div className="relative flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Flèche de fond pour la navette */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#3A87FD]/30 via-purple-200 to-[#D19C00]/30 -z-10 hidden md:block transform -translate-y-1/2" />

                {/* Assemblée Nationale */}
                <div
                  className={`relative z-10 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPhase === 'an' ? 'border-[#3A87FD] bg-[#3A87FD]/10 shadow-lg scale-105' : 'border-[#3A87FD]/30 bg-white dark:bg-slate-800 hover:border-[#3A87FD]/60 hover:shadow-md'}`}
                  onClick={() => setSelectedPhase('an')}
                >
                  <Badge className="mb-2 bg-[#3A87FD] hover:bg-[#3A87FD]">{t('congress.processComparison.phases.depot')}</Badge>
                  <div className="flex flex-col items-center text-center">
                    <Building className="h-8 w-8 text-[#3A87FD] mb-2" />
                    <h3 className="font-bold text-[#3A87FD]">{t('congress.common.an')}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('congress.processComparison.phases.commission')} <br />
                      + {t('congress.processComparison.phases.pleniere')}
                    </p>
                  </div>
                </div>

                {/* Navette aller */}
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-6 w-6 text-purple-500 animate-pulse" />
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-white dark:bg-slate-800 px-2">
                    {t('congress.processComparison.phases.navette')}
                  </span>
                </div>

                {/* Sénat */}
                <div
                  className={`relative z-10 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPhase === 'sn' ? 'border-[#D19C00] bg-[#D19C00]/10 shadow-lg scale-105' : 'border-[#D19C00]/30 bg-white dark:bg-slate-800 hover:border-[#D19C00]/60 hover:shadow-md'}`}
                  onClick={() => setSelectedPhase('sn')}
                >
                  <Badge className="mb-2 bg-[#D19C00] hover:bg-[#D19C00]">{t('congress.processComparison.phases.depot')}</Badge>
                  <div className="flex flex-col items-center text-center">
                    <Landmark className="h-8 w-8 text-[#D19C00] mb-2" />
                    <h3 className="font-bold text-[#D19C00]">{t('congress.common.senate')}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('congress.processComparison.phases.commission')} <br />
                      + {t('congress.processComparison.phases.pleniere')}
                    </p>
                  </div>
                </div>

                {/* Navette retour / CMP */}
                <div className="flex flex-col items-center">
                  <GitMerge className="h-6 w-6 text-amber-500" />
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-white dark:bg-slate-800 px-2">
                    {t('congress.dashboard.quick.cmp.title')}
                  </span>
                </div>

                {/* Adoption Finale */}
                <div
                  className={`relative z-10 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPhase === 'final' ? 'border-[#77BA41] bg-[#77BA41]/10 shadow-lg scale-105' : 'border-[#77BA41]/30 bg-white dark:bg-slate-800 hover:border-[#77BA41]/60 hover:shadow-md'}`}
                  onClick={() => setSelectedPhase('final')}
                >
                  <Badge className="mb-2 bg-[#77BA41] hover:bg-[#77BA41]">{t('congress.processComparison.phases.adoption')}</Badge>
                  <div className="flex flex-col items-center text-center">
                    <Gavel className="h-8 w-8 text-[#77BA41] mb-2" />
                    <h3 className="font-bold text-[#77BA41]">{t('congress.common.session')}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('congress.vote.result.adopted')} <br />
                      {t('congress.common.vote')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Comparaison Détaillée */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-3 text-foreground">Comparaison des Chambres</h2>
            <p className="text-muted-foreground">Rôles et spécificités de chaque chambre parlementaire</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-[#3A87FD]">
              <CardHeader>
                <CardTitle className="text-[#3A87FD] flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {t('congress.processComparison.links.anTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-[#3A87FD] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{t('congress.processComparison.links.composition')}</h4>
                    <p className="text-sm text-muted-foreground">143 {t('congress.common.deputies')} ({t('congress.processComparison.links.directSuffrage')})</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#3A87FD] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{t('congress.processComparison.links.mandateDuration')}</h4>
                    <p className="text-sm text-muted-foreground">{t('congress.processComparison.links.years5')}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 text-[#3A87FD] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{t('congress.processComparison.links.specificRole')}</h4>
                    <p className="text-sm text-muted-foreground">{t('congress.processComparison.links.anLastWord')}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-[#3A87FD] hover:text-[#3A87FD] border-[#3A87FD]/30 hover:bg-[#3A87FD]/10"
                  onClick={() => openInNewTab("/an")}
                >
                  {t('congress.processComparison.links.anDesc')} <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-[#D19C00]">
              <CardHeader>
                <CardTitle className="text-[#D19C00] flex items-center gap-2">
                  <Landmark className="h-5 w-5" />
                  {t('congress.processComparison.links.snTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-[#D19C00] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{t('congress.processComparison.links.composition')}</h4>
                    <p className="text-sm text-muted-foreground">102 {t('congress.common.senators')} ({t('congress.processComparison.links.indirectSuffrage')})</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#D19C00] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{t('congress.processComparison.links.mandateDuration')}</h4>
                    <p className="text-sm text-muted-foreground">{t('congress.processComparison.links.years6')}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 text-[#D19C00] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">{t('congress.processComparison.links.specificRole')}</h4>
                    <p className="text-sm text-muted-foreground">{t('congress.processComparison.links.snLocalAuthorities')}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full text-[#D19C00] hover:text-[#D19C00] border-[#D19C00]/30 hover:bg-[#D19C00]/10"
                  onClick={() => openInNewTab("/senat")}
                >
                  {t('congress.processComparison.links.snDesc')} <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-8 w-8 text-white" />
                <div>
                  <h3 className="font-serif font-bold text-white text-lg">Parlement du Gabon</h3>
                  <p className="text-slate-400 text-sm">Processus Législatif</p>
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Découvrez le fonctionnement du bicamérisme gabonais et le parcours des textes législatifs entre l'Assemblée Nationale et le Sénat.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate("/")} className="hover:text-white transition-colors">Accueil</button></li>
                <li><button onClick={() => navigate("/archives")} className="hover:text-white transition-colors">Archives Nationales</button></li>
                <li><button onClick={() => openInNewTab("/an")} className="hover:text-white transition-colors">Assemblée Nationale</button></li>
                <li><button onClick={() => openInNewTab("/senat")} className="hover:text-white transition-colors">Sénat</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Contact</h4>
              <p className="text-sm text-slate-400">
                Boulevard Triomphal<br />
                Libreville, Gabon<br />
                contact@parlement.ga
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 text-center">
            <p className="text-xs text-slate-500">
              © 2024 Parlement de la République Gabonaise • Union - Travail - Justice
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProcessComparison;
