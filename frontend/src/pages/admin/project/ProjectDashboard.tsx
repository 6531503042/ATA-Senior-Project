
import React from "react";
import {
  Users,
  Calendar,
  Clock,
  Activity,
  MessageSquare,
  BarChart3,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const metrics = [
  {
    title: "Active Projects",
    value: "12",
    change: "+2",
    description: "Projects in progress",
    icon: Activity,
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Team Members",
    value: "48",
    change: "+5",
    description: "Total members across projects",
    icon: Users,
    gradient: "from-violet-500/10 to-purple-500/10",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    title: "Feedback Forms",
    value: "156",
    change: "+23",
    description: "Total feedback collected",
    icon: MessageSquare,
    gradient: "from-emerald-500/10 to-green-500/10",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    title: "Questions",
    value: "280",
    change: "+15",
    description: "Active questions",
    icon: FileText,
    gradient: "from-amber-500/10 to-yellow-500/10",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

const ProjectDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-[1600px] mx-auto p-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Project Analytics</h1>
            <p className="text-gray-500 max-w-2xl">
              Monitor project performance and feedback metrics
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            Last 30 Days
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className={`absolute inset-0 bg-gradient-to-r ${metric.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metric.title}
                </CardTitle>
                <div className={`h-8 w-8 rounded-full ${metric.iconBg} flex items-center justify-center`}>
                  <metric.icon className={`h-4 w-4 ${metric.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-bold">{metric.value}</div>
                  <div className="text-sm text-green-600 font-medium">{metric.change}</div>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {metric.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/20 pointer-events-none" />
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Project start and end dates distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Timeline chart will be implemented here showing project durations
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/20 pointer-events-none" />
            <CardHeader>
              <CardTitle>Feedback Distribution</CardTitle>
              <CardDescription>Feedback categories and response rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Distribution chart will show feedback by category
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/20 pointer-events-none" />
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
              <CardDescription>Member participation and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Activity chart will show member participation
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/20 pointer-events-none" />
            <CardHeader>
              <CardTitle>Question Analytics</CardTitle>
              <CardDescription>Question types and response patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Question analytics chart will be implemented here
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
