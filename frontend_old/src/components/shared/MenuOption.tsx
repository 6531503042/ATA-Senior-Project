import React from "react";

interface MenuOptionProps {
  title: string;
  number: string;
  icon: React.FC<any>;
  color: string;
  background?: string;
  subtitle?: string;
  trend?: string;
  subtitle_color?: string;
}

const MenuOption: React.FC<MenuOptionProps> = ({
  title,
  number,
  icon: Icon,
  color,
  background = "bg-white", // Default background to white if not provided
  subtitle,
  subtitle_color = "text-zinc-400", // Default color for subtitle
  trend,
}) => {
  return (
    <li className="flex-1 p-6 flex flex-row items-center justify-between border border-opacity-5 border-black rounded-lg shadow-md hover:shadow-xl transition-all duration-200">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <p className="text-2xl font-bold">{number}</p>
        <div className="flex flex-col gap-1">
          {trend && (
            <p className="text-xs font-medium text-green-500">{trend}</p>
          )}
          {subtitle && (
            <p className={`text-xs ${subtitle_color}`}>{subtitle}</p>
          )}
        </div>
      </div>
      <div className={`${background} p-3 rounded-lg hidden sm:block ${color}`}>
        <Icon className="" strokeWidth={2.7} />
      </div>
    </li>
  );
};

export default MenuOption;
