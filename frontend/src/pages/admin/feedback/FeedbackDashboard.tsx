
import React, { useState } from 'react';
import { MetricCard } from "@/components/dashboard/MetricsCard";
import { ResponseTrends } from "@/components/dashboard/ResponseTrends";
import { QuestionTypePerformance } from "@/components/dashboard/QuestionTypePerformance";
import { SentimentAnalysis } from "@/components/dashboard/SentimentAnalysis";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  SparklesIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

const FeedbackDashboard = () => {
  // Sample data for charts
  const responseData = [
    { month: 'Jan', responses: 65, completion: 92 },
    { month: 'Feb', responses: 75, completion: 89 },
    { month: 'Mar', responses: 85, completion: 94 },
    { month: 'Apr', responses: 82, completion: 91 },
    { month: 'May', responses: 90, completion: 95 },
    { month: 'Jun', responses: 95, completion: 97 },
  ];

  const questionTypeData = [
    { type: 'Multiple Choice', count: 45, engagement: 88 },
    { type: 'Rating', count: 32, engagement: 92 },
    { type: 'Text', count: 28, engagement: 75 },
    { type: 'Single Choice', count: 38, engagement: 85 },
  ];

  const sentimentData = [
    { department: 'Engineering', positive: 65, neutral: 25, negative: 10 },
    { department: 'Marketing', positive: 72, neutral: 20, negative: 8 },
    { department: 'Sales', positive: 58, neutral: 30, negative: 12 },
    { department: 'HR', positive: 80, neutral: 15, negative: 5 },
  ];

  const metrics = [
    {
      title: "Overall Satisfaction",
      value: "8.7/10",
      trend: "+0.5",
      description: "Average employee satisfaction score based on feedback responses",
      icon: <HeartIcon className="w-6 h-6 text-rose-500" />,
    },
    {
      title: "Response Rate",
      value: "92%",
      trend: "+4%",
      description: "Percentage of employees who completed feedback forms",
      icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-violet-500" />,
    },
    {
      title: "Sentiment Score",
      value: "4.5/5",
      trend: "+0.2",
      description: "Overall sentiment analysis from feedback responses",
      icon: <SparklesIcon className="w-6 h-6 text-amber-500" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white/90 space-y-8 p-8">
      <div className="max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Feedback Analytics
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Monitor feedback trends and gain insights from employee responses
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="30">
              <SelectTrigger className="w-[180px] bg-white">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="bg-white hover:bg-gray-50">
              Export Report
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ResponseTrends data={responseData} />
          <QuestionTypePerformance data={questionTypeData} />
        </div>

        {/* Sentiment Analysis */}
        <SentimentAnalysis data={sentimentData} />
      </div>
    </div>
  );
};

export default FeedbackDashboard;
