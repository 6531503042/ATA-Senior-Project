import { useState, useEffect } from 'react';
import { apiRequest } from '@/utils/api';
import { addToast } from '@heroui/react';

export type Role = {
  id: string;
  name: string;
  description?: string;
};

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from backend first
      const res = await apiRequest<Role[]>('/api/roles', 'GET');
      
      if (res.data && Array.isArray(res.data)) {
        setRoles(res.data);
      } else {
                     // Fallback to default roles if backend doesn't have roles endpoint
             setRoles([
               { id: 'ADMIN', name: 'Admin', description: 'Administrator role' },
               { id: 'USER', name: 'User', description: 'Regular user role' },
               { id: 'SUPER_ADMIN', name: 'Super Admin', description: 'Super administrator role' },
             ]);
      }
    } catch (err: any) {
      console.warn('Failed to fetch roles from backend, using default roles:', err.message);
      
             // Fallback to default roles
       setRoles([
         { id: 'ADMIN', name: 'Admin', description: 'Administrator role' },
         { id: 'USER', name: 'User', description: 'Regular user role' },
         { id: 'SUPER_ADMIN', name: 'Super Admin', description: 'Super administrator role' },
       ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
  };
};
