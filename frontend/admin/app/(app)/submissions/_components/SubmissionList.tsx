'use client';

import type { SubmitDto } from '@/types/submission';

import { Card, CardHeader, CardBody, Chip, Input, Avatar, Badge } from '@heroui/react';
import { SearchIcon, FileText, User, Calendar, Filter } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';
import type React from 'react';

type Props = {
  items: SubmitDto[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
};

function SubmissionList({ items, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('');
  
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i =>
      String(i.id).includes(q) ||
      (i.submittedBy ? String(i.submittedBy).toLowerCase().includes(q) : false),
    );
  }, [items, query]);

  const handleEnter = useCallback((e: React.KeyboardEvent<HTMLDivElement>, id: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(String(id));
    }
  }, [onSelect]);

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case 'PUBLIC': return 'success';
      case 'PRIVATE': return 'warning';
      case 'ANONYMOUS': return 'secondary';
      case 'CONFIDENTIAL': return 'danger';
      default: return 'default';
    }
  };

  const getPrivacyIcon = (level: string) => {
    switch (level) {
      case 'PUBLIC': return '🌐';
      case 'PRIVATE': return '🔒';
      case 'ANONYMOUS': return '👤';
      case 'CONFIDENTIAL': return '🛡️';
      default: return '📄';
    }
  };

  return (
    <Card className="sticky top-6 border-0 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-800 dark:to-indigo-900/20 shadow-xl overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/20">
        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-lg">
                <FileText className="w-4 h-4 text-primary-700 dark:text-primary-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-default-900 dark:text-white">Submissions</h3>
                <p className="text-xs text-default-600 dark:text-gray-400">Select to view details</p>
              </div>
            </div>
            <Badge content={items.length} color="primary" size="sm">
              <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-full">
                <Filter className="w-3 h-3 text-primary-600 dark:text-primary-400" />
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardBody className="gap-4 p-4">
        {/* Enhanced Search */}
        <Input
          placeholder="Search by ID or submitter..."
          startContent={<SearchIcon className="w-4 h-4 text-default-400 dark:text-gray-500" />}
          value={query}
          variant="bordered"
          onValueChange={setQuery}
          classNames={{
            input: "text-sm",
            inputWrapper: "h-10 bg-white dark:bg-gray-800 border-2 border-default-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-500 focus-within:border-primary-500 dark:focus-within:border-primary-400 transition-colors duration-200",
          }}
        />

        {/* Submissions List */}
        <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-default-300 scrollbar-track-transparent">
          {filtered.map(submission => (
            <div
              key={submission.id}
              className={`cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 transform hover:scale-[1.02] ${
                selectedId === String(submission.id)
                  ? 'border-primary-300 dark:border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100/70 dark:from-primary-900/20 dark:to-primary-800/20 shadow-lg ring-2 ring-primary-200 dark:ring-primary-800'
                  : 'border-default-200 dark:border-gray-600 hover:border-default-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:bg-gradient-to-br hover:from-default-50 hover:to-default-100/50 dark:hover:from-gray-700 dark:hover:to-gray-600/50 hover:shadow-md'
              }`}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(String(submission.id))}
              onKeyDown={e => handleEnter(e, submission.id)}
              aria-selected={selectedId === String(submission.id)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar 
                    size="sm" 
                    name={submission.submittedBy ? `User ${submission.submittedBy}` : 'Anonymous'}
                    className="bg-gradient-to-br from-primary-400 to-primary-600 text-white flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-default-900 dark:text-white truncate">
                      Submission #{submission.id}
                    </h4>
                    <p className="text-xs text-default-500 dark:text-gray-400 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {submission.submittedBy ? `User #${submission.submittedBy}` : 'Anonymous'}
                    </p>
                  </div>
                </div>

                {/* Privacy Badge */}
                <div className="flex items-center gap-1">
                  <span className="text-sm">{getPrivacyIcon(submission.privacyLevel)}</span>
                  <Chip
                    color={getPrivacyColor(submission.privacyLevel)}
                    size="sm"
                    variant="flat"
                    className="text-xs font-medium"
                  >
                    {submission.privacyLevel}
                  </Chip>
                </div>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-2 text-xs text-default-500 dark:text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{new Date(submission.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
                
                {/* Status Indicator */}
                <div className="ml-auto flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    (submission as any).status === 'analyzed' ? 'bg-green-400' :
                    (submission as any).status === 'pending' ? 'bg-yellow-400' :
                    'bg-gray-400'
                  }`} />
                  <span className="text-xs font-medium">
                    {(submission as any).status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Comments Preview */}
              {submission.overallComments && (
                <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-800 dark:text-blue-200 line-clamp-2 leading-relaxed">
                    "{submission.overallComments}"
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-default-100 to-default-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <SearchIcon className="w-6 h-6 text-default-400 dark:text-gray-500" />
              </div>
              <h4 className="text-sm font-semibold text-default-600 dark:text-gray-400 mb-1">No submissions found</h4>
              <p className="text-xs text-default-500 dark:text-gray-500">
                {query ? 'Try adjusting your search terms' : 'No submissions available for this feedback'}
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {filtered.length > 0 && (
          <div className="pt-3 border-t border-default-200 dark:border-gray-700">
            <p className="text-xs text-default-500 dark:text-gray-400 text-center">
              Showing {filtered.length} of {items.length} submissions
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default memo(SubmissionList);
