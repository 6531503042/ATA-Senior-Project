export interface PageInfo {
  page: number;
  limit: number;
  sortBy: string;
  sortDir: string;
  search?: string;
}

export interface PageResponse<T> {
  content: T[];
  pageInfo: PageInfo;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

export interface PageRequest {
  page: number;
  limit: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  search?: string;
  cursor?: string;
}
