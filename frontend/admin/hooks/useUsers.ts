import { useState, useCallback, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser, getUserStats } from "@/services/userService";
import type { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest, 
  UserStats,
  UserRole,
  UserStatus 
} from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalRoles: 0
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
        activeUsers: prev.activeUsers + 1
      }));
      
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editUser = useCallback(async (data: UpdateUserRequest) => {
    try {
      setLoading(true);
      setError(null);
      const updatedUser = await updateUser(data);
      setUsers(prev => 
        prev.map(user => 
          user.id === data.id ? updatedUser : user
        )
      );
      
      // Update stats if status changed
      if (data.status) {
        setStats(prev => {
          const oldUser = users.find(u => u.id === data.id);
          if (!oldUser) return prev;
          
          let activeChange = 0;
          if (oldUser.status === 'active' && data.status !== 'active') {
            activeChange = -1;
          } else if (oldUser.status !== 'active' && data.status === 'active') {
            activeChange = 1;
          }
          
          return {
            ...prev,
            activeUsers: prev.activeUsers + activeChange
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
  }, [users]);

  const removeUser = useCallback(async (userId: string) => {
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
          activeUsers: userToDelete.status === 'active' ? prev.activeUsers - 1 : prev.activeUsers
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [users]);

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
    refreshUsers
  };
}
