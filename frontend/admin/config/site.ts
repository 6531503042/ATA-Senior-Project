import type { NavSection } from '@/types/nav';

import {
  HomeIcon,
  SchoolIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  FolderIcon,
  FileTextIcon,
  MessageCircleIcon,
  UserRoundSearchIcon,
} from 'lucide-react';

export const siteConfig: {
  name: string;
  description: string;
  navMenuItems: NavSection[];
  links: Record<string, string>;
} = {
  name: 'ATA-IT Management',
  description: '',
  navMenuItems: [
    {
      section: 'Dashboard',
      items: [{ label: 'Dashboard', href: '/dashboard', icon: HomeIcon }],
    },
    {
      section: 'User Management',
      items: [
        {
          label: 'Users Management',
          href: '/users',
          icon: UserIcon,
          permission: 'users:read',
        }, // ไม่มีขื่อแบบทางการ
        {
          label: 'Departments',
          href: '/departments',
          icon: SchoolIcon,
          permission: 'departments:read',
        },
      ],
    },
    {
      section: 'Projects & Feedbacks',
      items: [
        {
          label: 'Projects',
          href: '/projects',
          icon: FolderIcon,
          permission: 'projects:read',
        },
        {
          label: 'Feedbacks',
          href: '/feedbacks',
          icon: FileTextIcon,
          permission: 'feedbacks:read',
        },
        {
          label: 'Submissions',
          href: '/submissions',
          icon: UserRoundSearchIcon,
          permission: 'submissions:read',
        },
        {
          label: 'Questions',
          href: '/questions',
          icon: MessageCircleIcon,
          permission: 'questions:read',
        },
      ],
    },
    {
      section: 'Settings',
      items: [
        {
          label: 'Settings',
          href: '/settings',
          icon: SettingsIcon,
          permission: 'system:read',
        },
      ],
    },
    {
      section: 'Account',
      items: [{ label: 'Logout', href: '/logout', icon: LogOutIcon }],
    },
  ],
  links: {
    github: 'https://github.com/heroui-inc/heroui',
    twitter: 'https://twitter.com/hero_ui',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
};
