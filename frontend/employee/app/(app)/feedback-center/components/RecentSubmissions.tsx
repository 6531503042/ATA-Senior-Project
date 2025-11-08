'use client';
import { Card, CardBody } from '@heroui/react';
import { History } from 'lucide-react';
import React from 'react';

export default function RecentSubmissions({ submissions }: { submissions: any[] }) {
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
          <div className="space-y-2">
            {submissions.map(s => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-100 bg-white/80
                           hover:bg-indigo-50 hover:border-indigo-200
                           hover:shadow-sm transition-all duration-200"
              >
                <p className="font-medium text-slate-800">{s.feedbackTitle}</p>
                <p className="text-xs text-slate-500">{s.projectName}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">No submissions yet</p>
        )}
      </CardBody>
    </Card>
  );
}
