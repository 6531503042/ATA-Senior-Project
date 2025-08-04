"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export function Breadcrumb() {
  const items = useBreadcrumb();

  return (
    <Breadcrumbs variant="bordered">
      {items.map((item) => (
        <BreadcrumbItem key={item.href} href={item.href}>
          {item.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}