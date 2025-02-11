import { MessageSquare, ThumbsUp, ThumbsDown, Brain } from 'lucide-react';
import React from 'react'

const feedback_manage = () => {
  interface MenuOption {
    title: string;
    number: string;
    icon: React.FC<any>;
    color: string;
    background?: string;
    subtitle?: string;
    trend?: string;
    subtitle_color?: string;
  }

  const options: MenuOption[] = [
    {
      title: "Total Feedback",
      number: "2,847",
      trend: "+156 this week",
      icon: MessageSquare,
      color: "text-blue-500",
      subtitle: "Responses collected",
      background: "bg-blue-50",
    },
    {
      title: "Positive Feedback",
      number: "78%",
      trend: "+5% vs last month",
      icon: ThumbsUp,
      color: "text-green-500",
      subtitle: "1,986 responses",
      background: "bg-green-50",
    },
    {
      title: "Negative Feedback",
      number: "22%",
      trend: "-3% vs last month",
      icon: ThumbsDown,
      color: "text-red-500",
      subtitle: "861 responses",
      background: "bg-red-50",
    },
    {
      title: "Sentiment Score",
      number: "84%",
      trend: "+2% vs last month",
      icon: Brain,
      color: "text-amber-500",
      subtitle: "Overall sentiment score",
      background: "bg-amber-50",
    },
  ];

  return (
    <div className="px-3 w-full h-full">
      <div className="w-full h-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-red-600">
            Feedback Management
          </h1>
          <p className="text-base text-gray-500 font-normal">
            Monitor feedback trends and sentiment analysis
          </p>
        </div>

        <div className="w-full h-auto mt-9">
          <ul className="grid 2xl:grid-cols-4 lg:grid-cols-2 grid-cols-1 gap-5">
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <li
                  key={index}
                  className="flex-1 p-6 flex flex-row items-center justify-between border border-opacity-5 border-black rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-zinc-500">
                      {option.title}
                    </p>
                    <p className="text-2xl font-bold">{option.number}</p>
                    <div className="flex flex-col gap-1">
                      {option.trend && (
                        <p className="text-xs font-medium text-green-500">
                          {option.trend}
                        </p>
                      )}
                      {option.subtitle && (
                        <p className="text-xs text-zinc-400">
                          {option.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <div
                    className={`${option.background} p-3 rounded-lg hidden sm:block ${option.color}`}
                  >
                    <Icon className={``} strokeWidth={2.7} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default feedback_manage