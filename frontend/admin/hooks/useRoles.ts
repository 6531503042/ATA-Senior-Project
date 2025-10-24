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
      
      console.log('🔍 Fetching roles from backend...');
      // Backend returns a PageResponse<RoleResponse> for GET /api/roles
      const res = await apiRequest<any>('/api/roles?limit=0', 'GET');
      console.log('📦 Roles API response:', res);

      let nextRoles: Role[] = [];
      if (res.data && Array.isArray(res.data)) {
        // Direct array response (fallback/legacy)
        console.log('📋 Direct array response detected');
        nextRoles = res.data.map((r: any) => ({
          id: String(r.id ?? r.name ?? ''),
          name: String(r.name ?? r.role ?? ''),
          description: r.description ?? undefined,
        }));
      } else if (res.data && Array.isArray(res.data.content)) {
        // PageResponse
        console.log('📄 PageResponse detected');
        nextRoles = res.data.content.map((r: any) => ({
          id: String(r.id ?? r.name ?? ''),
          name: String(r.name ?? r.role ?? ''),
          description: r.description ?? undefined,
        }));
      } else {
        console.warn('⚠️ Unexpected response format:', res.data);
        // Fallback: try to use the response directly
        if (res.data && typeof res.data === 'object') {
          nextRoles = Object.values(res.data).map((r: any) => ({
            id: String(r.id ?? r.name ?? ''),
            name: String(r.name ?? r.role ?? ''),
            description: r.description ?? undefined,
          }));
        }
      }

      console.log('✅ Processed roles:', nextRoles);
      setRoles(nextRoles);
    } catch (err: any) {
      console.error('❌ Failed to fetch roles from backend:', err.message);
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
