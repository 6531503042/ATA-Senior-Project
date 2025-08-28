"use client";
import { useState } from "react";
import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { ChevronDown, ChevronUp } from "lucide-react";

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
    if (isClosable) setIsOpen((prev) => !prev);
  };

  return (
    <Card isHoverable className="px-2 py-2 bg-white rounded-2xl overflow-hidden shadow-lg border-0">
      <CardHeader
        className="font-semibold gap-2 flex items-center justify-between cursor-pointer border-b border-default-200"
        onClick={toggle}
      >
        <div className="flex items-center gap-2">
          <div
            className={`p-2 bg-${colors} text-${colors.replace(
              "100",
              "600"
            )} rounded-xl shadow-inner flex items-center justify-center`}
          >
            {icon}
          </div>
          <p>{label}</p>
        </div>

        {isClosable && (
          <Button isIconOnly size="sm" variant="light" className="ml-auto">
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        )}
      </CardHeader>

      {(isOpen || !isClosable) && (
        <div className="overflow-hidden">
          <CardBody className="flex flex-col items-center justify-center px-0 pt-3">
            {children}
          </CardBody>
        </div>
      )}
    </Card>
  );
}
