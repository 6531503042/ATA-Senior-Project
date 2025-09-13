'use client';

import { Spinner } from '@heroui/react';

export default function Loading() {
  return (
    <div className="grid h-dvh place-items-center">
      <Spinner size="lg" label="Loading…" />
    </div>
  );
}
