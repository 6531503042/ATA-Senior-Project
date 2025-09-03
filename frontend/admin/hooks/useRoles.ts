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
        setRoles([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch roles from backend:', err.message);
      setError('Failed to load roles');
      setRoles([]);
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
