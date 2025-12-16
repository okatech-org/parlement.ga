import React, { useState } from 'react';
import {
  ArrowRight, Scale, Gavel, FileText, CheckCircle, Clock, Users,
  Building, ArrowLeftRight, GitMerge, ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';

const ProcessComparison = () => {
  const { t } = useLanguage();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Titre et Intro */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-red-600">
          {t('congress.processComparison.header.title')}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('congress.processComparison.header.subtitle')}
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
            <Building className="w-3 h-3 mr-1" />
            {t('congress.processComparison.header.btnAn')}
          </Badge>
          <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">
            <Building className="w-3 h-3 mr-1" />
            {t('congress.processComparison.header.btnSn')}
          </Badge>
        </div>
      </div>

      {/* Schéma de la Navette */}
      <Card className="border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
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
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-red-200 -z-10 hidden md:block transform -translate-y-1/2" />

            {/* Assemblée Nationale */}
            <div
              className={`relative z-10 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPhase === 'an' ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' : 'border-blue-200 bg-white hover:border-blue-300'}`}
              onClick={() => setSelectedPhase('an')}
            >
              <Badge className="mb-2 bg-blue-600 hover:bg-blue-700">{t('congress.processComparison.phases.depot')}</Badge>
              <div className="flex flex-col items-center text-center">
                <Building className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-bold text-blue-900">{t('congress.common.an')}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('congress.processComparison.phases.commission')} <br />
                  + {t('congress.processComparison.phases.pleniere')}
                </p>
              </div>
            </div>

            {/* Navette aller */}
            <div className="flex flex-col items-center">
              <ArrowRight className="h-6 w-6 text-purple-500 animate-pulse" />
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider bg-white px-2">
                {t('congress.processComparison.phases.navette')}
              </span>
            </div>

            {/* Sénat */}
            <div
              className={`relative z-10 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPhase === 'sn' ? 'border-red-500 bg-red-50 shadow-lg scale-105' : 'border-red-200 bg-white hover:border-red-300'}`}
              onClick={() => setSelectedPhase('sn')}
            >
              <Badge className="mb-2 bg-red-600 hover:bg-red-700">{t('congress.processComparison.phases.depot')}</Badge>
              <div className="flex flex-col items-center text-center">
                <Building className="h-8 w-8 text-red-600 mb-2" />
                <h3 className="font-bold text-red-900">{t('congress.common.senate')}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('congress.processComparison.phases.commission')} <br />
                  + {t('congress.processComparison.phases.pleniere')}
                </p>
              </div>
            </div>

            {/* Navette retour / CMP */}
            <div className="flex flex-col items-center">
              <GitMerge className="h-6 w-6 text-amber-500" />
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider bg-white px-2">
                {t('congress.dashboard.quick.cmp.title')}
              </span>
            </div>

            {/* Adoption Finale */}
            <div
              className={`relative z-10 p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedPhase === 'final' ? 'border-green-500 bg-green-50 shadow-lg scale-105' : 'border-slate-200 bg-white hover:border-green-300'}`}
              onClick={() => setSelectedPhase('final')}
            >
              <Badge className="mb-2 bg-green-600 hover:bg-green-700">{t('congress.processComparison.phases.adoption')}</Badge>
              <div className="flex flex-col items-center text-center">
                <Gavel className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-bold text-green-900">{t('congress.common.session')}</h3>
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
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Building className="h-5 w-5" />
              {t('congress.processComparison.links.anTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t('congress.processComparison.links.composition')}</h4>
                <p className="text-sm text-muted-foreground">143 {t('congress.common.deputies')} ({t('congress.processComparison.links.directSuffrage')})</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t('congress.processComparison.links.mandateDuration')}</h4>
                <p className="text-sm text-muted-foreground">{t('congress.processComparison.links.years5')}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t('congress.processComparison.links.specificRole')}</h4>
                <p className="text-sm text-muted-foreground">{t('congress.processComparison.links.anLastWord')}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-blue-600 hover:text-blue-700 border-blue-200">
              {t('congress.processComparison.links.anDesc')} <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Building className="h-5 w-5" />
              {t('congress.processComparison.links.snTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t('congress.processComparison.links.composition')}</h4>
                <p className="text-sm text-muted-foreground">102 {t('congress.common.senators')} ({t('congress.processComparison.links.indirectSuffrage')})</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t('congress.processComparison.links.mandateDuration')}</h4>
                <p className="text-sm text-muted-foreground">{t('congress.processComparison.links.years6')}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <Scale className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">{t('congress.processComparison.links.specificRole')}</h4>
                <p className="text-sm text-muted-foreground">{t('congress.processComparison.links.snLocalAuthorities')}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 border-red-200">
              {t('congress.processComparison.links.snDesc')} <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProcessComparison;
