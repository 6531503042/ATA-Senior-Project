export interface Department {
  id: number;
  name: string;
  description: string;
  managerId?: number;
  parentDepartmentId?: number;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CreateDepartmentDto {
  name: string;
  description: string;
  managerId?: number;
  parentDepartmentId?: number;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface DepartmentMetrics {
  totalDepartments: number;
  activeDepartments: number;
  totalMembers: number;
  departmentsByLevel: {
    [key: string]: number;
  };
}

export interface DepartmentHierarchy extends Department {
  children: DepartmentHierarchy[];
  level: number;
} 