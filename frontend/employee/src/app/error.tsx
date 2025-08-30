'use client';

import { Button } from '@heroui/react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="grid h-dvh place-items-center p-6 text-center">
      <div className="max-w-md space-y-3">
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-default-600">{error?.message || 'Unexpected error'}</p>
        <Button color="primary" onPress={reset}>Try again</Button>
      </div>
    </div>
  );
}
