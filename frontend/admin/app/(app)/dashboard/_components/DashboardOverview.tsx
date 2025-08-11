"use client";

import { Card, CardBody } from "@heroui/react";
import { 
  FolderIcon, 
  FileTextIcon, 
  UsersIcon, 
  CheckCircleIcon 
} from "lucide-react";
import type { DashboardOverview } from "@/types/dashboard";
import { getOverviewStatsConfig } from "@/services/dataService";

interface DashboardOverviewProps {
  data: DashboardOverview;
}

// Icon mapping
const iconMap = {
  FolderIcon,
  FileTextIcon,
  UsersIcon,
  CheckCircleIcon
};

export function DashboardOverview({ data }: DashboardOverviewProps) {
  const statsConfig = getOverviewStatsConfig();
  
  const stats = statsConfig.map(config => {
    const IconComponent = iconMap[config.icon as keyof typeof iconMap];
    const rawValue = data[config.key as keyof DashboardOverview] as number;
    const value = config.isPercentage ? `${rawValue}%` : rawValue;
    const growth = data[config.growthKey as keyof DashboardOverview] as string;
    
    return {
      title: config.title,
      value,
      growth,
      icon: IconComponent,
      color: config.color,
      textColor: config.textColor
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pt-3">
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