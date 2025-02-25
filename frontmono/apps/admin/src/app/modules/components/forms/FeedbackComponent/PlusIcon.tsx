import React from "react";

interface PlusIconProps {
  size?: number;
  height?: number;
  width?: number;
  [x: string]: any;
}

export const PlusIcon: React.FC<PlusIconProps> = ({
  size,
  height,
  width,
  ...props
}) => (
  <svg
    fill="none"
    height={size || height || 24}
    viewBox="0 0 24 24"
    width={size || width || 24}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 12H18"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
    <path
      d="M12 18V6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    />
  </svg>
);

export default PlusIcon;