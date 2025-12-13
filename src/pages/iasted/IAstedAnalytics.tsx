import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  ArrowLeft,
  Moon,
  Sun,
  MessageSquare,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  BarChart3,
  Activity,
  Zap,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

interface AnalyticsData {
  totalConversations: number;
  totalMessages: number;
  documentsGenerated: number;
  activeUsers: number;
  avgSessionDuration: number;
  conversationsToday: number;
  conversationsThisWeek: number;
  conversationsThisMonth: number;
}

interface ChartData {
  name: string;
  conversations: number;
  messages: number;
  documents: number;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--info))'];

export const IAstedAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalConversations: 0,
    totalMessages: 0,
    documentsGenerated: 0,
    activeUsers: 0,
    avgSessionDuration: 0,
    conversationsToday: 0,
    conversationsThisWeek: 0,
    conversationsThisMonth: 0,
  });
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart);
      weekStart.setDate(weekStart.getDate() - 7);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      // Fetch conversation stats
      const { data: allConversations, error: convError } = await supabase
        .from('conversation_sessions')
        .select('id, created_at, updated_at');

      const { data: allMessages, error: msgError } = await supabase
        .from('conversation_messages')
        .select('id, session_id, created_at');

      const { data: documents, error: docError } = await supabase
        .from('documents')
        .select('id, created_at');

      if (convError || msgError) {
        console.error('Error fetching analytics:', convError || msgError);
      }

      const conversations = allConversations || [];
      const messages = allMessages || [];
      const docs = documents || [];

      // Calculate stats
      const conversationsToday = conversations.filter(
        (c) => new Date(c.created_at) >= todayStart
      ).length;
      
      const conversationsThisWeek = conversations.filter(
        (c) => new Date(c.created_at) >= weekStart
      ).length;
      
      const conversationsThisMonth = conversations.filter(
        (c) => new Date(c.created_at) >= monthStart
      ).length;

      // Calculate unique users
      const uniqueUserIds = new Set(conversations.map((c: any) => c.user_id));

      // Generate weekly chart data
      const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
      const chartData: ChartData[] = days.map((day, index) => {
        const dayDate = new Date(weekStart);
        dayDate.setDate(dayDate.getDate() + index);
        const nextDay = new Date(dayDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const dayConversations = conversations.filter((c) => {
          const date = new Date(c.created_at);
          return date >= dayDate && date < nextDay;
        }).length;

        const dayMessages = messages.filter((m) => {
          const date = new Date(m.created_at);
          return date >= dayDate && date < nextDay;
        }).length;

        const dayDocs = docs.filter((d) => {
          const date = new Date(d.created_at);
          return date >= dayDate && date < nextDay;
        }).length;

        return {
          name: day,
          conversations: dayConversations,
          messages: dayMessages,
          documents: dayDocs,
        };
      });

      setWeeklyData(chartData);
      setAnalytics({
        totalConversations: conversations.length,
        totalMessages: messages.length,
        documentsGenerated: docs.length,
        activeUsers: uniqueUserIds.size,
        avgSessionDuration: 12, // Mock average
        conversationsToday,
        conversationsThisWeek,
        conversationsThisMonth,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = [
    {
      title: 'Conversations totales',
      value: analytics.totalConversations,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
    },
    {
      title: 'Messages échangés',
      value: analytics.totalMessages,
      icon: Activity,
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+8%',
    },
    {
      title: 'Documents générés',
      value: analytics.documentsGenerated,
      icon: FileText,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '+15%',
    },
    {
      title: 'Utilisateurs actifs',
      value: analytics.activeUsers,
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info/10',
      change: '+5%',
    },
  ];

  const timeStats = [
    { label: "Aujourd'hui", value: analytics.conversationsToday, icon: Zap },
    { label: 'Cette semaine', value: analytics.conversationsThisWeek, icon: Calendar },
    { label: 'Ce mois', value: analytics.conversationsThisMonth, icon: TrendingUp },
  ];

  const pieData = [
    { name: 'Conversations', value: analytics.totalConversations },
    { name: 'Documents', value: analytics.documentsGenerated },
    { name: 'Messages', value: Math.floor(analytics.totalMessages / 10) },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Analytiques iAsted
              </h1>
              <p className="text-sm text-muted-foreground">
                Statistiques d'utilisation et performances
              </p>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <span className="text-xs font-medium text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {kpi.change}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">{kpi.value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Time-based Stats */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Activité récente
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {timeStats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Activité hebdomadaire</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="conversations"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorConversations)"
                  name="Conversations"
                />
                <Area
                  type="monotone"
                  dataKey="messages"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success))"
                  fillOpacity={0.1}
                  name="Messages"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Bar Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Comparaison par jour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="conversations" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Conversations" />
                <Bar dataKey="documents" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} name="Documents" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Pie Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition de l'activité</h3>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{entry.name}</span>
                  <span className="text-sm font-medium ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default IAstedAnalytics;
