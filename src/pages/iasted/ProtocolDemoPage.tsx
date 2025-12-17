import React from 'react';
import {
  Landmark, Users, Crown, PlayCircle, Monitor, CheckCircle, LogIn, UserCircle, FileText, UserCheck, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ProtocolDemoSection } from '@/components/iasted/ProtocolDemoSection';
import { useLanguage } from '@/contexts/LanguageContext';
import InstitutionSubHeader from '@/components/layout/InstitutionSubHeader';

const ProtocolDemoPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
      {/* Unified Header with mobile navigation */}
      <InstitutionSubHeader
        institution="AN"
        pageTitle={t('assembly.demo.headerTitle')}
        pageSubtitle={t('assembly.demo.headerDesc')}
        pageIcon={PlayCircle}
      />

      {/* Hero compact */}
      <section className="py-8 sm:py-12 bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
            <PlayCircle className="h-3 w-3 mr-1" />
            {t('assembly.demo.badge')}
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold mb-2 sm:mb-3">
            {t('assembly.demo.heroTitle')}
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
            {t('assembly.demo.heroDesc')}
          </p>
          <Button variant="outline" size="sm" className="sm:h-10 sm:px-4" onClick={() => navigate("/an/espace/deputes")}>
            <Monitor className="mr-2 h-4 w-4" />
            {t('assembly.demo.directAccess')}
          </Button>
        </div>
      </section>

      {/* Cartes d'accès */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              {t('assembly.demo.cardsTitle')}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {t('assembly.demo.cardsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-6">
            {Object.entries(AN_DEMO_CARDS).map(([key, category]) => {
              const CategoryIcon = category.icon;
              return (
                <div key={key} className="space-y-3 sm:space-y-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <CategoryIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${category.color}`} />
                    {category.title}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {category.accounts.map((account) => {
                      const Icon = account.icon;
                      return (
                        <Card
                          key={account.label}
                          className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 active:scale-[0.98]"
                          onClick={() => handleDemoLogin(account.phone, account.path)}
                        >
                          <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                            {/* En-tête avec icône et label */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center`}>
                                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${account.color}`} />
                                </div>
                                <div>
                                  <h5 className="font-medium text-xs sm:text-sm">{account.label}</h5>
                                  <Badge variant="secondary" className="text-[10px] sm:text-xs mt-0.5">
                                    {account.role}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Fonctionnalités */}
                            <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
                              {account.features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500 flex-shrink-0" />
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
      <section className="container mx-auto px-4 pb-8 sm:pb-12">
        <div className="mb-6 sm:mb-8 text-center">
          <Badge variant="outline" className="mb-2 text-xs sm:text-sm">Intelligence Artificielle</Badge>
          <h2 className="text-xl sm:text-2xl font-bold font-serif mb-2">{t('assembly.demo.protocolTitle')}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground px-2">{t('assembly.demo.protocolDesc')}</p>
        </div>
        <ProtocolDemoSection />
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 sm:py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-3 sm:mb-4">
            <Landmark className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="font-serif font-bold text-sm sm:text-base">{t('assembly.layout.breadcrumbAN')}</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('assembly.footer.address')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProtocolDemoPage;
