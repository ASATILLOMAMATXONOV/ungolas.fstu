import React from "react";
import DashboardCard from "../components/DashboardCard";
import { Users, BarChart2 } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard title="Users" value="1,250" icon={<Users />} />
      <DashboardCard title="Views" value="89K" icon={<BarChart2 />} />
      <DashboardCard title="Clicks" value="12K" icon={<BarChart2 />} />
    </div>
  );
};

export default Dashboard;
