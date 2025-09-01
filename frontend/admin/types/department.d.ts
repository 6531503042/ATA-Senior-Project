export type Department = {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  members?: DepartmentMember[];
};

export interface DepartmentMember {
  id: number;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  joinedAt: string;
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
  active?: boolean;
  members?: number[];
}

export interface UpdateDepartmentRequest {
  id: number;
  name?: string;
  description?: string;
  active?: boolean;
  members?: number[];
}

export interface DepartmentWithMembers extends Department {
  members: DepartmentMember[];
}
