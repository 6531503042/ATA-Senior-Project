"use client";

import { ReactNode } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

interface PageHeaderProps {
    title?: string;
    right?: ReactNode;
    description: string;
    icon: ReactNode;
}

export function PageHeader({ title, right, icon, description }: PageHeaderProps) {
    return (
        <div className="mb-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-r shadow-lg from-[#3b82f6] to-[#4f46e5]">
                        {icon && <span className="text-white">{icon}</span>}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {title || "Dashboard"}
                        </h1>
                        <p className="text-start text-sm text-default-500 font-medium">{description}</p>
                    </div>
                </div>
                {right && <div className="mt-2 md:mt-0">{right}</div>}
            </div>
            <div className="py-3 px-4 rounded-xl bg-white shadow-sm ring-1 ring-default-200/60 mb-4 mt-4">
                <Breadcrumbs className="w-full text-sm text-default-500" underline="hover">
                    <BreadcrumbItem href="/">
                        Home
                    </BreadcrumbItem>
                    <BreadcrumbItem href="/dashboard">
                        Dashboard
                    </BreadcrumbItem>
                </Breadcrumbs>
            </div>
        </div>
    );
}
