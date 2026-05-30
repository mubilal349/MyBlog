import React from "react";
import { FileText, Users, MessageSquare, Eye } from "lucide-react";

const Overview = () => {
  const stats = [
    { title: "Posts", value: 120, icon: FileText, color: "text-blue-600" },
    { title: "Users", value: 45, icon: Users, color: "text-green-600" },
    {
      title: "Comments",
      value: 320,
      icon: MessageSquare,
      color: "text-purple-600",
    },
    { title: "Views", value: "5.2k", icon: Eye, color: "text-orange-600" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white shadow rounded-xl p-5 flex items-center"
          >
            <stat.icon className={`w-10 h-10 ${stat.color}`} />
            <div className="ml-4">
              <h4 className="text-gray-500">{stat.title}</h4>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
