"use client";

import React, { useState, Suspense, lazy } from "react";
import SidebarAdmin from "@/app/components/sidebar_usermanagement/sidebar";
import LoadingScreen from "@/app/components/loadingscreen/loadingscreen";

const Page = () => {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);

  const renderContent = () => {
    const Component = lazy(
      () => import(`@/app/(pages)/dashboard_admin/section/${selectedComponent}`)
    );

    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component />
      </Suspense>
    );
  };

  const handleOptionSelect = (component: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setSelectedComponent(component);
      setIsLoading(false);
    }, 1800);
  };

  return (
    <div className="flex flex-row bg-gray-50">
      <SidebarAdmin onOptionSelect={handleOptionSelect} />
      <div className="flex-1 p-5 flex gap-5 flex-col">
        <div className="border-2 border-red-600 p-6 flex flex-row justify-between rounded-md">
          <div>a</div>
          <div>b</div>
        </div>
        <div className="p-6 border-2 border-red-600 rounded-md w-full h-full">
          {isLoading ? <LoadingScreen /> : renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Page;
