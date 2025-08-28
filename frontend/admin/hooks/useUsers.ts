import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserStats,
} from '@/types/user';

import { useState, useCallback, useEffect } from 'react';

import { api } from '@/libs/apiClient';

const base = '/api/users';

// API functions
async function getUsers(): Promise<{ users: User[]; stats: UserStats }> {
  try {
    const [usersResponse, statsResponse] = await Promise.all([
      api.get<User[]>('/api/users'),
      api.get<UserStats>('/api/users/stats'),
    ]);

    // Ensure usersResponse is an array
    const users = Array.isArray(usersResponse) ? usersResponse : [];

    return {
      users: users.map(mapUser),
      stats: statsResponse,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function createUser(data: CreateUserRequest): Promise<User> {
  try {
    const response = await api.post<User>('/api/users', data);

    return mapUser(response);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function updateUser(data: UpdateUserRequest): Promise<User> {
  try {
    const response = await api.put<User>(`/api/users/${data.id}`, data);

    return mapUser(response);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

async function deleteUser(userId: number): Promise<void> {
  try {
    await api.delete(`/api/users/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

function mapUser(api: any): User {
  return {
    id: Number(api.id ?? api.userId ?? 0),
    username: String(api.username ?? ''),
    email: String(api.email ?? ''),
    firstName: String(api.firstName ?? api.fullname ?? ''),
    lastName: String(api.lastName ?? ''),
    phone: api.phone ?? '',
    departments: api.departments ?? [],
    roles: api.roles ?? [],
    active: Boolean(api.active ?? api.status === 'active'),
    lastLoginAt: api.lastLoginAt ?? api.lastLogin,
    createdAt: api.createdAt ?? new Date().toISOString(),
    updatedAt: api.updatedAt ?? new Date().toISOString(),
    role: api.role ?? 'user',
    status: api.status ?? (api.active ? 'active' : 'inactive'),
    department: api.department ?? '',
    position: api.position ?? '',
  };
}

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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUsers();

      setUsers(response.users);
      setStats(response.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      // Set fallback data when API fails
      setUsers([]);
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        totalRoles: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const addUser = useCallback(async (data: CreateUserRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newUser = await createUser(data);

      setUsers(prev => [newUser, ...prev]);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + 1,
        activeUsers: prev.activeUsers + 1,
      }));

      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editUser = useCallback(
    async (data: UpdateUserRequest) => {
      try {
        setLoading(true);
        setError(null);
        const updatedUser = await updateUser(data);

        setUsers(prev =>
          prev.map(user => (user.id === data.id ? updatedUser : user)),
        );

        // Update stats if status changed
        if (data.status) {
          setStats(prev => {
            const oldUser = users.find(u => u.id === data.id);

            if (!oldUser) return prev;

            let activeChange = 0;

            if (oldUser.status === 'active' && data.status !== 'active') {
              activeChange = -1;
            } else if (
              oldUser.status !== 'active' &&
              data.status === 'active'
            ) {
              activeChange = 1;
            }

            return {
              ...prev,
              activeUsers: prev.activeUsers + activeChange,
            };
          });
        }

        return updatedUser;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update user');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [users],
  );

  const removeUser = useCallback(
    async (userId: number) => {
      try {
        setLoading(true);
        setError(null);
        await deleteUser(userId);

        const userToDelete = users.find(u => u.id === userId);

        setUsers(prev => prev.filter(user => user.id !== userId));

        // Update stats
        if (userToDelete) {
          setStats(prev => ({
            ...prev,
            totalUsers: prev.totalUsers - 1,
            activeUsers:
              userToDelete.status === 'active'
                ? prev.activeUsers - 1
                : prev.activeUsers,
          }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete user');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [users],
  );

  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Load initial data
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    stats,
    loading,
    error,
    addUser,
    editUser,
    removeUser,
    refreshUsers,
  };
}
