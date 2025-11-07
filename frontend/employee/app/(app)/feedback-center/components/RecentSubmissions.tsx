'use client';
import { Card, CardBody } from '@heroui/react';
import { History } from 'lucide-react';
import React from 'react';

export default function RecentSubmissions({ submissions }: { submissions: any[] }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg 
                     shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-200">
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold flex flex-row gap-2 items-center"><History className='text-red-600 h-5 w-5'/>Recent Submissions</h3>
        {submissions?.length ? (
          submissions.map(s => (
            <div key={s.id} className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-100">
              <p className="font-medium text-slate-800">{s.feedbackTitle}</p>
              <p className="text-xs text-slate-500">{s.projectName}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 italic">No submissions yet</p>
        )}
      </CardBody>
    </Card>
  );
}
