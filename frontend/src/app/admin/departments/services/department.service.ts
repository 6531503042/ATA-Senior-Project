import type { Department, DepartmentHierarchy, DepartmentMetrics, CreateDepartmentDto } from '../models/types';
import { api } from '@/lib/api';

export class DepartmentService {
  private static readonly BASE_URL = '/api/departments';

  static async getDepartments(): Promise<{
    departments: DepartmentHierarchy[];
    metrics: DepartmentMetrics;
  }> {
    const response = await api.get(this.BASE_URL);
    return response.data;
  }

  static async getDepartment(id: number): Promise<Department> {
    const response = await api.get(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  static async createDepartment(data: CreateDepartmentDto): Promise<Department> {
    const response = await api.post(this.BASE_URL, data);
    return response.data;
  }

  static async updateDepartment(
    id: number,
    data: Partial<CreateDepartmentDto>
  ): Promise<Department> {
    const response = await api.patch(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  static async deleteDepartment(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }

  static async getDepartmentMembers(id: number): Promise<{
    users: Array<{
      id: number;
      fullname: string;
      email: string;
      role: string;
    }>;
    total: number;
  }> {
    const response = await api.get(`${this.BASE_URL}/${id}/members`);
    return response.data;
  }

  static async addDepartmentMember(
    departmentId: number,
    userId: number,
    role: string
  ): Promise<void> {
    await api.post(`${this.BASE_URL}/${departmentId}/members`, {
      userId,
      role,
    });
  }

  static async removeDepartmentMember(
    departmentId: number,
    userId: number
  ): Promise<void> {
    await api.delete(`${this.BASE_URL}/${departmentId}/members/${userId}`);
  }

  static async updateDepartmentMemberRole(
    departmentId: number,
    userId: number,
    role: string
  ): Promise<void> {
    await api.patch(`${this.BASE_URL}/${departmentId}/members/${userId}`, {
      role,
    });
  }
} 