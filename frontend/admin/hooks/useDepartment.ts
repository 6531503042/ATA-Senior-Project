import { useState, useCallback, useEffect } from "react";
import departmentData from "@/data/department.json";
import type { Department, DepartmentStats, CreateDepartmentRequest, UpdateDepartmentRequest } from "@/types/department";

async function getDepartments() {
  return Promise.resolve(departmentData);
}

async function createDepartment(data: CreateDepartmentRequest) {
  const now = new Date().toISOString();
  return Promise.resolve({
    id: `dep-${Math.random().toString(36).substring(2, 8)}`,
    ...data,
    createdAt: now,
    updatedAt: now
  } as Department);
}

async function updateDepartment(data: UpdateDepartmentRequest) {
  const now = new Date().toISOString();
  return Promise.resolve({
    ...data,
    updatedAt: now
  } as Department);
}

async function deleteDepartment(id: string) {
  return Promise.resolve(true);
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<DepartmentStats>({
    totalDepartments: 0,
    activeDepartments: 0,
    inactiveDepartments: 0,
    totalEmployees: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDepartments();
      setDepartments(response.departments);
      setStats(response.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  }, []);

  const addDepartment = useCallback(async (data: CreateDepartmentRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newDept = await createDepartment(data);
      setDepartments(prev => [newDept, ...prev]);
      
      setStats(prev => ({
        ...prev,
        totalDepartments: prev.totalDepartments + 1,
        activeDepartments: data.status === "active" ? prev.activeDepartments + 1 : prev.activeDepartments,
        inactiveDepartments: data.status === "inactive" ? prev.inactiveDepartments + 1 : prev.inactiveDepartments,
        totalEmployees: prev.totalEmployees + (data.employeeCount || 0)
      }));

      return newDept;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create department");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editDepartment = useCallback(async (data: UpdateDepartmentRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedDept = await updateDepartment(data);
      setDepartments(prev =>
        prev.map(dep => dep.id === data.id ? updatedDept : dep)
      );

      if (data.status) {
        setStats(prev => {
          const oldDept = departments.find(d => d.id === data.id);
          if (!oldDept) return prev;

          let activeChange = 0;
          let inactiveChange = 0;

          if (oldDept.status === "active" && data.status !== "active") {
            activeChange = -1;
            inactiveChange = +1;
          } else if (oldDept.status !== "active" && data.status === "active") {
            activeChange = +1;
            inactiveChange = -1;
          }

          return {
            ...prev,
            activeDepartments: prev.activeDepartments + activeChange,
            inactiveDepartments: prev.inactiveDepartments + inactiveChange
          };
        });
      }

      return updatedDept;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update department");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [departments]);

  const removeDepartment = useCallback(async (departmentId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteDepartment(departmentId);

      const deptToDelete = departments.find(d => d.id === departmentId);
      setDepartments(prev => prev.filter(dep => dep.id !== departmentId));

      if (deptToDelete) {
        setStats(prev => ({
          ...prev,
          totalDepartments: prev.totalDepartments - 1,
          activeDepartments: deptToDelete.status === "active" ? prev.activeDepartments - 1 : prev.activeDepartments,
          inactiveDepartments: deptToDelete.status === "inactive" ? prev.inactiveDepartments - 1 : prev.inactiveDepartments,
          totalEmployees: prev.totalEmployees - (deptToDelete.employeeCount || 0)
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete department");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [departments]);

  const refreshDepartments = useCallback(async () => {
    await fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    stats,
    loading,
    error,
    addDepartment,
    editDepartment,
    removeDepartment,
    refreshDepartments
  };
}
