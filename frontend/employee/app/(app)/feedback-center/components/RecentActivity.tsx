'use client';
import { Card, CardBody } from '@heroui/react';
import React from 'react';

export default function RecentActivity() {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Recent Activity</h3>
        <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded">
          <p className="text-sm text-slate-800 dark:text-slate-200">Logged in</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Just now</p>
        </div>
      </CardBody>
    </Card>
  );
}
