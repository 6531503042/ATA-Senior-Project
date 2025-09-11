'use client';

import { Pagination } from '@heroui/react';
import { memo, useMemo } from 'react';

type Props = {
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (p: number) => void;
};

function BottomContent({
  page,
  rowsPerPage,
  total,
  onPageChange,
}: Props) {
  const pages = useMemo(() => Math.max(1, Math.ceil(total / rowsPerPage)), [total, rowsPerPage]);

  return (
    <div className="flex w-full items-center justify-center py-3">
      <Pagination
        isCompact
        showShadow
        page={page}
        total={pages}
        onChange={onPageChange}
      />
    </div>
  );
}

export default memo(BottomContent);
