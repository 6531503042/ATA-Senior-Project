// src/components/Textarea.tsx
import React from 'react';

const Textarea = ({ value, onChange, placeholder }: { value: string; onChange: React.ChangeEventHandler<HTMLTextAreaElement>; placeholder: string }) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      style={{
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '0.375rem',
        resize: 'vertical',
        fontSize: '1rem',
        lineHeight: '1.5',
      }}
    />
  );
};

export default Textarea;
