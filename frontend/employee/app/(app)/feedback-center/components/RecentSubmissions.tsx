'use client';
import { Card, CardBody } from '@heroui/react';
import React from 'react';

export default function RecentSubmissions({ submissions }: { submissions: any[] }) {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Submissions</h3>
        {submissions?.length ? submissions.map(s => (
          <div key={s.id} className="p-3 bg-gray-50 dark:bg-slate-800 rounded">
            <p className="font-medium text-slate-800 dark:text-slate-200">{s.feedbackTitle}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.projectName}</p>
          </div>
        )) : <p className="text-gray-600 dark:text-gray-400">No submissions yet</p>}
      </CardBody>
    </Card>
  );
}
