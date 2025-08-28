'use client';

import { Button, Tooltip } from '@heroui/react';
import {
  RefreshCw,
  FolderPlus,
  MessageSquarePlus,
  UserPlus,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

interface QuickCreateProps {
  showRefresh?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  layout?: 'inline' | 'compact';
}

export function QuickCreate({
  showRefresh = true,
  onRefresh,
  isRefreshing = false,
  layout = 'inline',
}: QuickCreateProps) {
  const actions = [
    {
      key: 'project',
      label: 'Create Project',
      href: '/projects',
      icon: <FolderPlus className="w-4 h-4" />,
      className: 'from-[#5B8CFF] to-[#3D5AFE]',
    },
    {
      key: 'feedback',
      label: 'Create Feedback',
      href: '/feedbacks',
      icon: <MessageSquarePlus className="w-4 h-4" />,
      className: 'from-[#34D399] to-[#10B981]',
    },
    {
      key: 'user',
      label: 'Invite User',
      href: '/users',
      icon: <UserPlus className="w-4 h-4" />,
      className: 'from-[#A78BFA] to-[#8B5CF6]',
    },
    {
      key: 'reports',
      label: 'View Reports',
      href: '/dashboard',
      icon: <BarChart3 className="w-4 h-4" />,
      className: 'from-[#FB923C] to-[#F59E0B]',
    },
  ];

  if (layout === 'compact') {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {actions.map(a => (
            <Link key={a.key} href={a.href}>
              <Button
                className={`w-full font-semibold text-white bg-gradient-to-r ${a.className}`}
                radius="lg"
                size="sm"
                startContent={a.icon}
                variant="shadow"
              >
                {a.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {showRefresh && (
        <Tooltip content="Refresh">
          <Button
            isIconOnly
            isLoading={isRefreshing}
            radius="lg"
            variant="flat"
            onPress={onRefresh}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </Tooltip>
      )}

      <div className="hidden sm:flex items-center gap-2">
        {actions.map(a => (
          <Link key={a.key} href={a.href}>
            <Button
              className={`font-semibold text-white bg-gradient-to-r ${a.className}`}
              radius="lg"
              size="sm"
              startContent={a.icon}
              variant="shadow"
            >
              {a.label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
