import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart
} from "recharts";
import { 
  TrendingUp, TrendingDown, CheckCircle, XCircle, Clock, FileText, 
  Users, Vote, BarChart3, PieChartIcon, Activity
} from "lucide-react";
import { format, subDays, startOfWeek, eachDayOfInterval } from "date-fns";
import { fr } from "date-fns/locale";

interface Amendment {
  id: string;
  status: string;
  amendment_type: string;
  created_at: string;
  vote_pour: number;
  vote_contre: number;
  vote_abstention?: number;
}

interface LegislativeAnalyticsDashboardProps {
  amendments: Amendment[];
}

const COLORS = {
  adopte: 'hsl(var(--chart-1))',
  rejete: 'hsl(var(--chart-2))',
  en_attente: 'hsl(var(--chart-3))',
  en_examen: 'hsl(var(--chart-4))',
  retire: 'hsl(var(--chart-5))',
};

const PIE_COLORS = ['#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export const LegislativeAnalyticsDashboard = ({ amendments }: LegislativeAnalyticsDashboardProps) => {
  // Statistiques globales
  const stats = useMemo(() => {
    const total = amendments.length;
    const adoptes = amendments.filter(a => a.status === 'adopte').length;
    const rejetes = amendments.filter(a => a.status === 'rejete').length;
    const enAttente = amendments.filter(a => a.status === 'en_attente').length;
    const enExamen = amendments.filter(a => a.status === 'en_examen').length;
    
    const totalVotes = amendments.reduce((acc, a) => acc + (a.vote_pour || 0) + (a.vote_contre || 0), 0);
    const totalPour = amendments.reduce((acc, a) => acc + (a.vote_pour || 0), 0);
    
    const tauxAdoption = total > 0 ? Math.round((adoptes / total) * 100) : 0;
    const tauxApprobation = totalVotes > 0 ? Math.round((totalPour / totalVotes) * 100) : 0;

    return {
      total,
      adoptes,
      rejetes,
      enAttente,
      enExamen,
      tauxAdoption,
      tauxApprobation,
      totalVotes
    };
  }, [amendments]);

  // Données pour le graphique par statut
  const statusData = useMemo(() => [
    { name: 'Adoptés', value: stats.adoptes, color: '#22c55e' },
    { name: 'Rejetés', value: stats.rejetes, color: '#ef4444' },
    { name: 'En attente', value: stats.enAttente, color: '#f59e0b' },
    { name: 'En examen', value: stats.enExamen, color: '#3b82f6' },
  ].filter(d => d.value > 0), [stats]);

  // Données par type d'amendement
  const typeData = useMemo(() => {
    const byType: Record<string, number> = {};
    amendments.forEach(a => {
      byType[a.amendment_type] = (byType[a.amendment_type] || 0) + 1;
    });
    return [
      { name: 'Modification', count: byType['modification'] || 0 },
      { name: 'Ajout', count: byType['ajout'] || 0 },
      { name: 'Suppression', count: byType['suppression'] || 0 },
    ];
  }, [amendments]);

  // Données d'activité par jour (derniers 14 jours)
  const activityData = useMemo(() => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 13),
      end: new Date()
    });

    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const dayAmendments = amendments.filter(a => 
        format(new Date(a.created_at), 'yyyy-MM-dd') === dayStr
      );
      
      return {
        date: format(day, 'dd/MM', { locale: fr }),
        total: dayAmendments.length,
        adoptes: dayAmendments.filter(a => a.status === 'adopte').length,
        rejetes: dayAmendments.filter(a => a.status === 'rejete').length,
      };
    });
  }, [amendments]);

  // Votes agrégés
  const votesData = useMemo(() => {
    const votedAmendments = amendments.filter(a => a.vote_pour > 0 || a.vote_contre > 0);
    
    return votedAmendments.slice(0, 10).map((a, i) => ({
      name: `Amd. ${i + 1}`,
      pour: a.vote_pour || 0,
      contre: a.vote_contre || 0,
    }));
  }, [amendments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
            <BarChart3 className="text-primary" />
            Tableau de Bord Législatif
          </h2>
          <p className="text-muted-foreground text-sm">Analyse de l'activité parlementaire</p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Activity className="w-3 h-3 mr-1" />
          Temps réel
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-5 h-5 text-primary" />
            <Badge variant="secondary" className="text-xs">Total</Badge>
          </div>
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Amendements déposés</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <TrendingUp className="w-3 h-3" />
              {stats.tauxAdoption}%
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">{stats.adoptes}</div>
          <div className="text-xs text-muted-foreground">Adoptés</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-500/5 to-red-500/10 border-red-500/20">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <TrendingDown className="w-3 h-3 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.rejetes}</div>
          <div className="text-xs text-muted-foreground">Rejetés</div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <Badge variant="outline" className="text-xs">{stats.enExamen} en cours</Badge>
          </div>
          <div className="text-3xl font-bold text-amber-600">{stats.enAttente}</div>
          <div className="text-xs text-muted-foreground">En attente</div>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Répartition par statut */}
        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-primary" />
            Répartition par Statut
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Aucune donnée disponible
            </div>
          )}
        </Card>

        {/* Par type d'amendement */}
        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Par Type d'Amendement
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={typeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Activité sur 14 jours */}
        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Activité (14 derniers jours)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="hsl(var(--primary))" 
                fill="hsl(var(--primary))" 
                fillOpacity={0.3}
                name="Déposés"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Résultats des votes */}
        <Card className="p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Vote className="w-4 h-4 text-primary" />
            Résultats des Votes
          </h3>
          {votesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={votesData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="pour" fill="#22c55e" name="Pour" radius={[4, 4, 0, 0]} />
                <Bar dataKey="contre" fill="#ef4444" name="Contre" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              Aucun vote enregistré
            </div>
          )}
        </Card>
      </div>

      {/* Taux d'approbation */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Indicateurs de Performance
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Taux d'adoption</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${stats.tauxAdoption}%` }}
                />
              </div>
              <span className="font-bold text-lg">{stats.tauxAdoption}%</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Votes favorables</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${stats.tauxApprobation}%` }}
                />
              </div>
              <span className="font-bold text-lg">{stats.tauxApprobation}%</span>
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total votes exprimés</div>
            <div className="text-3xl font-bold text-primary">{stats.totalVotes}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
