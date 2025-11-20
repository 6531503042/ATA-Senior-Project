'use client';
import { Card, CardBody, Button } from '@heroui/react';
import { History, Clock, Calendar, Edit } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function RecentSubmissions({ submissions }: { submissions: any[] }) {
  const router = useRouter();
  
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };
  
  const canEdit = (endDate: string | null | undefined) => {
    if (!endDate) return true; // If no deadline, allow edit
    try {
      const deadline = new Date(endDate);
      return new Date() < deadline;
    } catch {
      return false;
    }
  };

  return (
    <Card className="relative bg-gradient-to-br from-indigo-50/60 via-white to-white 
                     border border-indigo-100/70 rounded-xl shadow-sm hover:shadow-lg 
                     hover:scale-[1.01] transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-400 to-purple-400 rounded-t-xl opacity-80" />
      
      <CardBody className="p-7 space-y-4 relative">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
          <History className="text-indigo-500 h-5 w-5" /> Recent Submissions
        </h3>

        {submissions?.length ? (
          <div className="space-y-3">
            {submissions.map(s => {
              const editable = canEdit(s.feedbackEndDate);
              return (
                <div
                  key={s.id}
                  className="p-4 rounded-xl border border-slate-100 bg-white/80
                             hover:bg-indigo-50 hover:border-indigo-200
                             hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">
                        {s.feedbackTitle || 'Untitled Feedback'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {s.projectName || '—'}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(s.submittedAt)}
                        </span>
                        {s.feedbackEndDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Deadline: {formatDate(s.feedbackEndDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    {editable && s.feedbackId && (
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        isIconOnly
                        onPress={() => router.push(`/feedback/${s.feedbackId}`)}
                        className="flex-shrink-0"
                        title="Edit submission"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 italic">No submissions yet</p>
        )}
      </CardBody>
    </Card>
  );
}
