import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  description: string;
  icon: ReactNode;
}

export const MetricCard = ({ title, value, trend, description, icon }: MetricCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 cursor-help bg-white hover:shadow-lg transition-all duration-300 border-transparent hover:border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-gray-50">
                  {icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{title}</p>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    {value}
                  </h3>
                </div>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-sm font-medium ${
                trend.startsWith("+") 
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {trend}
              </div>
            </div>
          </Card>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {icon}
            <h4 className="text-sm font-semibold">{title}</h4>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
