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
      
      // Backend returns a PageResponse<RoleResponse> for GET /api/roles
      const res = await apiRequest<any>('/api/roles?limit=0', 'GET');

      let nextRoles: Role[] = [];
      if (res.data && Array.isArray(res.data)) {
        // Direct array response (fallback/legacy)
        nextRoles = res.data as Role[];
      } else if (res.data && Array.isArray(res.data.content)) {
        // PageResponse
        nextRoles = res.data.content.map((r: any) => ({
          id: String(r.id ?? r.name ?? ''),
          name: String(r.name ?? r.role ?? ''),
          description: r.description ?? undefined,
        }));
      }

      setRoles(nextRoles);
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
