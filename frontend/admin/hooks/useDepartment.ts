import type {
  Department,
  DepartmentStats,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/types/department';

import { useState, useCallback, useEffect } from 'react';

import { api } from '@/libs/apiClient';

const base = '/api/departments';

function mapDepartment(api: any): Department {
  return {
    id: String(api.id),
    name: String(api.name),
    description: String(api.description ?? ''),
    manager: '',
    employeeCount: 0,
    status: api.active ? 'active' : 'inactive',
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export async function getDepartments(): Promise<{ departments: Department[]; stats: DepartmentStats }> {
  try {
    const departmentsResponse = await api.get<any>('/api/departments');
    console.log('Departments API response:', departmentsResponse);
    
    // Handle different response formats
    let departments: any[] = [];
    if (departmentsResponse?.content && Array.isArray(departmentsResponse.content)) {
      departments = departmentsResponse.content;
    } else if (Array.isArray(departmentsResponse)) {
      departments = departmentsResponse;
    } else if (departmentsResponse?.departments && Array.isArray(departmentsResponse.departments)) {
      departments = departmentsResponse.departments;
    }
    
    const mappedDepartments = departments.map(mapDepartment);
    
    // Get stats
    const statsResponse = await api.get<any>('/api/dashboard/stats/departments');
    const stats = {
      totalDepartments: statsResponse?.totalDepartments || mappedDepartments.length,
      activeDepartments: statsResponse?.activeDepartments || mappedDepartments.filter(d => d.active).length,
      inactiveDepartments: statsResponse?.inactiveDepartments || mappedDepartments.filter(d => !d.active).length,
      totalEmployees: statsResponse?.totalEmployees || 0,
    };
    
    return { departments: mappedDepartments, stats };
  } catch (error) {
    console.error('Error fetching departments:', error);
    // Return fallback data
    return {
      departments: [],
      stats: {
        totalDepartments: 0,
        activeDepartments: 0,
        inactiveDepartments: 0,
        totalEmployees: 0,
      },
    };
  }
}

async function createDepartment(data: CreateDepartmentRequest) {
  try {
    const payload = {
      name: data.name,
      description: data.description,
      active: data.status === 'active',
    };
    const response = await api.post<any>(`${base}`, payload);
    return mapDepartment(response);
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
}

async function updateDepartment(data: UpdateDepartmentRequest) {
  try {
    const payload: any = { name: data.name, description: data.description };

    if (typeof data.status !== 'undefined')
      payload.active = data.status === 'active';
    const response = await api.put<any>(`${base}/${data.id}`, payload);
    return mapDepartment(response);
  } catch (error) {
    console.error('Error updating department:', error);
    throw error;
  }
}

async function deleteDepartment(id: string) {
  try {
    await api.delete(`${base}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting department:', error);
    throw error;
  }
}

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [stats, setStats] = useState<DepartmentStats>({
    totalDepartments: 0,
    activeDepartments: 0,
    inactiveDepartments: 0,
    totalEmployees: 0,
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
      setError(
        err instanceof Error ? err.message : 'Failed to fetch departments',
      );
      // Set fallback data when API fails
      setDepartments([]);
      setStats({
        totalDepartments: 0,
        activeDepartments: 0,
        inactiveDepartments: 0,
        totalEmployees: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addDepartment = useCallback(async (data: CreateDepartmentRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newDepartment = await createDepartment(data);

      setDepartments(prev => [newDepartment, ...prev]);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalDepartments: prev.totalDepartments + 1,
        activeDepartments: prev.activeDepartments + (data.status === 'active' ? 1 : 0),
        inactiveDepartments: prev.inactiveDepartments + (data.status === 'inactive' ? 1 : 0),
      }));

      return newDepartment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create department');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editDepartment = useCallback(
    async (data: UpdateDepartmentRequest) => {
      try {
        setLoading(true);
        setError(null);
        const updatedDepartment = await updateDepartment(data);

        setDepartments(prev =>
          prev.map(dept => (dept.id === data.id ? updatedDepartment : dept)),
        );

        // Update stats if status changed
        if (data.status) {
          setStats(prev => {
            const oldDept = departments.find(d => d.id === data.id);

            if (!oldDept) return prev;

            let activeChange = 0;
            let inactiveChange = 0;

            if (oldDept.status === 'active' && data.status !== 'active') {
              activeChange = -1;
              inactiveChange = 1;
            } else if (oldDept.status !== 'active' && data.status === 'active') {
              activeChange = 1;
              inactiveChange = -1;
            }

            return {
              ...prev,
              activeDepartments: prev.activeDepartments + activeChange,
              inactiveDepartments: prev.inactiveDepartments + inactiveChange,
            };
          });
        }

        return updatedDepartment;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update department');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [departments],
  );

  const removeDepartment = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);
        await deleteDepartment(id);

        const deptToDelete = departments.find(d => d.id === id);

        setDepartments(prev => prev.filter(dept => dept.id !== id));

        // Update stats
        if (deptToDelete) {
          setStats(prev => ({
            ...prev,
            totalDepartments: prev.totalDepartments - 1,
            activeDepartments:
              deptToDelete.status === 'active'
                ? prev.activeDepartments - 1
                : prev.activeDepartments,
            inactiveDepartments:
              deptToDelete.status === 'inactive'
                ? prev.inactiveDepartments - 1
                : prev.inactiveDepartments,
          }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete department');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [departments],
  );

  const refreshDepartments = useCallback(async () => {
    await fetchDepartments();
  }, [fetchDepartments]);

  // Load initial data
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
    refreshDepartments,
  };
}
