'use client';

import { Card, CardBody } from '@heroui/react';
import { MessageSquareTextIcon as FeedbackIcon, InboxIcon, FilterIcon, CheckCircle2Icon } from 'lucide-react';

export default function FeedbackStats({
  stats,
}: {
  stats: { total: number; unread: number; inReview: number; resolved: number };
}) {
  const cards = [
    { title: 'Total', value: stats.total, icon: FeedbackIcon, gradient: 'from-white to-slate-50' },
    { title: 'Unread', value: stats.unread, icon: InboxIcon, gradient: 'from-amber-50 to-yellow-50' },
    { title: 'In Review', value: stats.inReview, icon: FilterIcon, gradient: 'from-blue-50 to-indigo-50' },
    { title: 'Resolved', value: stats.resolved, icon: CheckCircle2Icon, gradient: 'from-emerald-50 to-green-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((s, i) => (
        <Card
          key={i}
          className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50 overflow-hidden group"
        >
          <CardBody className="p-6 relative">
            <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-default-500 mb-1">{s.title}</p>
                <p className="text-3xl font-bold text-default-900">{s.value}</p>
                <p className="text-xs text-default-400 mt-1">{s.title === 'Total' ? 'All feedback items' : s.title}</p>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all">
                <s.icon className="w-6 h-6" />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}