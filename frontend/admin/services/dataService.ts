import type { DashboardOverview } from '@/types/dashboard';

export interface StatsConfig {
  key: keyof DashboardOverview;
  title: string;
  icon: string;
  color: string;
  textColor: string;
  isPercentage: boolean;
  growthKey: keyof DashboardOverview;
}

export const getOverviewStatsConfig = (): StatsConfig[] => [
  {
    key: 'totalProjects',
    title: 'Total Projects',
    icon: 'FolderIcon',
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
    isPercentage: false,
    growthKey: 'projectsGrowth',
  },
  {
    key: 'totalSubmissions',
    title: 'Total Submissions',
    icon: 'FileTextIcon',
    color: 'bg-green-100',
    textColor: 'text-green-600',
    isPercentage: false,
    growthKey: 'submissionsGrowth',
  },
  {
    key: 'totalMembers',
    title: 'Total Members',
    icon: 'UsersIcon',
    color: 'bg-purple-100',
    textColor: 'text-purple-600',
    isPercentage: false,
    growthKey: 'membersGrowth',
  },
  {
    key: 'completionRate',
    title: 'Completion Rate',
    icon: 'CheckCircleIcon',
    color: 'bg-orange-100',
    textColor: 'text-orange-600',
    isPercentage: true,
    growthKey: 'completionGrowth',
  },
];

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }

  return num.toString();
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatGrowth = (growth: string): string => {
  if (!growth) return '+0%';

  const isPositive = growth.startsWith('+');
  const color = isPositive ? 'text-green-600' : 'text-red-600';

  return growth;
};

export const getTrendIcon = (growth: string) => {
  if (!growth) return 'MinusIcon';

  const isPositive = growth.startsWith('+');

  return isPositive ? 'TrendingUpIcon' : 'TrendingDownIcon';
};

export const getTrendColor = (growth: string) => {
  if (!growth) return 'text-gray-500';

  const isPositive = growth.startsWith('+');

  return isPositive ? 'text-green-600' : 'text-red-600';
};

export const calculateGrowth = (current: number, previous: number): string => {
  if (previous === 0) {
    return current > 0 ? '+100%' : '0%';
  }

  const growth = ((current - previous) / previous) * 100;
  const sign = growth >= 0 ? '+' : '';

  return `${sign}${growth.toFixed(1)}%`;
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'completed':
    case 'success':
      return 'success';
    case 'pending':
    case 'warning':
      return 'warning';
    case 'inactive':
    case 'failed':
    case 'error':
      return 'danger';
    default:
      return 'default';
  }
};

export const getSentimentColor = (sentiment: string) => {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'success';
    case 'negative':
      return 'danger';
    case 'neutral':
      return 'default';
    default:
      return 'default';
  }
};

export const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      // 7 days
      const days = Math.floor(diffInHours / 24);

      return `${days}d ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  } catch {
    return 'Invalid date';
  }
};

export const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'success';
  if (progress >= 60) return 'warning';

  return 'danger';
};

export const getScoreColor = (score: number) => {
  if (score >= 7) return 'success';
  if (score >= 5) return 'warning';

  return 'danger';
};
