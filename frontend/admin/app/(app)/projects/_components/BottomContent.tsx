import { Pagination } from "@heroui/react";

export type BottomContentProps = {
  page: number;
  pages: number;
  setPage: (page: number) => void;
  totalProjects: number;
  currentPage: number;
};

export default function BottomContent({
  page,
  pages,
  setPage,
  totalProjects,
  currentPage,
}: BottomContentProps) {
  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <div className="text-sm text-default-500">
        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalProjects)} of {totalProjects} projects
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
