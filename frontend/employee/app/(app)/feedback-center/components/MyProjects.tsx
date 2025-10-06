'use client';
import { Card, CardBody } from '@heroui/react';
import React from 'react';

export default function MyProjects({ projects }: { projects: any[] }) {
  return (
    <Card className="bg-white dark:bg-slate-900 shadow">
      <CardBody className="p-6 space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">My Projects</h3>
        {projects?.length ? projects.map(p => (
          <div key={p.id} className="p-3 border rounded bg-gray-50 dark:bg-slate-800">
            <p className="font-medium text-slate-800 dark:text-slate-200">{p.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{p.description}</p>
          </div>
        )) : <p className="text-gray-600 dark:text-gray-400">No projects assigned</p>}
      </CardBody>
    </Card>
  );
}
