'use client';

import { ReactNode, useMemo } from 'react';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/react';
import { usePathname } from 'next/navigation';

interface PageHeaderProps {
  title?: string;
  right?: ReactNode;
  description: string;
  icon: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export function PageHeader({
  title,
  right,
  icon,
  description,
  breadcrumbs,
}: PageHeaderProps) {
  const pathname = usePathname?.() || '';
  const moduleLabel = useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0) return breadcrumbs[breadcrumbs.length - 1]?.label;
    const seg = pathname.split('/').filter(Boolean)[0];
    if (!seg) return title || 'Dashboard';
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  }, [breadcrumbs, pathname, title]);

  const crumbs = useMemo(() => {
    if (breadcrumbs && breadcrumbs.length > 0) return breadcrumbs;
    return [
      { label: 'Home', href: '/' },
      { label: moduleLabel, href: `/${(pathname.split('/').filter(Boolean)[0] || '').toLowerCase()}` },
    ];
  }, [breadcrumbs, moduleLabel, pathname]);
  return (
    <div className="mb-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-r shadow-lg from-[#3b82f6] to-[#4f46e5]">
            {icon && <span className="text-white">{icon}</span>}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title || moduleLabel}</h1>
            <p className="text-start text-sm text-default-500 font-medium">
              {description}
            </p>
          </div>
        </div>
        {right && <div className="mt-2 md:mt-0">{right}</div>}
      </div>
      <div className="py-3 px-4 rounded-xl bg-white shadow-sm ring-1 ring-default-200/60 mb-4 mt-4">
        <Breadcrumbs
          className="w-full text-sm text-default-500"
          underline="hover"
        >
          {crumbs.map((c, i) => (
            <BreadcrumbItem key={`${c.label}-${i}`} href={c.href}>
              {c.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      </div>
    </div>
  );
}
