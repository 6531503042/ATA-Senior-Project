import React from 'react';
import { ModeToggle } from "../mode-toggle";
import { Input } from "@nextui-org/react";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex-1 flex items-center max-w-xl">
          <Input
            classNames={{
              base: "max-w-full h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            placeholder="Search..."
            size="sm"
            startContent={<MagnifyingGlassIcon className="h-4 w-4 text-default-400" />}
            type="search"
          />
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <BellIcon className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              2
            </span>
          </Button>
          <div className="h-5 w-px bg-gray-200" />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};