'use client';
import { Card, CardBody } from '@heroui/react';
import React from 'react';

export default function RecentSubmissions({ submissions }: { submissions: any[] }) {
  return (
    <Card className="bg-white  shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 ">Recent Submissions</h3>
        {submissions?.length ? submissions.map(s => (
          <div key={s.id} className="p-3 bg-gray-50  rounded">
            <p className="font-medium text-gray-800 ">{s.feedbackTitle}</p>
            <p className="text-xs text-gray-500 ">{s.projectName}</p>
          </div>
        )) : <p className="text-gray-600 ">No submissions yet</p>}
      </CardBody>
    </Card>
  );
}
