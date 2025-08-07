import { Pagination } from "@heroui/react";

export type BottomContentProps = {
  page: number;
  pages: number;
  setPage: (page: number) => void;
  totalQuestions: number;
  currentPage: number;
};

export default function BottomContent({
  page,
  pages,
  setPage,
  totalQuestions,
  currentPage,
}: BottomContentProps) {
  return (
    <div className="py-4 px-6 flex justify-between items-center rounded-xl border border-blue-100 shadow-lg">
      <div className="text-sm text-default-600 font-medium bg-white px-4 py-2 rounded-lg shadow-sm">
        Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalQuestions)} of {totalQuestions} questions
      </div>
      <Pagination
        isCompact
        showControls
        showShadow
        color="primary"
        page={page}
        total={pages ?? 1}
        onChange={setPage}
        classNames={{
          wrapper: "shadow-md",
          cursor: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
        }}
      />
    </div>
  );
}
