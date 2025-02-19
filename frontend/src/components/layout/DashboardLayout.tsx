import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from "./Header";
import Sidebar from "./Sidebar";

export const DashboardLayout: React.FC = () => {
  useEffect(() => {
    console.log('DashboardLayout mounted');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
