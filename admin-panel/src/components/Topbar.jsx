import React from "react";
import { UserCircle } from "lucide-react";

const Topbar = () => {
  return (
    <header className="bg-white shadow px-4 py-2 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="flex items-center space-x-2">
        <UserCircle size={22} className="text-gray-500" />
      </div>
    </header>
  );
};

export default Topbar;
