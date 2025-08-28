'use client';

import { Card, CardBody, CardHeader, Avatar, Skeleton, Button } from '@heroui/react';
import { Activity, Clock, ArrowRight } from 'lucide-react';
import type { ActivityFeed } from '@/types/dashboard';

interface RecentActivityProps {
  activities: ActivityFeed[];
  loading?: boolean;
}

export function RecentActivity({ activities, loading = false }: RecentActivityProps) {
  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Just now';
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } catch {
      return 'Unknown';
    }
  };

  const getActivityColor = (action: string) => {
    if (action.includes('created')) return 'text-green-600 bg-green-100';
    if (action.includes('updated')) return 'text-blue-600 bg-blue-100';
    if (action.includes('deleted')) return 'text-red-600 bg-red-100';
    return 'text-default-600 bg-default-100';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-2xl border border-default-200 bg-white shadow-md">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="w-3/4 h-4 rounded" />
              <Skeleton className="w-1/2 h-3 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="w-12 h-12 text-default-300 mx-auto mb-4" />
        <p className="text-default-500 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.slice(0, 5).map((activity, index) => (
        <div
          key={`${activity.icon}-${activity.actorName}-${activity.action}-${activity.timestamp}-${index}`}
          className="flex items-start gap-3 p-3 rounded-2xl border border-default-200 bg-white shadow-md hover:shadow-lg transition-all"
        >
          <Avatar
            name={activity.actorName?.charAt(0) || 'U'}
            size="sm"
            className="flex-shrink-0 bg-primary text-white"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-default-900 truncate">
                  <span className="font-semibold">{activity.actorName}</span> {activity.action}
                </p>
                <p className="text-xs text-default-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(activity.timestamp)}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.action)}`}>
                {activity.action}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {activities.length > 5 && (
        <div className="text-center pt-2">
          <Button 
            size="sm" 
            variant="light" 
            endContent={<ArrowRight className="w-4 h-4" />}
            className="text-primary"
          >
            View All Activities
          </Button>
        </div>
      )}
    </div>
  );
}