import { Pagination } from '@heroui/react';

export type BottomContentProps = {
  page: number;
  pages: number;
  setPage: (page: number) => void;
  totalDepartments: number;
  currentPage: number;
};

export default function BottomContent({
  page,
  pages,
  setPage,
  totalDepartments,
  currentPage,
}: BottomContentProps) {
  return (
    <div className="py-3 px-4 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center border-t border-default-200 dark:border-default-700 bg-white dark:bg-default-50">
      <div className="text-sm text-default-500 dark:text-default-400">
        Showing {(currentPage - 1) * 10 + 1} to{' '}
        {Math.min(currentPage * 10, totalDepartments)} of {totalDepartments} departments
      </div>
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages ?? 1}
        onChange={setPage}
      />
    </div>
  );
}


