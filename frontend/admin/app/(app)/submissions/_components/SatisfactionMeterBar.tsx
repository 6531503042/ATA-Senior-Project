"use client";

type Props = {
  value: number; // 0-100
};

export default function SatisfactionMeterBar({ value }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs text-default-500">
        <span>0%</span>
        <span>100%</span>
      </div>
      <div className="h-2 rounded-full bg-default-200 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-600 transition-all duration-500"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}


