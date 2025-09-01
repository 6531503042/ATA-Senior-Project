import { useState, useEffect } from 'react';
import { addToast } from '@heroui/react';

import { User } from '@/types/user';
import { apiRequest } from '@/utils/api';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ content: User[] }>('/api/users?limit=0', 'GET');

      if (res.data?.content) {
        setUsers(Array.isArray(res.data.content) ? res.data.content : []);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch users.';
      setError(errorMessage);
      addToast({
        title: 'Failed to fetch users. Please try again.',
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user by username
  const fetchByUsername = async (username: string) => {
    console.log('fetchByUsername called with:', username);
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ content: User[] }>(`/api/users?username=${username}`, 'GET');

      console.log('fetchByUsername response:', res);
      const users = Array.isArray(res.data?.content) ? res.data.content : [];
      console.log('Found users:', users.length, 'users:', users);
      
      setUsers(users);
      return users;
    } catch (err: any) {
      console.error('Error fetching users by username:', err);
      const errorMessage = err.message || 'Failed to fetch users.';
      setError(errorMessage);
      addToast({
        title: 'Failed to fetch users. Please try again.',
        color: 'danger',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const createUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      const res = await apiRequest<User>('/api/users', 'POST', userData);

      if (res.data) {
        await new Promise((resolve) => {
          setUsers((prev) => {
            const updated = [...prev, res.data as User];
            resolve(updated);
            return updated;
          });
          addToast({
            title: 'User created successfully',
            description: 'User created successfully',
            color: 'success',
          });
        });
      }

      return res;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create user.';
      setError(errorMessage);
      addToast({
        title: 'Failed to create user. Please try again.',
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update existing user
  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      setLoading(true);
      const res = await apiRequest<User>(`/api/users/${id}`, 'PUT', userData);

      if (res.data) {
        setUsers((prev) => prev.map((user) => (user.id === id ? res.data! : user)));
        addToast({
          title: 'User updated successfully',
          description: 'User updated successfully',
          color: 'success',
        });
      }

      return res;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update user.';
      setError(errorMessage);
      addToast({
        title: 'Failed to update user. Please try again.',
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (id: number) => {
    try {
      setLoading(true);
      await apiRequest(`/api/users/${id}`, 'DELETE');

      setUsers((prev) => prev.filter((user) => user.id !== id));
      addToast({
        title: 'User deleted successfully',
        description: 'User deleted successfully',
        color: 'success',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete user.';
      setError(errorMessage);
      addToast({
        title: 'Failed to delete user. Please try again.',
        color: 'danger',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user by ID
  const getUserById = async (id: number) => {
    try {
      const res = await apiRequest<User>(`/api/users/${id}`, 'GET');
      return res.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch user.';
      setError(errorMessage);
      addToast({
        title: 'Failed to fetch user. Please try again.',
        color: 'danger',
      });
      throw err;
    }
  };

  const clearError = () => setError(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    fetchByUsername,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    clearError,
    // Aliases for backward compatibility
    editUser: updateUser,
    addUser: createUser,
    removeUser: deleteUser,
  };
}
