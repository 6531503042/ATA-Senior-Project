import { Button, Pagination } from '@heroui/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface BottomContentProps {
  currentPage: number;
  page: number;
  pages: number;
  setPage: (page: number) => void;
  totalQuestions: number;
}

export default function BottomContent({
  currentPage,
  page,
  pages,
  setPage,
  totalQuestions,
}: BottomContentProps) {
  const onNextPage = () => {
    if (page < pages) {
      setPage(page + 1);
    }
  };

  const onPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const onPageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="py-4 px-2 flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Page Info */}
      <div className="flex items-center gap-2 text-sm text-default-500">
        <span>Page {page} of {pages}</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">Total: {totalQuestions} questions</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <Button
          isDisabled={page === 1}
          size="sm"
          variant="flat"
          onPress={onPreviousPage}
          startContent={<ChevronLeftIcon className="w-4 h-4" />}
          className="bg-default-100 hover:bg-default-200 text-default-700"
        >
          Previous
        </Button>

        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={onPageChange}
          classNames={{
            wrapper: "gap-1",
            item: "w-8 h-8 text-sm",
            cursor: "bg-primary-500 text-white font-medium",
          }}
        />

        <Button
          isDisabled={page === pages}
          size="sm"
          variant="flat"
          onPress={onNextPage}
          endContent={<ChevronRightIcon className="w-4 h-4" />}
          className="bg-default-100 hover:bg-default-200 text-default-700"
        >
          Next
        </Button>
      </div>

      {/* Quick Navigation */}
      <div className="flex items-center gap-2 text-xs text-default-400">
        <span>Go to:</span>
        <div className="flex gap-1">
          {[1, Math.ceil(pages / 2), pages].filter(p => p > 0 && p <= pages).map((pageNum) => (
            <Button
              key={pageNum}
              size="sm"
              variant="light"
              onPress={() => setPage(pageNum)}
              className={`min-w-[32px] h-8 text-xs ${
                pageNum === page 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-default-500 hover:text-default-700'
              }`}
            >
              {pageNum}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
