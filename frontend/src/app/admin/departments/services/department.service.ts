import type {
  Department,
  DepartmentHierarchy,
  DepartmentMetrics,
  CreateDepartmentDto,
  DepartmentMember,
} from "../models/types";
import {
  userApi,
  type Department as ApiDepartment,
  type CreateDepartmentRequest,
} from "@/lib/api/users";

export class DepartmentService {
  private static readonly BASE_URL = "/api/departments";

  private static mapApiDepartmentToDepartment(
    apiDept: ApiDepartment,
  ): Department {
    return {
      id: parseInt(apiDept.id),
      name: apiDept.name,
      description: apiDept.description,
      active: apiDept.status === "active",
      employeeCount: apiDept.employeeCount,
    };
  }

  private static mapDepartmentToApiRequest(
    dept: CreateDepartmentDto,
  ): CreateDepartmentRequest {
    return {
      name: dept.name,
      description: dept.description,
      status: dept.active ? "active" : "inactive",
    };
  }

  static async getDepartments(): Promise<{
    departments: DepartmentHierarchy[];
    metrics: DepartmentMetrics;
  }> {
    const departments = await userApi.getDepartments();
    const mappedDepartments = departments.map(
      this.mapApiDepartmentToDepartment,
    );

    return {
      departments: mappedDepartments,
      metrics: {
        totalDepartments: departments.length,
        activeDepartments: departments.filter((d) => d.status === "active")
          .length,
        departmentsByLevel: {}, // This would need to be calculated based on hierarchy
        totalMembers: departments.reduce(
          (acc, d) => acc + (d.employeeCount || 0),
          0,
        ),
      },
    };
  }

  static async getDepartment(id: number): Promise<Department> {
    const response = await userApi.getDepartment(id.toString());
    return this.mapApiDepartmentToDepartment(response);
  }

  static async createDepartment(
    data: CreateDepartmentDto,
  ): Promise<Department> {
    const apiData = this.mapDepartmentToApiRequest(data);
    const response = await userApi.createDepartment(apiData);
    return this.mapApiDepartmentToDepartment(response);
  }

  static async updateDepartment(
    id: number,
    data: Partial<CreateDepartmentDto>,
  ): Promise<Department> {
    const apiData = this.mapDepartmentToApiRequest(data as CreateDepartmentDto);
    const response = await userApi.updateDepartment(id.toString(), apiData);
    return this.mapApiDepartmentToDepartment(response);
  }

  static async deleteDepartment(id: number): Promise<void> {
    await userApi.deleteDepartment(id.toString());
  }

  static async getDepartmentMembers(id: number): Promise<{
    users: DepartmentMember[];
    total: number;
  }> {
    const department = await userApi.getDepartment(id.toString());
    return {
      users:
        department.members?.map((member) => ({
          id: parseInt(member.id),
          fullname: member.name,
          email: member.email,
          role: member.role,
        })) || [],
      total: department.members?.length || 0,
    };
  }

  static async addDepartmentMember(
    departmentId: number,
    userId: number,
    role: string,
  ): Promise<void> {
    const department = await userApi.getDepartment(departmentId.toString());
    const updatedMembers = [
      ...(department.members || []),
      { id: userId.toString(), role },
    ];
    await userApi.updateDepartment(departmentId.toString(), {
      members: updatedMembers,
    });
  }

  static async removeDepartmentMember(
    departmentId: number,
    userId: number,
  ): Promise<void> {
    const department = await userApi.getDepartment(departmentId.toString());
    const updatedMembers = (department.members || []).filter(
      (member) => member.id !== userId.toString(),
    );
    await userApi.updateDepartment(departmentId.toString(), {
      members: updatedMembers,
    });
  }

  static async updateDepartmentMemberRole(
    departmentId: number,
    userId: number,
    role: string,
  ): Promise<void> {
    const department = await userApi.getDepartment(departmentId.toString());
    const updatedMembers = (department.members || []).map((member) =>
      member.id === userId.toString() ? { ...member, role } : member,
    );
    await userApi.updateDepartment(departmentId.toString(), {
      members: updatedMembers,
    });
  }
}
