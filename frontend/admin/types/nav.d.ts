// types/nav.ts
export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
};

export type NavSection = {
  section: string;
  items: NavItem[];
};
