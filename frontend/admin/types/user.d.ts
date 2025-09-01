import { Role } from './role';

export type Lang = {
  th: string;
  en: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  departments: DepartmentSummary[];
  roles: string[];
  active: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type DepartmentSummary = {
  id: number;
  name: string;
};

export type UserStats = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalRoles: number;
};
