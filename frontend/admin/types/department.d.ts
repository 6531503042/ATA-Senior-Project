
export interface Department {
  id: string;
  name: string;
  description: string;
  manager: string;
  employeeCount: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  inactiveDepartments: number;
  totalEmployees: number;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  manager: string;
  employeeCount: number;
  status: 'Active' | 'Inactive';
}

export interface UpdateDepartmentRequest {
  id: string;
  name?: string;
  description?: string;
  manager?: string;
  employeeCount?: number;
  status?: 'Active' | 'Inactive';
}
