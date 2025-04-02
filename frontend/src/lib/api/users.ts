import axiosInstance from './axios';

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive';
}

export interface Department {
  id: string;
  name: string;
  description: string;
  employeeCount: number;
  status: 'active' | 'inactive';
  members?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  department: string;
  role: string;
  password: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  status?: 'active' | 'inactive';
  members?: Array<{
    id: string;
    role: string;
  }>;
}

export const userApi = {
  // User operations
  getUsers: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/api/users');
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/api/users/${id}`);
    return response.data;
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await axiosInstance.post('/api/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<CreateUserRequest>): Promise<User> => {
    const response = await axiosInstance.put(`/api/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/users/${id}`);
  },

  // Department operations
  getDepartments: async (): Promise<Department[]> => {
    const response = await axiosInstance.get('/api/departments');
    return response.data;
  },

  getDepartment: async (id: string): Promise<Department> => {
    const response = await axiosInstance.get(`/api/departments/${id}`);
    return response.data;
  },

  createDepartment: async (data: CreateDepartmentRequest): Promise<Department> => {
    const response = await axiosInstance.post('/api/departments', data);
    return response.data;
  },

  updateDepartment: async (id: string, data: Partial<CreateDepartmentRequest>): Promise<Department> => {
    const response = await axiosInstance.put(`/api/departments/${id}`, data);
    return response.data;
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/departments/${id}`);
  },
}; 