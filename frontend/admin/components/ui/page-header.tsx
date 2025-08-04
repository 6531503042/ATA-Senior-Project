"use client";

import { ReactNode } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

import { useBreadcrumb } from "@/hooks/useBreadcrumb";

interface PageHeaderProps {
    title?: string;
    right?: ReactNode;
    description: string;
    icon: ReactNode;
}

export function PageHeader({ title, right, icon, description }: PageHeaderProps) {
    const items = useBreadcrumb();

    return (
        <div className="mb-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r shadow-lg from-[#3b82f6] to-[#4f46e5] border">
                        {icon && <span className="text-white">{icon}</span>}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {title || items[items.length - 1]?.name}
                        </h1>
                        <p className="text-start text-sm text-default-500 font-medium">{description}</p>
                    </div>
                </div>
                {right && <div className="mt-2 md:mt-0">{right}</div>}
            </div>
            <div className="border py-3 px-4 rounded-lg bg-default-50 mb-4 mt-4">
                <Breadcrumbs className="w-full">
                    <BreadcrumbItem href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/`}>
                        Home
                    </BreadcrumbItem>
                    {items.map((item) => (
                        <BreadcrumbItem key={item.href} href={item.href}>
                            {item.name}
                        </BreadcrumbItem>
                    ))}
                </Breadcrumbs>
            </div>
        </div>
    );
}