import type {
  Department,
  DepartmentStats,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from '@/types/department';

import { useState, useCallback, useEffect } from 'react';

import { useApi } from '@/hooks/useApi';

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

async function getDepartments(request: ReturnType<typeof useApi>['request']) {
  const res = await request<any[]>(`${base}`, 'GET');
  const list = (res.data || []).map(mapDepartment);
  const stats: DepartmentStats = {
    totalDepartments: list.length,
    activeDepartments: list.filter(d => d.status === 'active').length,
    inactiveDepartments: list.filter(d => d.status === 'inactive').length,
    totalEmployees: list.reduce(a => a + 0, 0),
  };

  return { departments: list, stats };
}

async function createDepartment(
  request: ReturnType<typeof useApi>['request'],
  data: CreateDepartmentRequest,
) {
  const payload = {
    name: data.name,
    description: data.description,
    active: data.status === 'active',
  };
  const res = await request<any>(`${base}`, 'POST', payload);

  return mapDepartment(res.data);
}

async function updateDepartment(
  request: ReturnType<typeof useApi>['request'],
  data: UpdateDepartmentRequest,
) {
  const payload: any = { name: data.name, description: data.description };

  if (typeof data.status !== 'undefined')
    payload.active = data.status === 'active';
  const res = await request<any>(`${base}/${data.id}`, 'PUT', payload);

  return mapDepartment(res.data);
}

async function deleteDepartment(
  request: ReturnType<typeof useApi>['request'],
  id: string,
) {
  await request<void>(`${base}/${id}`, 'DELETE');

  return true;
}

export function useDepartments() {
  const { request } = useApi();
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
      const response = await getDepartments(request);

      setDepartments(response.departments);
      setStats(response.stats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch departments',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const addDepartment = useCallback(async (data: CreateDepartmentRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newDept = await createDepartment(request, data);

      setDepartments(prev => [newDept, ...prev]);

      setStats(prev => ({
        ...prev,
        totalDepartments: prev.totalDepartments + 1,
        activeDepartments:
          data.status === 'active'
            ? prev.activeDepartments + 1
            : prev.activeDepartments,
        inactiveDepartments:
          data.status === 'inactive'
            ? prev.inactiveDepartments + 1
            : prev.inactiveDepartments,
        totalEmployees: prev.totalEmployees + (data.employeeCount || 0),
      }));

      return newDept;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create department',
      );
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
        const updatedDept = await updateDepartment(request, data);

        setDepartments(prev =>
          prev.map(dep => (dep.id === data.id ? updatedDept : dep)),
        );

        if (data.status) {
          setStats(prev => {
            const oldDept = departments.find(d => d.id === data.id);

            if (!oldDept) return prev;

            let activeChange = 0;
            let inactiveChange = 0;

            if (oldDept.status === 'active' && data.status !== 'active') {
              activeChange = -1;
              inactiveChange = +1;
            } else if (
              oldDept.status !== 'active' &&
              data.status === 'active'
            ) {
              activeChange = +1;
              inactiveChange = -1;
            }

            return {
              ...prev,
              activeDepartments: prev.activeDepartments + activeChange,
              inactiveDepartments: prev.inactiveDepartments + inactiveChange,
            };
          });
        }

        return updatedDept;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to update department',
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [departments],
  );

  const removeDepartment = useCallback(
    async (departmentId: string) => {
      try {
        setLoading(true);
        setError(null);
        await deleteDepartment(request, departmentId);

        const deptToDelete = departments.find(d => d.id === departmentId);

        setDepartments(prev => prev.filter(dep => dep.id !== departmentId));

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
            totalEmployees:
              prev.totalEmployees - (deptToDelete.employeeCount || 0),
          }));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to delete department',
        );
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
