import { PencilOff, X } from "lucide-react";
import React from "react";

const usermanagement = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="flex flex-col pt-5 w-[1520px] divide-y">
        {/* Container*/}
        <div className="">
          {/* Sort */}
          <ul className="inline-flex flex-row text-base w-[1520px] text-gray-500 h-auto items-center text-start bg-gray-50 border-slate-200">
            <li className="w-1/6 p-3">Name</li>
            <li className="w-1/6 p-3">Email</li>
            <li className="w-1/6 p-3">Role</li>
            <li className="w-1/6 p-3">Status</li>
            <li className="w-1/6 p-3">Last Login</li>
            <li className="w-1/6 p-3">Actions</li>
          </ul>
        </div>
          {/*Column DATA*/}
          <ul className="inline-flex flex-row text-base w-[1520px] h-auto items-center text-start border-slate-200">
            <li className="w-1/6 p-3">{/* Name */}mocking name</li>
            <li className="w-1/6 p-3">{/* Email */}mocking email</li>
            <li className="w-1/6 p-3">{/* Role */}mocking role</li>
            <li className="w-1/6 p-3">{/* Status */}mocking status</li>
            <li className="w-1/6 p-3">{/* Last Login */}mocking date</li>
            <li className="w-1/6 p-3 inline-flex flex-row gap-3">{/* Actions */}<X className="bg-red-500 rounded-full text-white cursor-pointer p-1"/><PencilOff className="bg-yellow-400 rounded-full text-white cursor-pointer p-1"/></li>
          </ul>
      </div>
    </div>
  );
};

export default usermanagement;
