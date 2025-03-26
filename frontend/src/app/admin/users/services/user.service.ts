import api from "@/lib/api/axios";
import type { User, CreateUserRequest, Department, CreateDepartmentRequest } from "../models/types";

const BASE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8081';

export const userService = {
  // User operations
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get(`${BASE_URL}/api/manager/list`);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await api.get(`${BASE_URL}/api/manager/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  createUser: async (data: CreateUserRequest): Promise<User> => {
    try {
      const response = await api.post(`${BASE_URL}/api/auth/register`, {
        ...data,
        roles: data.roles.map(role => ({ name: role }))
      });
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  updateUser: async (id: number, data: Partial<CreateUserRequest>): Promise<User> => {
    try {
      const response = await api.patch(`${BASE_URL}/api/manager/${id}`, {
        ...data,
        roles: data.roles?.map(role => ({ name: role }))
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteUser: async (id: number): Promise<void> => {
    try {
      await api.delete(`${BASE_URL}/api/manager/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Department operations
  getDepartments: async (): Promise<Department[]> => {
    try {
      const response = await api.get(`${BASE_URL}/api/departments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  getDepartmentById: async (id: number): Promise<Department> => {
    try {
      const response = await api.get(`${BASE_URL}/api/departments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department:', error);
      throw error;
    }
  },

  createDepartment: async (data: CreateDepartmentRequest): Promise<Department> => {
    try {
      const response = await api.post(`${BASE_URL}/api/departments`, {
        ...data,
        active: true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  },

  updateDepartment: async (id: number, data: Partial<CreateDepartmentRequest>): Promise<Department> => {
    try {
      const response = await api.patch(`${BASE_URL}/api/departments/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  },

  deleteDepartment: async (id: number): Promise<void> => {
    try {
      await api.delete(`${BASE_URL}/api/departments/${id}`);
    } catch (error) {
      console.error('Error deleting department:', error);
      throw error;
    }
  },

  // Department members
  getDepartmentMembers: async (departmentId: number): Promise<User[]> => {
    try {
      const response = await api.get(`${BASE_URL}/api/departments/${departmentId}/members`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department members:', error);
      throw error;
    }
  },

  addDepartmentMember: async (departmentId: number, userId: number): Promise<void> => {
    try {
      await api.post(`${BASE_URL}/api/departments/${departmentId}/members`, { userId });
    } catch (error) {
      console.error('Error adding department member:', error);
      throw error;
    }
  },

  removeDepartmentMember: async (departmentId: number, userId: number): Promise<void> => {
    try {
      await api.delete(`${BASE_URL}/api/departments/${departmentId}/members/${userId}`);
    } catch (error) {
      console.error('Error removing department member:', error);
      throw error;
    }
  },
}; 