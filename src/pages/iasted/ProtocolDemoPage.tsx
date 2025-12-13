/**
 * Page de démonstration du Protocole Parlementaire iAsted
 * 
 * Visualise les différentes salutations et interactions 
 * selon les rôles parlementaires (Député, Sénateur, Président, etc.)
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  SocialProtocolAdapter, 
  ParliamentaryRole 
} from '@/Consciousness/SocialProtocolAdapter';
import { 
  ParliamentaryRole as ParliamentaryRoleEnum,
  PARLIAMENTARY_ROLE_DEFINITIONS,
  isParliamentarian,
  isBureauMember,
  canVote,
  canSubmitAmendment,
  getHonorific
} from '@/Cortex/entities/ParliamentaryRole';
import { 
  Crown, 
  Users, 
  UserCheck, 
  Mic2, 
  FileText, 
  Vote,
  Clock,
  Shield,
  UserCircle,
  Building2,
  MessageSquare,
  Home,
  Sun,
  Moon,
  Briefcase,
  LogIn,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';

const DEMO_ROLES: ParliamentaryRole[] = [
  'PRESIDENT',
  'VICE_PRESIDENT',
  'QUESTEUR',
  'SECRETARY',
  'DEPUTY',
  'SENATOR',
  'SUBSTITUTE',
  'STAFF',
  'CITIZEN',
  'ANONYMOUS'
];

const ROLE_ICONS: Record<ParliamentaryRole, React.ReactNode> = {
  PRESIDENT: <Crown className="w-5 h-5 text-amber-500" />,
  VICE_PRESIDENT: <Crown className="w-5 h-5 text-amber-400" />,
  QUESTEUR: <Shield className="w-5 h-5 text-blue-500" />,
  SECRETARY: <FileText className="w-5 h-5 text-green-500" />,
  DEPUTY: <UserCheck className="w-5 h-5 text-primary" />,
  SENATOR: <Building2 className="w-5 h-5 text-purple-500" />,
  SUBSTITUTE: <Users className="w-5 h-5 text-slate-500" />,
  STAFF: <UserCircle className="w-5 h-5 text-slate-400" />,
  CITIZEN: <UserCircle className="w-5 h-5 text-green-400" />,
  ADMIN: <Shield className="w-5 h-5 text-red-500" />,
  ANONYMOUS: <UserCircle className="w-5 h-5 text-muted-foreground" />
};

const ROLE_LABELS: Record<ParliamentaryRole, string> = {
  PRESIDENT: 'Président',
  VICE_PRESIDENT: 'Vice-Président',
  QUESTEUR: 'Questeur',
  SECRETARY: 'Secrétaire',
  DEPUTY: 'Député',
  SENATOR: 'Sénateur',
  SUBSTITUTE: 'Suppléant',
  STAFF: 'Staff',
  CITIZEN: 'Citoyen',
  ADMIN: 'Administrateur',
  ANONYMOUS: 'Anonyme'
};

// Comptes démo organisés par catégorie hiérarchique
const DEMO_ACCOUNTS = {
  bureau: [
    { label: 'Président', phone: '01010101', path: '/president', icon: Crown, color: 'text-amber-500', description: 'Présidence de l\'Assemblée' },
    { label: '1er Vice-Président', phone: '02020202', path: '/vp', icon: Crown, color: 'text-amber-400', description: 'Vice-présidence' },
  ],
  questeurs: [
    { label: 'Questeur Budget', phone: '04040401', path: '/questeurs', icon: Briefcase, color: 'text-blue-500', description: 'Gestion budgétaire' },
    { label: 'Questeur Ressources', phone: '04040402', path: '/questeurs', icon: Briefcase, color: 'text-cyan-500', description: 'Ressources matérielles' },
    { label: 'Questeur Services', phone: '04040403', path: '/questeurs', icon: Briefcase, color: 'text-teal-500', description: 'Services administratifs' },
  ],
  parlementaires: [
    { label: 'Député', phone: '00000000', path: '/deputy', icon: UserCheck, color: 'text-primary', description: 'Espace législatif complet' },
    { label: 'Suppléant', phone: '03030303', path: '/suppleant', icon: Users, color: 'text-slate-500', description: 'Suivi du titulaire' },
    { label: 'Secrétaire', phone: '05050505', path: '/secretaires', icon: FileText, color: 'text-green-500', description: 'Gestion documentaire' },
  ],
  public: [
    { label: 'Espace Citoyen', phone: null, path: '/citizen', icon: UserCircle, color: 'text-green-400', description: 'Accès public sans connexion' },
  ]
};

const ProtocolDemoPage = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [selectedRole, setSelectedRole] = useState<ParliamentaryRole>('DEPUTY');
  const [isFemale, setIsFemale] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const handleDemoLogin = (phone: string, redirectPath: string) => {
    const mockUsers: Record<string, { name: string; roles: string[] }> = {
      '01010101': { name: 'Michel Régis Onanga Ndiaye', roles: ['president', 'deputy', 'citizen'] },
      '02020202': { name: 'François Ndong Obiang', roles: ['vp', 'deputy', 'citizen'] },
      '03030303': { name: 'M. Suppléant', roles: ['substitute', 'citizen'] },
      '04040401': { name: 'Questeur Budget', roles: ['questeur_budget', 'citizen'] },
      '04040402': { name: 'Questeur Ressources', roles: ['questeur_ressources', 'citizen'] },
      '04040403': { name: 'Questeur Services', roles: ['questeur_services', 'citizen'] },
      '05050505': { name: 'M. Secrétaire', roles: ['secretary', 'citizen'] },
      '00000000': { name: 'Honorable Député', roles: ['deputy', 'citizen'] },
    };
    
    const userData = mockUsers[phone] || { name: 'Utilisateur Démo', roles: ['citizen'] };
    const user = {
      id: phone,
      name: userData.name,
      phoneNumber: phone,
      roles: userData.roles,
    };
    
    sessionStorage.setItem('user_data', JSON.stringify(user));
    sessionStorage.setItem('current_role', userData.roles[0]);
    
    toast.success('Connexion démo réussie !');
    navigate(redirectPath);
    window.location.href = redirectPath;
  };

  const roleDefinition = PARLIAMENTARY_ROLE_DEFINITIONS[selectedRole as ParliamentaryRoleEnum];

  // Générer les salutations selon l'heure simulée
  const getSimulatedGreeting = () => {
    const protocol = SocialProtocolAdapter;
    return protocol.generateSalutation(selectedRole);
  };

  const getWelcomeMessage = () => {
    return SocialProtocolAdapter.generateWelcomeMessage(selectedRole, 'Jean Dupont');
  };

  const getClosing = () => {
    return SocialProtocolAdapter.generateClosing(selectedRole);
  };

  const getTone = () => {
    return SocialProtocolAdapter.getTone(selectedRole);
  };

  const canUseEmoticons = () => {
    return SocialProtocolAdapter.canUseEmoticons(selectedRole);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-muted"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h1 className="font-semibold">Démo Protocole iAsted</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Parlement Gabonais</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="hover:bg-muted"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Accès aux Espaces Parlementaires - Section unifiée */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              Accès aux Espaces Parlementaires
            </CardTitle>
            <CardDescription>
              Explorez les fonctionnalités selon votre rôle. Les comptes démo connectent automatiquement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bureau de l'Assemblée */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                Bureau de l'Assemblée
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DEMO_ACCOUNTS.bureau.map((account) => {
                  const Icon = account.icon;
                  return (
                    <Button
                      key={account.phone}
                      variant="outline"
                      className="flex flex-col items-start gap-1 h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary/50 transition-all text-left"
                      onClick={() => handleDemoLogin(account.phone, account.path)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${account.color}`} />
                        <span className="font-medium">{account.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{account.description}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Questeurs */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                Questure
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DEMO_ACCOUNTS.questeurs.map((account) => {
                  const Icon = account.icon;
                  return (
                    <Button
                      key={account.phone}
                      variant="outline"
                      className="flex flex-col items-start gap-1 h-auto py-3 px-4 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all text-left"
                      onClick={() => handleDemoLogin(account.phone, account.path)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${account.color}`} />
                        <span className="font-medium">{account.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{account.description}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Parlementaires */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-primary" />
                Parlementaires & Staff
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DEMO_ACCOUNTS.parlementaires.map((account) => {
                  const Icon = account.icon;
                  return (
                    <Button
                      key={account.phone}
                      variant="outline"
                      className="flex flex-col items-start gap-1 h-auto py-3 px-4 hover:bg-primary/10 hover:border-primary/50 transition-all text-left"
                      onClick={() => handleDemoLogin(account.phone, account.path)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${account.color}`} />
                        <span className="font-medium">{account.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{account.description}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Accès Public */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <UserCircle className="w-4 h-4 text-green-500" />
                Accès Public
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEMO_ACCOUNTS.public.map((account) => {
                  const Icon = account.icon;
                  return (
                    <Button
                      key={account.path}
                      variant="outline"
                      className="flex flex-col items-start gap-1 h-auto py-3 px-4 hover:bg-green-500/10 hover:border-green-500/50 transition-all text-left"
                      onClick={() => navigate(account.path)}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${account.color}`} />
                        <span className="font-medium">{account.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{account.description}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sélection du rôle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Sélectionnez un Rôle Parlementaire
            </CardTitle>
            <CardDescription>
              Visualisez comment iAsted adapte son protocole de communication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {DEMO_ROLES.map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? 'default' : 'outline'}
                  className="flex items-center gap-2 h-auto py-3"
                  onClick={() => setSelectedRole(role)}
                >
                  {ROLE_ICONS[role]}
                  <span className="text-sm">{ROLE_LABELS[role]}</span>
                </Button>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Genre :</span>
                <Button
                  size="sm"
                  variant={!isFemale ? 'default' : 'outline'}
                  onClick={() => setIsFemale(false)}
                >
                  Masculin
                </Button>
                <Button
                  size="sm"
                  variant={isFemale ? 'default' : 'outline'}
                  onClick={() => setIsFemale(true)}
                >
                  Féminin
                </Button>
              </div>

              <Separator orientation="vertical" className="h-8 hidden sm:block" />

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Heure simulée :</span>
                <Button
                  size="sm"
                  variant={simulatedTime === 'morning' ? 'default' : 'outline'}
                  onClick={() => setSimulatedTime('morning')}
                >
                  Matin
                </Button>
                <Button
                  size="sm"
                  variant={simulatedTime === 'afternoon' ? 'default' : 'outline'}
                  onClick={() => setSimulatedTime('afternoon')}
                >
                  Après-midi
                </Button>
                <Button
                  size="sm"
                  variant={simulatedTime === 'evening' ? 'default' : 'outline'}
                  onClick={() => setSimulatedTime('evening')}
                >
                  Soir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats du protocole */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Informations du rôle */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {ROLE_ICONS[selectedRole]}
                {ROLE_LABELS[selectedRole]}
              </CardTitle>
              <CardDescription>
                Définition et permissions du rôle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {roleDefinition && (
                <>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Titre Honorifique</h4>
                    <p className="text-muted-foreground bg-muted/50 p-3 rounded-lg">
                      {isFemale ? roleDefinition.honorificFeminin : roleDefinition.honorificMasculin}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {isParliamentarian(selectedRole as ParliamentaryRoleEnum) && (
                      <Badge variant="default">Parlementaire</Badge>
                    )}
                    {isBureauMember(selectedRole as ParliamentaryRoleEnum) && (
                      <Badge variant="secondary">Membre du Bureau</Badge>
                    )}
                    {canVote(selectedRole as ParliamentaryRoleEnum) && (
                      <Badge className="bg-green-500/20 text-green-700">
                        <Vote className="w-3 h-3 mr-1" />
                        Peut Voter
                      </Badge>
                    )}
                    {canSubmitAmendment(selectedRole as ParliamentaryRoleEnum) && (
                      <Badge className="bg-blue-500/20 text-blue-700">
                        <FileText className="w-3 h-3 mr-1" />
                        Peut Amender
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Niveau Hiérarchique</h4>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 bg-primary rounded-full" 
                        style={{ width: `${100 - (roleDefinition.hierarchyLevel * 8)}%` }}
                      />
                      <span className="text-sm text-muted-foreground">
                        Niveau {roleDefinition.hierarchyLevel}
                      </span>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Ton de Communication</h4>
                <Badge variant="outline" className="capitalize">
                  {getTone()}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {getTone() === 'formal' && 'Communication protocolaire et déférente'}
                  {getTone() === 'warm' && 'Communication chaleureuse et accessible'}
                  {getTone() === 'technical' && 'Communication technique et directe'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Emoticons</h4>
                <Badge variant={canUseEmoticons() ? 'default' : 'secondary'}>
                  {canUseEmoticons() ? 'Autorisés' : 'Non autorisés'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Messages générés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Messages iAsted
              </CardTitle>
              <CardDescription>
                Exemples de communication adaptée au rôle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Mic2 className="w-4 h-4 text-primary" />
                      Salutation
                    </h4>
                    <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                      <p className="text-sm italic">"{getSimulatedGreeting()}"</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      Message de Bienvenue Personnalisé
                    </h4>
                    <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-lg">
                      <p className="text-sm italic">"{getWelcomeMessage()}"</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Confirmation d'Action
                    </h4>
                    <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg">
                      <p className="text-sm italic">
                        "{SocialProtocolAdapter.adaptMessage(
                          'votre amendement a été enregistré',
                          selectedRole,
                          'confirmation'
                        )}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4 text-red-500" />
                      Message d'Erreur
                    </h4>
                    <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-lg">
                      <p className="text-sm italic">
                        "{SocialProtocolAdapter.adaptMessage(
                          'Je n\'ai pas pu soumettre votre question.',
                          selectedRole,
                          'error'
                        )}"
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-amber-500" />
                      Formule de Conclusion
                    </h4>
                    <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-lg">
                      <p className="text-sm italic">"{getClosing()}"</p>
                    </div>
                  </div>

                  {/* Message hors périmètre */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      Demande Hors Périmètre
                    </h4>
                    <div className="bg-slate-500/5 border border-slate-500/20 p-4 rounded-lg">
                      <p className="text-sm italic">
                        "{SocialProtocolAdapter.generateOutOfScopeMessage()}"
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

      </main>
    </div>
  );
};

export default ProtocolDemoPage;
