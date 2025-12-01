import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

type RegionStats = {
  region: string;
  total: number;
  en_attente: number;
  en_cours: number;
  resolu: number;
  urgente: number;
};

const RegionalStats = () => {
  const [stats, setStats] = useState<RegionStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const { data, error } = await supabase
        .from('doleances')
        .select('region, statut, priorite');

      if (error) {
        console.error('Erreur chargement statistiques:', error);
        setLoading(false);
        return;
      }

      // Calculer les statistiques par région
      const statsMap = new Map<string, RegionStats>();

      data?.forEach((item) => {
        if (!statsMap.has(item.region)) {
          statsMap.set(item.region, {
            region: item.region,
            total: 0,
            en_attente: 0,
            en_cours: 0,
            resolu: 0,
            urgente: 0,
          });
        }

        const regionStat = statsMap.get(item.region)!;
        regionStat.total++;

        if (item.statut === 'en_attente') regionStat.en_attente++;
        if (item.statut === 'en_cours') regionStat.en_cours++;
        if (item.statut === 'resolu') regionStat.resolu++;
        if (item.priorite === 'urgente') regionStat.urgente++;
      });

      setStats(Array.from(statsMap.values()).sort((a, b) => b.total - a.total));
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <Card className="p-6 bg-card shadow-card-custom">
        <div className="flex items-center justify-center h-32">
          <p className="text-sm text-muted-foreground">Chargement des statistiques...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card shadow-card-custom">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Statistiques par Région</h3>
      </div>
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.region} className="p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-sm">{stat.region}</h4>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {stat.total} total
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-3 w-3 text-yellow-600" />
                <span className="text-muted-foreground">En attente:</span>
                <span className="font-medium">{stat.en_attente}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <AlertCircle className="h-3 w-3 text-blue-600" />
                <span className="text-muted-foreground">En cours:</span>
                <span className="font-medium">{stat.en_cours}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span className="text-muted-foreground">Résolues:</span>
                <span className="font-medium">{stat.resolu}</span>
              </div>
              {stat.urgente > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-3 w-3 rounded-full bg-red-600" />
                  <span className="text-muted-foreground">Urgentes:</span>
                  <span className="font-medium text-red-600">{stat.urgente}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RegionalStats;
