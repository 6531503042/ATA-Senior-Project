'use client';

import React, { createContext, useContext, useState } from 'react';
import { usePathname } from 'next/navigation';

import { siteConfig } from '@/config/site';

// --- Types ---
type DynamicLabels = Record<string, string | undefined>;

interface BreadcrumbContextType {
  dynamicLabels: DynamicLabels;
  setDynamicLabel: (path: string, label: string) => void;
}

// --- Context Setup ---
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined,
);

export const BreadcrumbProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [dynamicLabels, setDynamicLabels] = useState<DynamicLabels>({});

  const setDynamicLabel = (path: string, label: string) => {
    setDynamicLabels(prev => ({ ...prev, [path]: label }));
  };

  return (
    <BreadcrumbContext.Provider value={{ dynamicLabels, setDynamicLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbContext = () => {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error(
      'useBreadcrumbContext must be used within a BreadcrumbProvider',
    );
  }

  return context;
};

// --- useBreadcrumb Hook ---
export function useBreadcrumb() {
  const pathname = usePathname();
  const { dynamicLabels } = useBreadcrumbContext();

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  const segments = pathname
    .split('/')
    .filter(Boolean)
    .reduce<string[]>((acc, _, idx, arr) => {
      acc.push('/' + arr.slice(0, idx + 1).join('/'));

      return acc;
    }, []);

  return segments.map(segmentPath => {
    // Flatten navMenuItems, handling both grouped and ungrouped items
    const navItems = siteConfig.navMenuItems.flatMap(section => {
      // If section has 'items', return them; else, treat section as an item
      if ('items' in section && Array.isArray((section as any).items)) {
        return (section as any).items;
      }

      return [section];
    });

    const configItem = navItems.find((item: any) => item.href === segmentPath);

    const label =
      configItem?.label ??
      dynamicLabels[segmentPath] ??
      decodeURIComponent(segmentPath.split('/').pop()!);

    return {
      name: label,
      href: basePath + segmentPath,
    };
  });
}
