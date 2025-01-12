"use client";

import React, { useState, Suspense, lazy } from "react";
import SidebarAdmin from "@/app/components/sidebar_usermanagement/sidebar";
import LoadingScreen from "@/app/components/loadingscreen/loadingscreen_admin";

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
    if (!isLoading && component !== selectedComponent) {
      setIsLoading(true);
      setTimeout(() => {
        setSelectedComponent(component);
        setIsLoading(false);
      }, 1800);
    }
  };

  return (
    <div className="flex flex-row bg-gray-50">
      <SidebarAdmin
        onOptionSelect={handleOptionSelect}
        isLoading={isLoading}
      />
      <div className="flex-1 flex">
        <div className="p-6 rounded-md w-full h-full">
          {isLoading ? <LoadingScreen /> : renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Page;
