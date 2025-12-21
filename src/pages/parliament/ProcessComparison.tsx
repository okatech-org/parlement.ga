import React, { useState } from 'react';
import {
  ArrowRight, Scale, Gavel, FileText, CheckCircle, Clock, Users,
  Building, ArrowLeftRight, GitMerge, ArrowUpRight, BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import InstitutionSubHeader from '@/components/layout/InstitutionSubHeader';

/**
 * Comparaison des Processus Législatifs
 * Accessible au public depuis /processus-comparaison
 */
const ProcessComparison = () => {
  const { t } = useLanguage();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Unified Header */}
      <InstitutionSubHeader
        institution="PARLIAMENT"
        pageTitle={t('congress.processComparison.header.title')}
        pageSubtitle={t('congress.processComparison.header.subtitle')}
        pageIcon={ArrowLeftRight}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Badges AN / Sénat */}
        <div className="flex justify-center gap-4 mb-8">
          <Badge variant="outline" className="border-[#3A87FD]/30 text-[#3A87FD] bg-[#3A87FD]/10">
            <Building className="w-3 h-3 mr-1" />
            {t('congress.processComparison.header.btnAn')}
          </Badge>
          <Badge variant="outline" className="border-[#D19C00]/30 text-[#D19C00] bg-[#D19C00]/10">
            <Building className="w-3 h-3 mr-1" />
            {t('congress.processComparison.header.btnSn')}
          </Badge>
        </div>

        {/* Schéma de la Navette */}
        <Card className="border-2 border-slate-200 dark:border-slate-800 overflow-hidden mb-8">
          <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-purple-600" />
              {t('congress.processComparison.navette.title')}
            </CardTitle>
            <CardDescription>
              {t('congress.processComparison.navette.desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Flèche de fond pour la navette */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-[#3A87FD]/30 via-purple-200 to-[#D19C00]/30 -z-10 hidden md:block transform -translate-y-1/2" />

              {/* Assemblée Nationale */}
              <div
                className={`relative z-10 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPhase === 'an' ? 'border-[#3A87FD] bg-[#3A87FD]/10 shadow-lg scale-105' : 'border-[#3A87FD]/30 bg-white dark:bg-slate-800 hover:border-blue-300'}`}
                onClick={() => setSelectedPhase('an')}
              >
                <Badge className="mb-2 bg-[#3A87FD] hover:bg-[#3A87FD]">{t('congress.processComparison.phases.depot')}</Badge>
                <div className="flex flex-col items-center text-center">
                  <Building className="h-8 w-8 text-[#3A87FD] mb-2" />
                  <h3 className="font-bold text-blue-900 dark:text-blue-300">{t('congress.common.an')}</h3>
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
                className={`relative z-10 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPhase === 'sn' ? 'border-[#D19C00] bg-[#D19C00]/10 shadow-lg scale-105' : 'border-[#D19C00]/30 bg-white dark:bg-slate-800 hover:border-red-300'}`}
                onClick={() => setSelectedPhase('sn')}
              >
                <Badge className="mb-2 bg-[#D19C00] hover:bg-[#D19C00]">{t('congress.processComparison.phases.depot')}</Badge>
                <div className="flex flex-col items-center text-center">
                  <Building className="h-8 w-8 text-[#D19C00] mb-2" />
                  <h3 className="font-bold text-red-900 dark:text-amber-300">{t('congress.common.senate')}</h3>
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
                className={`relative z-10 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPhase === 'final' ? 'border-[#77BA41] bg-[#77BA41]/10 shadow-lg scale-105' : 'border-slate-200 bg-white dark:bg-slate-800 hover:border-[#77BA41]/40'}`}
                onClick={() => setSelectedPhase('final')}
              >
                <Badge className="mb-2 bg-[#77BA41] hover:bg-green-700">{t('congress.processComparison.phases.adoption')}</Badge>
                <div className="flex flex-col items-center text-center">
                  <Gavel className="h-8 w-8 text-[#77BA41] mb-2" />
                  <h3 className="font-bold text-green-900 dark:text-green-300">{t('congress.common.session')}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('congress.vote.result.adopted')} <br />
                    {t('congress.common.vote')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparaison Détaillée */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
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
              <Button variant="outline" className="w-full text-[#3A87FD] hover:text-[#3A87FD] border-[#3A87FD]/30">
                {t('congress.processComparison.links.anDesc')} <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#D19C00] flex items-center gap-2">
                <Building className="h-5 w-5" />
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
              <Button variant="outline" className="w-full text-[#D19C00] hover:text-[#D19C00] border-[#D19C00]/30">
                {t('congress.processComparison.links.snDesc')} <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { value: "143", label: t('congress.common.deputies'), icon: Building, color: "text-[#3A87FD]" },
            { value: "102", label: t('congress.common.senators'), icon: Users, color: "text-[#D19C00]" },
            { value: "245", label: "Parlementaires", icon: Scale, color: "text-purple-600" },
            { value: "2", label: "Chambres", icon: Gavel, color: "text-[#77BA41]" },
          ].map((stat, i) => (
            <Card key={i} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color} opacity-80`} />
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-3 mb-3">
            <Scale className="h-6 w-6" />
            <span className="font-serif font-bold text-white">Processus Législatif Gabonais</span>
          </div>
          <p className="text-sm text-slate-400">
            Assemblée Nationale & Sénat de la République
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Union - Travail - Justice
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProcessComparison;

