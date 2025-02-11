import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star, MessageSquare, ListChecks, CheckSquare } from 'lucide-react';

const SelectWithIcons = () => {
  const [value, setValue] = React.useState('');

  const options = [
    { value: 'rating', label: 'Rating', icon: <Star className="h-4 w-4" /> },
    { value: 'text', label: 'Text', icon: <MessageSquare className="h-4 w-4" /> },
    { value: 'multichoice', label: 'Multi Choice', icon: <ListChecks className="h-4 w-4" /> },
    { value: 'singlechoice', label: 'Single Choice', icon: <CheckSquare className="h-4 w-4" /> },
  ];

  // Find the selected option to get its icon and label
  const selectedOption = options.find(option => option.value === value);

  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Type" className=''>
          {/* Render icon and label */}
          <div className='flex flex-row gap-2 items-center'>
          {selectedOption?.icon}
          {selectedOption?.label}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value} icon={option.icon}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectWithIcons;
