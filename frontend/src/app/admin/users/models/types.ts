export interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  avatar: string | null;
  gender: "MALE" | "FEMALE" | "OTHER";
  department: Department | null;
  roles: Role[];
}

export interface CreateUserRequest {
  username: string;
  fullname: string;
  email: string;
  password: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  departmentId?: number;
  roles: Role[];
}

export interface UpdateUserRequest {
  fullname?: string;
  email?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  departmentId?: number;
  roles: Role[];
}

export interface Department {
  id: number;
  name: string;
  description: string;
  active: boolean;
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

export type Role = "ROLE_ADMIN" | "ROLE_USER" | "ROLE_MANAGER";
