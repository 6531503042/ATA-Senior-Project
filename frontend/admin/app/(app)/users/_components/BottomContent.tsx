import { Pagination } from '@heroui/react';

export type BottomContentProps = {
  page: number;
  pages: number;
  setPage: (page: number) => void;
  totalUsers: number;
  currentPage: number;
};

export default function BottomContent({
  page,
  pages,
  setPage,
  totalUsers,
  currentPage,
}: BottomContentProps) {
  return (
    <div className="py-3 px-4 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center border-t border-default-200 bg-white">
      <div className="text-sm text-default-500">
        Showing {(currentPage - 1) * 10 + 1} to{' '}
        {Math.min(currentPage * 10, totalUsers)} of {totalUsers} users
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
