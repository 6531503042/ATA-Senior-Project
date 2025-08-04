"use client";

import { Card, CardBody } from "@heroui/react";
import { 
  FolderIcon, 
  FileTextIcon, 
  UsersIcon, 
  CheckCircleIcon 
} from "lucide-react";
import type { DashboardOverview } from "@/types/dashboard";

interface DashboardOverviewProps {
  data: DashboardOverview;
}

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const stats = [
    {
      title: "Total Projects",
      value: data.totalProjects,
      growth: data.projectsGrowth,
      icon: FolderIcon,
      color: "bg-pink-500",
      textColor: "text-pink-600"
    },
    {
      title: "Total Submit",
      value: data.totalSubmissions,
      growth: data.submissionsGrowth,
      icon: FileTextIcon,
      color: "bg-yellow-500",
      textColor: "text-yellow-600"
    },
    {
      title: "Total Members",
      value: data.totalMembers,
      growth: data.membersGrowth,
      icon: UsersIcon,
      color: "bg-green-500",
      textColor: "text-green-600"
    },
    {
      title: "Complete Rate",
      value: `${data.completionRate}%`,
      growth: data.completionGrowth,
      icon: CheckCircleIcon,
      color: "bg-purple-500",
      textColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="border-none shadow-lg">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-default-500 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-default-900">
                  {stat.value}
                </p>
                <p className={`text-xs font-medium ${stat.textColor}`}>
                  {stat.growth}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
} 