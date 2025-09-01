import { useState, useEffect } from 'react';
import { addToast } from '@heroui/react';

import { Department } from '@/types/department';
import { PageResponse } from '@/types/shared';
import { apiRequest } from '@/utils/api';

export function useDepartment() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<PageResponse<Department>>('/api/departments?limit=0', 'GET');

      if (res.data?.content) {
        setDepartments(Array.isArray(res.data.content) ? res.data.content : []);
      } else {
        setDepartments([]);
      }
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch departments.'
        : 'Failed to fetch departments.';

      setError(errorMessage);
      addToast({
        title: 'Failed to fetch departments',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const createDepartment = async (departmentData: Partial<Department>) => {
    try {
      setLoading(true);
      const res = await apiRequest<Department>('/api/departments', 'POST', departmentData);

      if (res.data) {
        setDepartments((prev) => [...prev, res.data!]);
        addToast({
          title: 'Department created successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create department.';

      setError(errorMessage);
      addToast({
        title: 'Failed to create department',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDepartment = async (id: number, departmentData: Partial<Department>) => {
    try {
      setLoading(true);
      const res = await apiRequest<Department>(`/api/departments/${id}`, 'PUT', departmentData);

      if (res.data) {
        setDepartments((prev) => prev.map((department) => (department.id === id ? res.data! : department)));
        addToast({
          title: 'Department updated successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update department.';

      setError(errorMessage);
      addToast({
        title: 'Failed to update department',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      setLoading(true);
      await apiRequest(`/api/departments/${id}`, 'DELETE');

      setDepartments((prev) => prev.filter((department) => department.id !== id));
      addToast({
        title: 'Department deleted successfully!',
        color: 'success',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete department.';

      setError(errorMessage);
      addToast({
        title: 'Failed to delete department',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentById = async (id: number) => {
    try {
      const res = await apiRequest<Department>(`/api/departments/${id}`, 'GET');
      return res.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch department.';
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
    clearError,
  };
}
