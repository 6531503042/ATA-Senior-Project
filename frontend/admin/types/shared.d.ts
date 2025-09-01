export type PageResponse<T> = {
  content: T[];
  pageInfo: {
    page: number;
    limit: number;
    sortBy: string;
    sortDir: string;
    search?: string;
  };
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  nextCursor?: string;
  previousCursor?: string;
};
