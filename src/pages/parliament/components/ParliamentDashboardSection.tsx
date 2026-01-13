import {
  Scale,
  FileText,
  Users,
  BookOpen,
  ArrowLeftRight,
  Vote,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStatsCard } from "@/components/dashboard/DashboardStatsCard";
import { AttendanceRateCard } from "@/components/dashboard/DashboardCharts"; // Keep generic Attendance
import { AnimatedDashboardCard, AnimatedProgressBar } from "@/components/animations/DashboardAnimations";
import InteractiveDonutChart from "@/components/charts/InteractiveDonutChart";
import { useLanguage } from "@/contexts/LanguageContext";

export const ParliamentDashboardSection = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: "210", label: t('congress.admin.dashboard.stats.members'), subLabel: t('congress.admin.dashboard.stats.subMembers') },
    { icon: FileText, value: "47", label: t('congress.admin.dashboard.stats.laws'), subLabel: t('congress.admin.dashboard.stats.subLaws') },
    { icon: BookOpen, value: "3", label: t('congress.admin.dashboard.stats.revisions'), subLabel: t('congress.admin.dashboard.stats.subRevisions') },
    { icon: ArrowLeftRight, value: "12", label: t('congress.admin.dashboard.stats.cmp'), subLabel: t('congress.admin.dashboard.stats.subCmp') },
  ];

  const institutionData = [
    { label: t('congress.common.an'), value: 145, color: "#22c55e" },
    { label: t('congress.common.senate'), value: 67, color: "#3b82f6" },
  ];

  const lawProgress = [
    { name: "Loi de Finances 2025", progress: 45, color: "bg-amber-500" },
    { name: "Révision Constitutionnelle", progress: 80, color: "bg-green-500" },
    { name: "Code Minier", progress: 25, color: "bg-blue-500" },
  ];

  const activeCMP = {
    reference: "CMP-2024-007",
    title: "Loi de Finances 2025",
    daysLeft: 8,
    progress: 45,
  };

  const nextSession = {
    reference: "CONG-2024-003",
    title: "Révision Constitutionnelle - Autonomie des Collectivités",
    date: "20 Décembre 2024",
    time: "10h00",
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <AnimatedDashboardCard delay={0}>
        <DashboardHeader
          title={t('congress.admin.dashboard.title')}
          subtitle={t('congress.admin.dashboard.subtitle')}
          avatarInitial="P"
        />
      </AnimatedDashboardCard>

      {/* CMP Active Alert */}
      <AnimatedDashboardCard delay={0.1}>
        <Card className="border-l-4 border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm border-y-0 border-r-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <ArrowLeftRight className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-amber-500 text-white">{activeCMP.reference}</Badge>
                    <Badge variant="outline" className="border-amber-500 text-amber-600 dark:text-amber-400">
                      {t('congress.cmp.active')}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{activeCMP.title}</h3>
                  <p className="text-sm text-muted-foreground">{activeCMP.daysLeft} {t('congress.admin.dashboard.cmpAlert.daysLeft')}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-muted-foreground mb-1">{t('congress.admin.dashboard.cmpAlert.progress')}</p>
                  <div className="w-32">
                    <AnimatedProgressBar value={activeCMP.progress} showValue={false} color="bg-amber-500" delay={0.2} />
                  </div>
                </div>
                <Button variant="secondary" className="shadow-sm">{t('congress.admin.dashboard.cmpAlert.btn')}</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedDashboardCard>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <AnimatedDashboardCard key={index} delay={0.15 + index * 0.05}>
            <DashboardStatsCard {...stat} />
          </AnimatedDashboardCard>
        ))}
      </div>

      {/* Attendance + Next Session */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedDashboardCard delay={0.3}>
          <AttendanceRateCard rate={88} trend="up" label={t('congress.admin.dashboard.attendance.rate')} />
        </AnimatedDashboardCard>

        <AnimatedDashboardCard delay={0.35}>
          <Card className="h-full border-none shadow-sm bg-white dark:bg-card p-2 flex flex-col justify-center">
            <CardContent className="p-5">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Vote className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">{nextSession.reference}</Badge>
                  <h4 className="font-bold text-lg text-foreground mb-1 truncate">{nextSession.title}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    {nextSession.date} à {nextSession.time}
                  </p>
                </div>
                <Button className="shadow-elegant">{t('congress.admin.dashboard.nextSession.btn')}</Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedDashboardCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedDashboardCard delay={0.4}>
          <Card className="h-full border-none shadow-sm bg-white dark:bg-card">
            <CardContent className="p-6 flex flex-col items-center">
              <h3 className="text-xl font-serif font-bold mb-6 self-start w-full">{t('congress.admin.dashboard.charts.seats')}</h3>
              <InteractiveDonutChart
                data={institutionData}
                size={220}
                thickness={40}
                centerLabel={t('congress.admin.dashboard.charts.total')}
                centerValue="210"
              />
            </CardContent>
          </Card>
        </AnimatedDashboardCard>

        <AnimatedDashboardCard delay={0.45}>
          <Card className="h-full border-none shadow-sm bg-white dark:bg-card">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-serif font-bold mb-4">{t('congress.admin.dashboard.charts.progress')}</h3>
              {lawProgress.map((law, idx) => (
                <AnimatedProgressBar
                  key={idx}
                  label={law.name}
                  value={law.progress}
                  color={law.color}
                  delay={0.5 + idx * 0.1}
                  showValue
                />
              ))}
            </CardContent>
          </Card>
        </AnimatedDashboardCard>
      </div>
    </div>
  );
};
