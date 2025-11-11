'use client';
import { Card, CardBody } from '@heroui/react';
import { Clock, Edit3, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function PendingFeedbacks({ feedbacks }: { feedbacks: any[] }) {
  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'in_progress':
        return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
      case 'not_started':
      default:
        return 'border-red-300 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return (
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            In Progress
          </span>
        );
      default:
        return (
          <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-1 rounded-full animate-pulse">
            Action Required
          </span>
        );
    }
  };

  return (
    <Card className="relative bg-white border border-red-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
      {/* header bar */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 rounded-t-xl" />

      <CardBody className="p-7 space-y-5">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900">
          <Clock className="w-5 h-5 text-red-500" />
          Pending Feedbacks
        </h2>

        {feedbacks?.length ? (
          <div className="space-y-3">
            {feedbacks.map(f => {
              const status = f.status?.toLowerCase() ?? 'not_started';
              const isPending = status === 'not_started';
              const isInProgress = status === 'in_progress';
              const isCompleted = status === 'completed';

              return (
                <Link
                  key={f.id}
                  href={`/feedback/${f.id}`}
                  className={`relative block p-5 rounded-xl border transition-all duration-300 ${getStatusStyle(
                    status,
                  )} hover:scale-[1.01]`}
                >
                  {/* left bar highlight */}
                  <span
                    className={`
                      absolute left-0 top-0 h-full w-[6px] rounded-l-xl 
                      ${
                        isCompleted
                          ? 'bg-green-500'
                          : isInProgress
                          ? 'bg-yellow-400'
                          : 'bg-gradient-to-b from-red-500 to-orange-500'
                      }
                    `}
                  />

                  <div className="flex justify-between items-center ms-3">
                    <div className="flex items-center gap-2">
                      {isPending ? (
                        <Edit3 className="w-5 h-5 text-red-500 animate-pulse" />
                      ) : isInProgress ? (
                        <Loader2 className="w-5 h-5 text-yellow-500 animate-spin-slow" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      <p
                        className={`font-semibold ${
                          isPending
                            ? 'text-red-700'
                            : isInProgress
                            ? 'text-yellow-800'
                            : 'text-green-800'
                        }`}
                      >
                        {f.title}
                      </p>
                    </div>
                    {getStatusBadge(status)}
                  </div>

                  <p className="text-sm text-slate-600 mt-2 flex items-center gap-1 ms-3">
                    🕓 Due: {new Date(f.endDate).toLocaleDateString()}
                  </p>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 italic">No pending feedbacks 🎉</p>
        )}
      </CardBody>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1.5s infinite ease-in-out;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </Card>
  );
}
