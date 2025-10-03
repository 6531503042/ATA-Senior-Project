'use client';
import { useState } from 'react';
import { Card, CardHeader, CardBody, Button } from '@heroui/react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function CardStat({
  icon,
  label,
  children,
  colors,
  defaultOpen = false,
  isClosable = true,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  colors: string;
  defaultOpen?: boolean;
  isClosable?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    if (isClosable) setIsOpen(prev => !prev);
  };

  // Map color classes to proper gradient classes for both light and dark modes
  const getGradientClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'blue-100': 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
      'green-100': 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
      'purple-100': 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
      'orange-100': 'from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
      'red-100': 'from-red-500 to-red-600 dark:from-red-600 dark:to-red-700',
      'indigo-100': 'from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700',
      'cyan-100': 'from-cyan-500 to-cyan-600 dark:from-cyan-600 dark:to-cyan-700',
      'pink-100': 'from-pink-500 to-pink-600 dark:from-pink-600 dark:to-pink-700',
      'yellow-100': 'from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700',
      'teal-100': 'from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700',
      'emerald-100': 'from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700',
      'violet-100': 'from-violet-500 to-violet-600 dark:from-violet-600 dark:to-violet-700',
      'amber-100': 'from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700',
      'lime-100': 'from-lime-500 to-lime-600 dark:from-lime-600 dark:to-lime-700',
      'rose-100': 'from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-700',
      'fuchsia-100': 'from-fuchsia-500 to-fuchsia-600 dark:from-fuchsia-600 dark:to-fuchsia-700',
    };

    return colorMap[color] || 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700';
  };

  return (
    <Card
      isHoverable
      className="px-3 py-3 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl border-0 ring-1 ring-default-200/60 dark:ring-gray-800 hover:shadow-2xl dark:hover:shadow-gray-900/50 transition-all duration-300"
    >
      <CardHeader
        className="font-semibold gap-3 flex items-center justify-between cursor-pointer border-b border-default-200/60 dark:border-gray-800 pb-4"
        onClick={toggle}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 bg-gradient-to-r ${getGradientClass(colors)} text-white rounded-xl shadow-md flex items-center justify-center`}
          >
            {icon}
          </div>
          <p className="text-default-900 dark:text-white font-semibold">{label}</p>
        </div>

        {isClosable && (
          <Button isIconOnly className="ml-auto dark:text-gray-400 dark:hover:text-white" size="sm" variant="light">
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        )}
      </CardHeader>

      {(isOpen || !isClosable) && (
        <div className="overflow-visible">
          <CardBody className="flex flex-col items-center justify-center px-4 pt-4 pb-4 overflow-visible">
            {children}
          </CardBody>
        </div>
      )}
    </Card>
  );
}