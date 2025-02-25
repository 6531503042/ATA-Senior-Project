import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../../../libs/components/ui/select';

interface Option {
  value: string;
  label: string;
  icon: React.FC<any>; 
}

interface SelectWithIconsProps {
  options: Option[];
  value: string;
  title?: string;
  onChange: (value: string) => void;
}

const SelectWithIcons: React.FC<SelectWithIconsProps> = ({ options, value, title , onChange }) => {
  const selectedOption = options.find(option => option.value === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full text-zinc-700">
        <SelectValue placeholder={title || "Select Type"} >
          <div className="flex items-center gap-2">
            {selectedOption && <selectedOption.icon className="h-4 w-4" />}
            {selectedOption?.label}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center gap-2 text-zinc-700">
              <option.icon className="h-4 w-4" />
              {option.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectWithIcons;
