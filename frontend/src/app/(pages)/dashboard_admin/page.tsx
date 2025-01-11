"use client";

import React, { useState, Suspense, lazy } from "react";
import SidebarAdmin from "@/app/components/sidebar_usermanagement/sidebar";

const page = () => {
  const [selectedComponent, setSelectedComponent] = useState("dashboard");

  const renderContent = () => {
    const Component = lazy(() =>
      import(`@/app/(pages)/dashboard_admin/section/${selectedComponent}`)
    );

    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Component />
      </Suspense>
    );
  };

  return (
    <div className="flex flex-row">
      <SidebarAdmin onOptionSelect={(component) => setSelectedComponent(component)} />
      <div className="flex-1 p-6 bg-gray-100">
        {renderContent()}
      </div>
    </div>
  );
};

export default page;
