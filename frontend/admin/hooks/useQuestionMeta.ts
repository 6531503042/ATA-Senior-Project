import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { apiRequest } from '@/utils/api';

export type QuestionTypeMeta = { key: string; label: string; color?: string };
export type QuestionCategoryMeta = { key: string; label: string };

export type QuestionMeta = {
  types: QuestionTypeMeta[];
  categories: QuestionCategoryMeta[];
};

const DEFAULT_META: QuestionMeta = {
  types: [
    { key: 'TEXT', label: 'Text', color: '#16a34a' },
    { key: 'MULTIPLE_CHOICE', label: 'Multiple Choice', color: '#6366f1' },
    { key: 'RATING', label: 'Rating', color: '#f59e0b' },
    { key: 'BOOLEAN', label: 'Boolean', color: '#a855f7' },
  ],
  categories: [
    { key: 'PROJECT_SATISFACTION', label: 'Project Satisfaction' },
    { key: 'TECHNICAL_SKILLS', label: 'Technical Skills' },
    { key: 'COMMUNICATION', label: 'Communication' },
    { key: 'LEADERSHIP', label: 'Leadership' },
    { key: 'WORK_ENVIRONMENT', label: 'Work Environment' },
    { key: 'WORK_LIFE_BALANCE', label: 'Work Life Balance' },
    { key: 'TEAM_COLLABORATION', label: 'Team Collaboration' },
    { key: 'GENERAL', label: 'General' },
  ],
};

export function useQuestionMeta() {
  const [meta, setMeta] = useState<QuestionMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFetchRef = useRef<number>(0);
  const FETCH_THROTTLE_MS = 30000; // 30 seconds throttle for metadata

  const fetchMeta = useCallback(async () => {
    // Throttle metadata fetching
    if (Date.now() - lastFetchRef.current < FETCH_THROTTLE_MS) {
      console.log('Question metadata fetch throttled');
      return;
    }
    
    lastFetchRef.current = Date.now();
    setLoading(true);
    setError(null);
    
    try {
      const [typesRes, catsRes] = await Promise.allSettled([
        apiRequest<any>('/api/questions/types', 'GET'),
        apiRequest<any>('/api/questions/categories', 'GET'),
      ]);

      const types =
        typesRes.status === 'fulfilled'
          ? normalizeTypes(typesRes.value?.data)
          : [];
      const categories =
        catsRes.status === 'fulfilled'
          ? normalizeCategories(catsRes.value?.data)
          : [];

      setMeta({
        types: types.length ? types : DEFAULT_META.types,
        categories: categories.length ? categories : DEFAULT_META.categories,
      });
    } catch (e: any) {
      const errorMessage = e?.message || 'Failed to load question metadata';
      console.warn('Using default metadata due to API error:', errorMessage);
      setError(errorMessage);
      setMeta(DEFAULT_META);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeta();
  }, []); // Remove fetchMeta dependency to prevent infinite loop

  const typeLabel = useCallback(
    (key?: string) => meta.types.find(t => t.key === key)?.label || key || 'Unknown',
    [meta.types],
  );

  const typeStyle = useCallback(
    (key?: string) => {
      const t = meta.types.find(x => x.key === key);
      if (!t) return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
      const color = t.color || '#6b7280';
      // Generate Tailwind-like classes via inline style consumer; fallback to fixed classes
      // Since we cannot compute arbitrary classes safely, map known colors to classes
      const mapping: Record<string, { bg: string; text: string; dot: string }> = {
        '#16a34a': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
        '#6366f1': { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500' },
        '#f59e0b': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
        '#a855f7': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
        '#6b7280': { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' },
      };
      return mapping[color] || mapping['#6b7280'];
    },
    [meta.types],
  );

  return { meta, loading, error, fetchMeta, typeLabel, typeStyle };
}

function normalizeTypes(raw: any): QuestionTypeMeta[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    // Could be array of strings or objects
    return raw.map((x: any) =>
      typeof x === 'string' ? { key: x, label: toTitle(x) } : { key: x.key || x.name, label: x.label || toTitle(x.key || x.name), color: x.color },
    );
  }
  if (typeof raw === 'object' && Array.isArray(raw.items)) {
    return normalizeTypes(raw.items);
  }
  return [];
}

function normalizeCategories(raw: any): QuestionCategoryMeta[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((x: any) =>
      typeof x === 'string' ? { key: x, label: toTitle(x) } : { key: x.key || x.name, label: x.label || toTitle(x.key || x.name) },
    );
  }
  if (typeof raw === 'object' && Array.isArray(raw.items)) {
    return normalizeCategories(raw.items);
  }
  return [];
}

function toTitle(s: string) {
  return (s || '')
    .replace(/[_-]/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
}
