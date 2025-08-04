import {
  HomeIcon,
  SchoolIcon,
  UserIcon,
  CircleCheckBig,
  SettingsIcon,
  Palette,
  BellRing,
  DollarSignIcon,
  University,
  Megaphone,
  Ticket,
  ShieldAlert,
  LogOutIcon,
  MonitorSmartphone,
  HandCoins,
  Flower,
  BadgeCent,
  Footprints
} from "lucide-react";

import type { NavSection } from "@/types/nav";

export const siteConfig: {
  name: string;
  description: string;
  navMenuItems: NavSection[];
  links: Record<string, string>;
} = {
  name: "HLLC Admin",
  description: "",
  navMenuItems: [
    {
      section: "Dashboard",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: HomeIcon },
      ],
    },
    {
      section: "User Management",
      items: [
        { label: "Schools & Majors", href: "/schools", icon: SchoolIcon, permission: "schools:read" },
        { label: "Users Management", href: "/users", icon: UserIcon, permission: "users:read" },
        { label: "Notifications", href: "/notifications", icon: BellRing , permission: "notification:read"},
        { label: "Activities", href: "/activities", icon: University, permission: "activities:read" },
        { label: "Checkin", href: "/checkin", icon: CircleCheckBig, permission: "checkin:read" },
        { label: "Reports", href: "/reports", icon: ShieldAlert, permission: "reports:read" },
        { label: "Stepconters", href: "/step-conters", icon: Footprints , permission: "Stepconters:read"}, // ไม่มีขื่อแบบทางการ
      ],
    },
    {
      section: "Sponsor & Evoucher",
      items: [
        { label: "Sponsor", href: "/sponsor", icon: HandCoins, permission: "sponsor:read" },
        { label: "Evoucher", href: "/evoucher", icon: Ticket, permission: "evoucher:read" },
        { label: "Evoucher Code", href: "/evoucher-code", icon: BadgeCent, permission: "evoucher-code:read" },
        { label: "Campaign", href: "/campaigns", icon: Megaphone, permission: "campaigns:read" },
      ],
    },
    {
      section: "Lamduan",
      items: [
        { label: "Lamduan flowers" , href: "/lamduanflowers" , icon: Flower , permission:"lamduanflowers:read"},
      ],
    },
    {
      section: "Settings",
      items: [
        { label: "Settings", href: "/settings", icon: SettingsIcon, permission: "system:read" },
        { label: "Appearance", href: "/appearance", icon: Palette, permission: "appearance:read" },
      ],
    },
    {
      section: "Account",
      items: [
        { label: "Logout", href: "/logout", icon: LogOutIcon },
      ],
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};