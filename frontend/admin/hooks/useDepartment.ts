import { useState, useEffect, useCallback, useRef } from 'react';
import { addToast } from '@heroui/react';

import type { Department, DepartmentMember } from '@/types/department';
import { apiRequest } from '@/utils/api';
import { PERFORMANCE_CONFIG, shouldThrottleRequest } from '@/config/performance';

export interface UseDepartmentReturn {
  departments: Department[];
  loading: boolean;
  error: string | null;
  fetchDepartments: () => Promise<void>;
  createDepartment: (departmentData: { name: string; description: string; active: boolean; memberIds?: number[] }) => Promise<Department | void>;
  updateDepartment: (id: number, departmentData: { name: string; description: string; active: boolean }) => Promise<Department | void>;
  deleteDepartment: (id: number) => Promise<void>;
  getDepartmentMembers: (departmentId: number) => Promise<DepartmentMember[]>;
  clearError: () => void;
}

export function useDepartment(): UseDepartmentReturn {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);

  /**
   * Fetch all departments from the API
   * @returns Promise<void>
   */
  const fetchDepartments = useCallback(async (): Promise<void> => {
    if (shouldThrottleRequest(lastFetchRef.current, PERFORMANCE_CONFIG.API_THROTTLE.DASHBOARD)) {
      return;
    }
    lastFetchRef.current = Date.now();
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ content: Department[] }>('/api/departments?limit=0', 'GET');

      if (res.data?.content) {
        const depts = Array.isArray(res.data.content) ? res.data.content : [];
        setDepartments(depts);
      } else {
        setDepartments([]);
      }
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch departments.'
        : 'Failed to fetch departments.';

      setError(errorMessage);
      addToast({
        title: 'Failed to fetch departments. Please try again.',
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a new department
   * @param departmentData - Department data containing department information
   * @returns Promise<void>
   */
  const createDepartment = async (departmentData: { name: string; description: string; active: boolean; memberIds?: number[] }): Promise<Department | void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Department>('/api/departments', 'POST', departmentData);

      if (res.data) {
        addToast({
          title: 'Department created successfully!',
          color: 'success',
        });
        
        // Refresh departments list immediately
        await fetchDepartments();
        return res.data;
      }
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to create department.'
        : 'Failed to create department.';

      setError(errorMessage);
      addToast({
        title: 'Failed to create department. Please try again.',
        color: 'danger',
      });
      throw err; // Re-throw to let component handle it
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing department
   * @param id - Department ID
   * @param departmentData - Department data containing updated department information
   * @returns Promise<void>
   */
  const updateDepartment = async (id: number, departmentData: { name: string; description: string; active: boolean }): Promise<Department | void> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Department>(`/api/departments/${id}`, 'PUT', departmentData);

      if (res.data) {
        addToast({
          title: 'Department updated successfully!',
          color: 'success',
        });
        
        // Refresh departments list immediately
        await fetchDepartments();
        return res.data;
      }
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to update department.'
        : 'Failed to update department.';

      setError(errorMessage);
      addToast({
        title: 'Failed to update department. Please try again.',
        color: 'danger',
      });
      throw err; // Re-throw to let component handle it
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a department
   * @param id - Department ID
   * @returns Promise<void>
   */
  const deleteDepartment = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/api/departments/${id}`, 'DELETE');

      addToast({
        title: 'Department deleted successfully!',
        color: 'success',
      });

      // Refresh departments list immediately
      await fetchDepartments();
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to delete department.'
        : 'Failed to delete department.';

      setError(errorMessage);
      addToast({
        title: 'Failed to delete department. Please try again.',
        color: 'danger',
      });
      throw err; // Re-throw to let component handle it
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get department members from API
   * @param departmentId - Department ID
   * @returns Promise<DepartmentMember[]>
   */
  const getDepartmentMembers = async (departmentId: number): Promise<DepartmentMember[]> => {
    try {
      // Call real API endpoint to get department members
      const res = await apiRequest<{ content: DepartmentMember[] }>(`/api/departments/${departmentId}/members`, 'GET');
      
      if (res.data?.content) {
        return Array.isArray(res.data.content) ? res.data.content : [];
      }
      
      return [];
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch department members.'
        : 'Failed to fetch department members.';

      setError(errorMessage);
      addToast({
        title: 'Failed to fetch department members. Please try again.',
        color: 'danger',
      });
      throw err;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    loading,
    error,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentMembers,
    clearError,
  };
}
