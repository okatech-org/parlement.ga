import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'next-themes';
import {
  ArrowLeft,
  Moon,
  Sun,
  Star,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  helpfulCount: number;
  notHelpfulCount: number;
  accurateCount: number;
  inaccurateCount: number;
  ratingDistribution: { rating: number; count: number }[];
  recentFeedback: {
    id: string;
    rating: number;
    feedback_type: string | null;
    comment: string | null;
    created_at: string;
    message_id: string;
  }[];
}

const COLORS = ['hsl(var(--destructive))', 'hsl(var(--warning))', 'hsl(var(--muted))', 'hsl(var(--info))', 'hsl(var(--success))'];

export const IAstedAdminFeedback: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [stats, setStats] = useState<FeedbackStats>({
    totalFeedback: 0,
    averageRating: 0,
    helpfulCount: 0,
    notHelpfulCount: 0,
    accurateCount: 0,
    inaccurateCount: 0,
    ratingDistribution: [],
    recentFeedback: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbackStats();
  }, []);

  const fetchFeedbackStats = async () => {
    try {
      const { data: feedback, error } = await supabase
        .from('message_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        return;
      }

      const feedbackData = feedback || [];
      
      // Calculate statistics
      const totalFeedback = feedbackData.length;
      const averageRating = totalFeedback > 0
        ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / totalFeedback
        : 0;

      const helpfulCount = feedbackData.filter(f => f.feedback_type === 'helpful').length;
      const notHelpfulCount = feedbackData.filter(f => f.feedback_type === 'not_helpful').length;
      const accurateCount = feedbackData.filter(f => f.feedback_type === 'accurate').length;
      const inaccurateCount = feedbackData.filter(f => f.feedback_type === 'inaccurate').length;

      // Rating distribution
      const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: feedbackData.filter(f => f.rating === rating).length,
      }));

      setStats({
        totalFeedback,
        averageRating,
        helpfulCount,
        notHelpfulCount,
        accurateCount,
        inaccurateCount,
        ratingDistribution,
        recentFeedback: feedbackData.slice(0, 10),
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const feedbackTypeData = [
    { name: 'Utile', value: stats.helpfulCount, color: 'hsl(var(--success))' },
    { name: 'Pas utile', value: stats.notHelpfulCount, color: 'hsl(var(--destructive))' },
    { name: 'Précis', value: stats.accurateCount, color: 'hsl(var(--info))' },
    { name: 'Imprécis', value: stats.inaccurateCount, color: 'hsl(var(--warning))' },
  ].filter(d => d.value > 0);

  const kpiCards = [
    {
      title: 'Total Feedbacks',
      value: stats.totalFeedback,
      icon: MessageSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Note Moyenne',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      suffix: '/5',
    },
    {
      title: 'Réponses Utiles',
      value: stats.helpfulCount,
      icon: ThumbsUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'À Améliorer',
      value: stats.notHelpfulCount + stats.inaccurateCount,
      icon: AlertCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const getRatingLabel = (rating: number) => {
    const labels = ['', 'Mauvais', 'Passable', 'Correct', 'Bien', 'Excellent'];
    return labels[rating] || '';
  };

  const getFeedbackTypeLabel = (type: string | null) => {
    const labels: Record<string, string> = {
      helpful: 'Utile',
      not_helpful: 'Pas utile',
      accurate: 'Précis',
      inaccurate: 'Imprécis',
      other: 'Autre',
    };
    return type ? labels[type] || type : 'Non spécifié';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/iasted-analytics')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Administration Feedback
              </h1>
              <p className="text-sm text-muted-foreground">
                Analyse des retours utilisateurs pour améliorer iAsted
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
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold">
                    {kpi.value}
                    {kpi.suffix && <span className="text-base text-muted-foreground">{kpi.suffix}</span>}
                  </p>
                  <p className="text-sm text-muted-foreground">{kpi.title}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Rating Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribution des Notes</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="rating" 
                  fontSize={12}
                  tickFormatter={(v) => `${v}★`}
                />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [value, 'Feedbacks']}
                  labelFormatter={(label) => `Note: ${label}★ - ${getRatingLabel(Number(label))}`}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                >
                  {stats.ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Feedback Types */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Types de Feedback</h3>
            {feedbackTypeData.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={feedbackTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {feedbackTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
                <div className="space-y-2">
                  {feedbackTypeData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm">{entry.name}</span>
                      <span className="text-sm font-medium ml-auto">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                Aucune donnée disponible
              </div>
            )}
          </Card>
        </div>

        {/* Recent Feedback */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Feedbacks Récents
          </h3>
          {stats.recentFeedback.length > 0 ? (
            <div className="space-y-4">
              {stats.recentFeedback.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= feedback.rating
                                  ? 'fill-warning text-warning'
                                  : 'text-muted-foreground/30'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge variant={feedback.rating >= 4 ? 'default' : feedback.rating >= 3 ? 'secondary' : 'destructive'}>
                          {getRatingLabel(feedback.rating)}
                        </Badge>
                        {feedback.feedback_type && (
                          <Badge variant="outline">
                            {getFeedbackTypeLabel(feedback.feedback_type)}
                          </Badge>
                        )}
                      </div>
                      {feedback.comment && (
                        <p className="text-sm text-muted-foreground">
                          "{feedback.comment}"
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground shrink-0">
                      {new Date(feedback.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>Aucun feedback reçu pour le moment</p>
              </div>
            </div>
          )}
        </Card>

        {/* Insights Card */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Insights & Recommandations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.averageRating >= 4 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10">
                <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-success">Performance excellente</p>
                  <p className="text-sm text-muted-foreground">
                    La note moyenne de {stats.averageRating.toFixed(1)}/5 indique une grande satisfaction.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10">
                <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warning">Amélioration nécessaire</p>
                  <p className="text-sm text-muted-foreground">
                    Analysez les feedbacks négatifs pour identifier les axes d'amélioration.
                  </p>
                </div>
              </div>
            )}
            
            {stats.inaccurateCount > stats.accurateCount ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10">
                <TrendingDown className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-destructive">Précision à améliorer</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.inaccurateCount} réponses signalées comme imprécises.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-info/10">
                <CheckCircle className="w-5 h-5 text-info shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-info">Bonne précision</p>
                  <p className="text-sm text-muted-foreground">
                    Les réponses sont généralement considérées comme précises.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default IAstedAdminFeedback;
