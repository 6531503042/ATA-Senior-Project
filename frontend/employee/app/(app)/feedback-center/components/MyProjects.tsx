'use client';
import { Card, CardBody } from '@heroui/react';
import { Folder } from 'lucide-react';
import React from 'react';

export default function MyProjects({ projects }: { projects: any[] }) {
  const shouldScroll = projects?.length > 5;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-lg 
                     shadow-[0_4px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] 
                     transition-all duration-200">
      <CardBody className="p-7 space-y-4">
        <h3 className="text-lg font-semibold flex flex-row gap-2 items-center">
          <Folder className="text-indigo-600 h-5 w-5" /> My Projects
        </h3>

        {projects?.length ? (
          <div
            className={`space-y-3 ${
              shouldScroll
                ? 'max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400'
                : ''
            }`}
          >
            {projects.map(p => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100 transition"
              >
                <p className="font-medium text-slate-800">{p.name}</p>
                <p className="text-sm text-slate-500">{p.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 italic">No projects assigned</p>
        )}
      </CardBody>
    </Card>
  );
}
