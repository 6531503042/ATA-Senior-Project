import React from "react";

const usermanagement = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="flex flex-col pt-5 w-[1520px]">
        {/* Container*/}
        <div>
          {/* Sort */}
          <ul className="inline-flex flex-row text-base font-bold w-[1520px] h-auto items-center text-center border border-b-0 border-slate-200">
            <li className="w-1/6 border-r p-3">Name</li>
            <li className="w-1/6 border-r p-3">Email</li>
            <li className="w-1/6 border-r p-3">Role</li>
            <li className="w-1/6 border-r p-3">Status</li>
            <li className="w-1/6 border-r p-3">Last Login</li>
            <li className="w-1/6 border-r-0 p-3">Actions</li>
          </ul>
        </div>
          {/*Column DATA*/}
          <ul className="inline-flex flex-row text-base font-medium w-[1520px] h-auto items-center text-start border border-slate-200">
            <li className="w-1/6 border-r p-3">{/* Name */}mocking name</li>
            <li className="w-1/6 border-r p-3">{/* Email */}mocking email</li>
            <li className="w-1/6 border-r p-3">{/* Role */}mocking role</li>
            <li className="w-1/6 border-r p-3">{/* Status */}mocking status</li>
            <li className="w-1/6 border-r p-3">{/* Last Login */}mocking date</li>
            <li className="w-1/6 border-r-0 p-3">{/* Actions */}mocking feature</li>
          </ul>
      </div>
    </div>
  );
};

export default usermanagement;
