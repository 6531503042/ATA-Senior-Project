export interface Department {
  id: number;
  name: string;
  description: string;
  active: boolean;
  employeeCount?: number;
}

export interface DepartmentHierarchy {
  id: number;
  name: string;
  description: string;
  active: boolean;
  employeeCount?: number;
}

export interface DepartmentMetrics {
  totalDepartments: number;
  activeDepartments: number;
  departmentsByLevel: Record<number, number>;
  totalMembers: number;
}

export interface DepartmentMember {
  id: number;
  fullname: string;
  email: string;
  role: string;
}

export interface CreateDepartmentDto {
  name: string;
  description: string;
  active?: boolean;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  active?: boolean;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  active?: boolean;
} 