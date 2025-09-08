'use client';

import type { SubmitDto } from '@/types/submission';

import { Card, CardBody, Chip, Input } from '@heroui/react';
import { SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

type Props = {
  items: SubmitDto[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
};

export default function SubmissionList({ items, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i =>
      String(i.id).includes(q) ||
      (i.submittedBy ? String(i.submittedBy).toLowerCase().includes(q) : false),
    );
  }, [items, query]);

  return (
    <Card
      className="sticky top-6 border-0 bg-white/90 dark:bg-default-50/90 backdrop-blur rounded-2xl shadow-xl"
      shadow="sm"
   >
      <CardBody className="gap-4 p-5">
        <Input
          placeholder="Search submissions..."
          startContent={<SearchIcon className="w-4 h-4 text-default-400" />}
          value={query}
          variant="bordered"
          onValueChange={setQuery}
        />
        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filtered.map(i => (
            <div
              key={i.id}
              className={`cursor-pointer rounded-xl border px-3 py-3 transition-all duration-200 ${
                selectedId === String(i.id)
                  ? 'border-primary/30 bg-primary-50 shadow-sm'
                  : 'border-default-200 hover:bg-default-100/80 hover:shadow'
              }`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(String(i.id))}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(String(i.id));
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold tracking-tight text-default-900">Submission #{i.id}</div>
                <Chip
                  color={i.privacyLevel === 'PUBLIC' ? 'success' : 'warning'}
                  size="sm"
                  variant="flat"
                >
                  {i.privacyLevel}
                </Chip>
              </div>
              <div className="mt-1 text-xs text-default-500">{new Date(i.submittedAt).toLocaleString()}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-default-500 text-sm py-6">
              No submissions found
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
