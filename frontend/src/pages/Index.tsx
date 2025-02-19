import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import {
  ChartBarIcon,
  UserGroupIcon,
  StarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/20/solid";

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string; icon: any }) => (
  <Card className="p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="p-3 rounded-xl bg-gray-50">
        <Icon className="w-6 h-6 text-gray-700" />
      </div>
    </div>
  </Card>
);

const Index = () => {
  useEffect(() => {
    console.log('Index page mounted');
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <p className="text-gray-500">Here's what's happening with your feedback system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Responses"
          value="1,234"
          icon={ChartBarIcon}
        />
        <StatCard
          title="Active Users"
          value="256"
          icon={UserGroupIcon}
        />
        <StatCard
          title="Average Rating"
          value="4.8"
          icon={StarIcon}
        />
        <StatCard
          title="Response Rate"
          value="92%"
          icon={ArrowTrendingUpIcon}
        />
      </div>
    </div>
  );
};

export default Index;