'use client';
import { Card, CardBody } from '@heroui/react';
import { Folder } from 'lucide-react';
import React from 'react';

export default function MyProjects({ projects }: { projects: any[] }) {
  const shouldScroll = projects?.length > 5;

  return (
    <Card
      className="relative bg-gradient-to-br from-purple-50/60 via-white to-white
                     border border-purple-100/70 rounded-xl shadow-sm 
                     hover:shadow-lg hover:scale-[1.01] transition-all duration-300"
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-400 to-indigo-400 rounded-t-xl opacity-80" />

      <CardBody className="p-7 space-y-4 relative">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
          <Folder className="text-purple-600 h-5 w-5" /> My Projects
        </h3>

        {projects?.length ? (
          <div
            className={`space-y-3 ${
              shouldScroll
                ? 'max-h-80 overflow-y-auto pr-2 scrollbar-white'
                : ''
            }`}
          >
            {projects.map(p => (
              <div
                key={p.id}
                className={`p-4 rounded-xl border transition-all duration-200 
                            hover:shadow-sm hover:scale-[1.01] ${
                              p.status === 'completed'
                                ? 'bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100'
                                : p.status === 'in_progress'
                                ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-100'
                                : 'bg-violet-50/5 border-violet-200 hover:border-violet-200 hover:bg-violet-100'
                            }`}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-slate-800">{p.name}</p>
                  {p.status && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        p.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : p.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {p.status.replace('_', ' ')}
                    </span>
                  )}
                </div>
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
