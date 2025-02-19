import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { FileText } from "lucide-react";
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

interface QuestionTypeData {
  type: string;
  count: number;
  engagement: number;
}

interface QuestionTypePerformanceProps {
  data: QuestionTypeData[];
}

export const QuestionTypePerformance = ({ data }: QuestionTypePerformanceProps) => {
  return (
    <Card 
      className="p-6"
      style={{
        background: dashboardStyles.card.background,
        backdropFilter: dashboardStyles.card.backdropFilter,
        borderRadius: dashboardStyles.card.borderRadius,
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Question Type Performance</h3>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm">Compare engagement rates across different question types</p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="type" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
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
              yAxisId="left"
              dataKey="count"
              fill={dashboardStyles.colors.primary.main}
              name="Number of Questions"
            />
            <Bar
              yAxisId="right"
              dataKey="engagement"
              fill={dashboardStyles.colors.secondary.main}
              name="Engagement Rate (%)"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
