import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { dashboardStyles } from "@/styles/dashboard";

interface SentimentData {
  department: string;
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentAnalysisProps {
  data: SentimentData[];
}

export const SentimentAnalysis = ({ data }: SentimentAnalysisProps) => {
  return (
    <Card 
      className="col-span-1 lg:col-span-2 p-6"
      style={{
        background: dashboardStyles.card.background,
        backdropFilter: dashboardStyles.card.backdropFilter,
        borderRadius: dashboardStyles.card.borderRadius,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sentiment Analysis by Department</h3>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="sm">
              <Users className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm">Compare sentiment distribution across departments</p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                background: dashboardStyles.chart.tooltip.background,
                border: dashboardStyles.chart.tooltip.border,
                borderRadius: dashboardStyles.chart.tooltip.borderRadius,
                boxShadow: dashboardStyles.chart.tooltip.boxShadow,
              }}
            />
            <Legend />
            <Bar 
              dataKey="positive" 
              stackId="a" 
              fill={dashboardStyles.colors.secondary.main} 
              name="Positive" 
            />
            <Bar 
              dataKey="neutral" 
              stackId="a" 
              fill={dashboardStyles.colors.primary.light} 
              name="Neutral" 
            />
            <Bar 
              dataKey="negative" 
              stackId="a" 
              fill={dashboardStyles.colors.accent.main} 
              name="Negative" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
