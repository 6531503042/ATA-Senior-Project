import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { dashboardStyles } from "@/styles/dashboard";

interface ResponseData {
  month: string;
  responses: number;
  completion: number;
}

interface ResponseTrendsProps {
  data: ResponseData[];
}

export const ResponseTrends = ({ data }: ResponseTrendsProps) => {
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
        <h3 className="text-lg font-semibold text-gray-900">Response Trends</h3>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="ghost" size="sm">
              <TrendingUp className="h-4 w-4" />
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-sm">Track response rates and completion trends over time</p>
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="month" />
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
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="responses"
              stroke={dashboardStyles.colors.primary.main}
              strokeWidth={2}
              name="Total Responses"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="completion"
              stroke={dashboardStyles.colors.secondary.main}
              strokeWidth={2}
              name="Completion Rate (%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
