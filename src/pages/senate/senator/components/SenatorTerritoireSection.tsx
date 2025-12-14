import { MapPin, Users, Building, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LocalCollectivityFeed from "@/components/senate/LocalCollectivityFeed";

export const SenatorTerritoireSection = () => {
  const province = "Woleu-Ntem";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
          Mon Territoire
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Province: {province}
        </p>
      </div>

      <LocalCollectivityFeed senatorProvince={province} />
    </div>
  );
};
