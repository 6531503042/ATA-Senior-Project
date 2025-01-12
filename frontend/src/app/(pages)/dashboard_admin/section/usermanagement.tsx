import React from "react";

const usermanagement = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Management</h1>
      <div className="flex flex-col pt-5 w-[1520px]">
        {/* Container*/}
        <div>
          {/* Sort */}
          <ul className="inline-flex flex-row text-base font-bold w-[1520px] items-center p-3 text-center border border-slate-200">
            <li className="w-1/6 border-r">Name</li>
            <li className="w-1/6 border-r">Email</li>
            <li className="w-1/6 border-r">Role</li>
            <li className="w-1/6 border-r">Status</li>
            <li className="w-1/6 border-r">Last Login</li>
            <li className="w-1/6">Actions</li>
          </ul>
        </div>
        <div>
          {/*Column DATA*/}
          <ul className="inline-flex flex-row text-base font-bold w-[1520px] items-center p-3 text-center border border-slate-200">
            <li className="w-1/6 border-r">{/* Name */}</li>
            <li className="w-1/6 border-r">{/* Email */}</li>
            <li className="w-1/6 border-r">{/* Role */}</li>
            <li className="w-1/6 border-r">{/* Status */}</li>
            <li className="w-1/6 border-r">{/* Last Login */}</li>
            <li className="w-1/6">{/* Actions */}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default usermanagement;
