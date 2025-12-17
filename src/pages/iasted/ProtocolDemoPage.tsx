import React, { useState } from 'react';
import {
  Landmark, Users, Crown, PlayCircle, Monitor, CheckCircle, LogIn, Sun, Moon, Home, Briefcase, UserCircle, AlertTriangle, FileText, UserCheck, Shield, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { ProtocolDemoSection } from '@/components/iasted/ProtocolDemoSection';
import { useLanguage } from '@/contexts/LanguageContext';

const ProtocolDemoPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const AN_DEMO_CARDS = {
    bureau: {
      title: t('assembly.demo.roles.bureau'),
      icon: Crown,
      color: "text-amber-500",
      accounts: [
        {
          label: t('assembly.demo.roles.president'),
          phone: '01010101',
          path: '/an/espace/president',
          icon: Crown,
          color: 'text-amber-500',
          role: 'Présidence',
          features: ['Validation de lois', 'Ordre du jour', 'Diplomatie parlementaire', 'Supervision']
        },
        {
          label: t('assembly.demo.roles.vp'),
          phone: '02020202',
          path: '/an/espace/vp',
          icon: Crown,
          color: 'text-amber-400',
          role: 'Vice-présidence',
          features: ['Suppléance présidence', 'Gestion commissions', 'Représentation']
        },
        {
          label: t('assembly.demo.roles.questeur'),
          phone: '04040401',
          path: '/an/espace/questeurs',
          icon: Shield,
          color: 'text-blue-500',
          role: 'Questure',
          features: ['Budget Assemblée', 'Gestion personnel', 'Logistique', 'Indemnités']
        },
      ]
    },
    parlementaires: {
      title: t('assembly.demo.roles.deputies'),
      icon: Users,
      color: "text-primary",
      accounts: [
        {
          label: t('assembly.demo.roles.deputy'),
          phone: '00000000',
          path: '/an/espace/deputes',
          icon: UserCheck,
          color: 'text-primary',
          role: 'Député',
          features: ['Travaux législatifs', 'Amendements', 'Questions Gvt', 'Vote solennel']
        },
        {
          label: t('assembly.demo.roles.secretary'),
          phone: '05050505',
          path: '/an/espace/secretaires',
          icon: FileText,
          color: 'text-green-500',
          role: 'Secrétariat',
          features: ['Procès-verbaux', 'Contrôle présence', 'Dépouillement', 'Archives']
        },
        {
          label: t('assembly.demo.roles.substitute'),
          phone: '03030303',
          path: '/an/espace/suppleants',
          icon: Users,
          color: 'text-slate-500',
          role: 'Suppléance',
          features: ['Suivi dossier', 'Remplacement', 'Doléances', 'Veille']
        },
      ]
    },
    public: {
      title: t('assembly.demo.roles.public'),
      icon: UserCircle,
      color: "text-green-500",
      accounts: [
        {
          label: t('assembly.demo.roles.citizen'),
          phone: null,
          path: '/parlement/citoyen',
          icon: UserCircle,
          color: 'text-green-500',
          role: 'Public',
          features: ['Suivi lois', 'Contact élus', 'Pétitions', 'Actualités']
        },
      ]
    }
  };

  const handleDemoLogin = (phone: string | null, redirectPath: string) => {
    if (!phone) {
      navigate(redirectPath);
      return;
    }

    const mockUsers: Record<string, { name: string; roles: string[] }> = {
      '01010101': { name: 'Michel Régis Onanga Ndiaye', roles: ['president', 'deputy', 'citizen'] },
      '02020202': { name: 'François Ndong Obiang', roles: ['vp', 'deputy', 'citizen'] },
      '03030303': { name: 'M. Suppléant', roles: ['substitute', 'citizen'] },
      '04040401': { name: 'Questeur Budget', roles: ['questeur_budget', 'citizen'] },
      '05050505': { name: 'M. Secrétaire', roles: ['secretary', 'citizen'] },
      '00000000': { name: 'Honorable Député', roles: ['deputy', 'citizen'] },
    };

    const userData = mockUsers[phone] || { name: 'Député Démo', roles: ['deputy', 'citizen'] };
    const user = {
      id: phone,
      name: userData.name,
      phoneNumber: phone,
      roles: userData.roles,
    };

    sessionStorage.setItem('user_data', JSON.stringify(user));
    sessionStorage.setItem('current_role', userData.roles[0]);
    sessionStorage.setItem('is_demo', 'true');

    toast.success('Connexion démo réussie !');
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-8 w-8 sm:h-9 sm:w-9">
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Separator orientation="vertical" className="h-5 sm:h-6 hidden sm:block" />
              <Landmark className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
              <div>
                <h1 className="text-sm sm:text-xl font-serif font-bold text-foreground">{t('assembly.demo.headerTitle')}</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">{t('assembly.demo.headerDesc')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:flex">{t('assembly.layout.breadcrumbAN')}</Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden h-8 w-8"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t border-border py-3 space-y-1 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { navigate("/an"); setMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                <Landmark className="h-4 w-4 mr-2" />
                {t('assembly.layout.breadcrumbAN')}
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
                onClick={() => { navigate("/an/actualites"); setMobileMenuOpen(false); }}
                className="w-full justify-start"
              >
                {t('home.resources.news.title')}
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

      {/* Hero compact */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <PlayCircle className="h-3 w-3 mr-1" />
            {t('assembly.demo.badge')}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-3">
            {t('assembly.demo.heroTitle')}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {t('assembly.demo.heroDesc')}
          </p>
          <Button variant="outline" onClick={() => navigate("/an/espace/deputes")}>
            <Monitor className="mr-2 h-4 w-4" />
            {t('assembly.demo.directAccess')}
          </Button>
        </div>
      </section>

      {/* Cartes d'accès */}
      <div className="container mx-auto px-4 py-12">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              {t('assembly.demo.cardsTitle')}
            </CardTitle>
            <CardDescription>
              {t('assembly.demo.cardsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {Object.entries(AN_DEMO_CARDS).map(([key, category]) => {
              const CategoryIcon = category.icon;
              return (
                <div key={key} className="space-y-4">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <CategoryIcon className={`w-4 h-4 ${category.color}`} />
                    {category.title}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.accounts.map((account) => {
                      const Icon = account.icon;
                      return (
                        <Card
                          key={account.label}
                          className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200"
                          onClick={() => handleDemoLogin(account.phone, account.path)}
                        >
                          <CardContent className="p-4 space-y-3">
                            {/* En-tête avec icône et label */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                                  <Icon className={`w-5 h-5 ${account.color}`} />
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">{account.label}</h5>
                                  <Badge variant="secondary" className="text-xs mt-0.5">
                                    {account.role}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Fonctionnalités */}
                            <div className="grid grid-cols-2 gap-1.5">
                              {account.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                  <span className="truncate">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                  {key !== 'public' && <Separator className="mt-6" />}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Protocol Demo Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="mb-8 text-center">
          <Badge variant="outline" className="mb-2">Intelligence Artificielle</Badge>
          <h2 className="text-2xl font-bold font-serif mb-2">{t('assembly.demo.protocolTitle')}</h2>
          <p className="text-muted-foreground">{t('assembly.demo.protocolDesc')}</p>
        </div>
        <ProtocolDemoSection />
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Landmark className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold">{t('assembly.layout.breadcrumbAN')}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('assembly.footer.address')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProtocolDemoPage;
