'use client';
import { Card, CardBody } from '@heroui/react';
import { Lightbulb } from 'lucide-react';
import React from 'react';

export default function TipCard() {
  const tips = [
    'Remember to complete your pending feedbacks this week!',
    'Review your recent submissions to track your improvement.',
    'Stay consistent with your feedbacks — progress matters!',
    'Check your project updates to stay ahead.',
  ];

  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <Card className="relative bg-gradient-to-br from-amber-50 via-white to-slate-50 rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all duration-200">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-yellow-400 to-orange-400 rounded-t-xl opacity-80" />
      <CardBody className="p-7 space-y-3 flex flex-col items-start">
        <div className="flex items-center gap-2">
          <Lightbulb className="text-yellow-500 w-5 h-5" />
          <h3 className="text-lg font-semibold text-slate-900">Quick Tip</h3>
        </div>
        <p className="text-sm text-slate-700">{randomTip}</p>
      </CardBody>
    </Card>
  );
}
