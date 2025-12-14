import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

interface PieChartData {
  name: string;
  value: number;
  color: string;
}

interface ProgressChartData {
  name: string;
  progress: number;
  color: string;
}

interface GroupDistributionChartProps {
  title: string;
  data: PieChartData[];
}

interface LawProgressChartProps {
  title: string;
  data: ProgressChartData[];
}

export const GroupDistributionChart = ({ title, data }: GroupDistributionChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle"
                formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const LawProgressChart = ({ title, data }: LawProgressChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-sm font-bold text-foreground">{item.progress}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.progress}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface AttendanceRateCardProps {
  rate: number;
  trend: "up" | "down" | "stable";
  label?: string;
}

export const AttendanceRateCard = ({ rate, trend, label = "Taux de Présence en Séance" }: AttendanceRateCardProps) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <svg className="h-6 w-6 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
          </svg>
        </div>
        <div className="flex items-center gap-2 mb-2">
          {trend === "up" && (
            <span className="text-xs text-green-500 flex items-center gap-1">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
                <polyline points="17,6 23,6 23,12" />
              </svg>
              Hausse
            </span>
          )}
          {trend === "down" && (
            <span className="text-xs text-red-500 flex items-center gap-1">
              <svg className="h-3 w-3 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
                <polyline points="17,6 23,6 23,12" />
              </svg>
              Baisse
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-4xl font-bold text-foreground mt-1">{rate}%</p>
      </CardContent>
    </Card>
  );
};
