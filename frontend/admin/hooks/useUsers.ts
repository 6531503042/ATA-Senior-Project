import { useState, useEffect } from 'react';
import { addToast } from '@heroui/react';

import { User, UserStats } from '@/types/user';
import { PageResponse } from '@/types/shared';
import { apiRequest } from '@/utils/api';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalRoles: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<PageResponse<User>>('/api/users?limit=0', 'GET');

      if (res.data?.content) {
        setUsers(Array.isArray(res.data.content) ? res.data.content : []);
      } else {
        setUsers([]);
      }
    } catch (err) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? (err as { message?: string }).message || 'Failed to fetch users.'
        : 'Failed to fetch users.';

      setError(errorMessage);
      addToast({
        title: 'Failed to fetch users',
        description: errorMessage,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const res = await apiRequest<UserStats>('/api/users/stats', 'GET');
      if (res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      const res = await apiRequest<User>('/api/users', 'POST', userData);

      if (res.data) {
        setUsers((prev) => [...prev, res.data!]);
        addToast({
          title: 'User created successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create user.';

      setError(errorMessage);
      addToast({
        title: 'Failed to create user',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      setLoading(true);
      const res = await apiRequest<User>(`/api/users/${id}`, 'PUT', userData);

      if (res.data) {
        setUsers((prev) => prev.map((user) => (user.id === id ? res.data! : user)));
        addToast({
          title: 'User updated successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update user.';

      setError(errorMessage);
      addToast({
        title: 'Failed to update user',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      setLoading(true);
      await apiRequest(`/api/users/${id}`, 'DELETE');

      setUsers((prev) => prev.filter((user) => user.id !== id));
      addToast({
        title: 'User deleted successfully!',
        color: 'success',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete user.';

      setError(errorMessage);
      addToast({
        title: 'Failed to delete user',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const activateUser = async (id: number) => {
    try {
      setLoading(true);
      const res = await apiRequest<User>(`/api/users/${id}/activate`, 'PUT');

      if (res.data) {
        setUsers((prev) => prev.map((user) => (user.id === id ? res.data! : user)));
        addToast({
          title: 'User activated successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to activate user.';

      setError(errorMessage);
      addToast({
        title: 'Failed to activate user',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deactivateUser = async (id: number) => {
    try {
      setLoading(true);
      const res = await apiRequest<User>(`/api/users/${id}/deactivate`, 'PUT');

      if (res.data) {
        setUsers((prev) => prev.map((user) => (user.id === id ? res.data! : user)));
        addToast({
          title: 'User deactivated successfully!',
          color: 'success',
        });
        return res.data;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to deactivate user.';

      setError(errorMessage);
      addToast({
        title: 'Failed to deactivate user',
        description: errorMessage,
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, []);

  return {
    users,
    stats,
    loading,
    error,
    fetchUsers,
    fetchUserStats,
    createUser,
    updateUser,
    deleteUser,
    activateUser,
    deactivateUser,
    clearError,
  };
}
