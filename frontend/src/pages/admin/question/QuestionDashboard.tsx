
import React from 'react';
import { Card } from "@/components/ui/card";
import { SentimentAnalysis } from "@/components/dashboard/SentimentAnalysis";
import { QuestionTypePerformance } from "@/components/dashboard/QuestionTypePerformance";
import { ResponseTrends } from "@/components/dashboard/ResponseTrends";
import { MetricCard } from "@/components/dashboard/MetricsCard";
import {
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const QuestionDashboard = () => {
  // Sample data - in a real app, this would come from your backend
  const metrics = [
    {
      title: "Total Responses",
      value: "1,234",
      trend: "+12%",
      description: "Total feedback responses received",
      icon: <Users className="h-5 w-5 text-indigo-600" />,
    },
    {
      title: "Response Rate",
      value: "87%",
      trend: "+5%",
      description: "Average response completion rate",
      icon: <TrendingUp className="h-5 w-5 text-emerald-600" />,
    },
    {
      title: "Question Engagement",
      value: "92%",
      trend: "+3%",
      description: "Questions with meaningful responses",
      icon: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
    },
    {
      title: "Avg. Response Time",
      value: "2.5min",
      trend: "-30s",
      description: "Average time to complete feedback",
      icon: <ArrowUpRight className="h-5 w-5 text-violet-600" />,
    },
  ];

  const sentimentData = [
    { department: "Engineering", positive: 75, neutral: 15, negative: 10 },
    { department: "Marketing", positive: 65, neutral: 25, negative: 10 },
    { department: "Sales", positive: 80, neutral: 15, negative: 5 },
  ];

  const questionTypeData = [
    { type: "Sentiment", count: 45, engagement: 92 },
    { type: "Multiple Choice", count: 30, engagement: 88 },
    { type: "Text", count: 25, engagement: 75 },
  ];

  const responseTrendData = [
    { month: "Jan", responses: 120, completion: 85 },
    { month: "Feb", responses: 150, completion: 88 },
    { month: "Mar", responses: 180, completion: 92 },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Question Analytics</h1>
          <p className="text-gray-500 mt-2">
            Monitor question performance and response analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SentimentAnalysis data={sentimentData} />
          <QuestionTypePerformance data={questionTypeData} />
        </div>

        <ResponseTrends data={responseTrendData} />
      </div>
    </div>
  );
};

export default QuestionDashboard;
