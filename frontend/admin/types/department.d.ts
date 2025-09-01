export type Department = {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface DepartmentStats {
  totalDepartments: number;
  activeDepartments: number;
  inactiveDepartments: number;
  totalEmployees: number;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  active?: boolean;
}

export interface UpdateDepartmentRequest {
  id: number;
  name?: string;
  description?: string;
  active?: boolean;
}
