
import React from "react";
import { Label } from "@/components/ui/label";
import {
  RocketLaunchIcon,
  FlagIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const priorities = [
  {
    id: "high",
    name: "High Priority",
    description: "Urgent and important tasks",
    icon: RocketLaunchIcon,
    gradient: "from-red-50 to-rose-50",
    iconColor: "text-red-600",
  },
  {
    id: "medium",
    name: "Medium Priority",
    description: "Important but not urgent",
    icon: FlagIcon,
    gradient: "from-yellow-50 to-amber-50",
    iconColor: "text-yellow-600",
  },
  {
    id: "low",
    name: "Low Priority",
    description: "Can be completed later",
    icon: ChartBarIcon,
    gradient: "from-green-50 to-emerald-50",
    iconColor: "text-green-600",
  },
];

interface ProjectPrioritySelectProps {
  priority: string;
  setPriority: (priority: string) => void;
}

export function ProjectPrioritySelect({ priority, setPriority }: ProjectPrioritySelectProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Project Priority</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {priorities.map((p) => (
          <button
            key={p.id}
            onClick={() => setPriority(p.id)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              priority === p.id
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-gray-200"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${p.gradient} rounded-xl opacity-50`} />
            <div className="relative space-y-3">
              <div className={`h-10 w-10 rounded-lg bg-white/80 backdrop-blur flex items-center justify-center ${p.iconColor}`}>
                <p.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {p.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
