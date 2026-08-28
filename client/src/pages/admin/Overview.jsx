import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  MessageSquare,
  Eye,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

const Overview = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Posts",
      value: "120",
      change: "+12%",
      trend: "up",
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: "45",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Comments",
      value: "320",
      change: "+18%",
      trend: "up",
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Total Views",
      value: "5.2K",
      change: "+24%",
      trend: "up",
      icon: Eye,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  const recentPosts = [
    {
      title: "Getting Started with React",
      author: "Admin",
      status: "Published",
      date: "Today, 10:30 AM",
      views: "1.2K",
    },
    {
      title: "Understanding Node.js",
      author: "Muhammad",
      status: "Published",
      date: "Yesterday",
      views: "856",
    },
    {
      title: "MongoDB Best Practices",
      author: "Admin",
      status: "Draft",
      date: "Aug 26, 2026",
      views: "—",
    },
    {
      title: "Building REST APIs with Express",
      author: "Ali",
      status: "Published",
      date: "Aug 25, 2026",
      views: "634",
    },
  ];

  const recentUsers = [
    {
      name: "Ali Khan",
      email: "ali@example.com",
      joined: "2 hours ago",
      avatar: "AK",
    },
    {
      name: "Sarah Ahmed",
      email: "sarah@example.com",
      joined: "5 hours ago",
      avatar: "SA",
    },
    {
      name: "Usman Malik",
      email: "usman@example.com",
      joined: "Yesterday",
      avatar: "UM",
    },
    {
      name: "Hamza Shah",
      email: "hamza@example.com",
      joined: "2 days ago",
      avatar: "HS",
    },
  ];

  const recentComments = [
    {
      user: "Ali Khan",
      comment: "Great article! This really helped me understand React.",
      post: "Getting Started with React",
      time: "10 min ago",
      status: "Approved",
    },
    {
      user: "Sarah Ahmed",
      comment: "Very useful explanation. Looking forward to more.",
      post: "Understanding Node.js",
      time: "1 hour ago",
      status: "Pending",
    },
    {
      user: "Usman Malik",
      comment: "Can you make a tutorial about authentication?",
      post: "Building REST APIs with Express",
      time: "3 hours ago",
      status: "Approved",
    },
  ];

  const activities = [
    {
      icon: Plus,
      title: "New post published",
      description: "Getting Started with React",
      time: "10 minutes ago",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Users,
      title: "New user registered",
      description: "Ali Khan joined the platform",
      time: "2 hours ago",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: MessageSquare,
      title: "New comment received",
      description: "Sarah commented on Node.js",
      time: "3 hours ago",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: Edit,
      title: "Post updated",
      description: "MongoDB Best Practices",
      time: "Yesterday",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray">Dashboard Overview</h2>
          <p className="text-gray-500 mt-1">
            Here's what's happening with your blog today.4
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/posts")}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <Plus size={18} />
            New Post
          </button>

          <button
            className=" 
    flex items-center gap-2 px-4 py-2 rounded-lg border 
    bg-white text-gray-700 border-gray-200 
    hover:bg-gray-50 
    dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 
    dark:hover:bg-gray-800 
    transition-colors duration-200 cursor-pointer 
  "
          >
            <Calendar size={18} />
            Today
          </button>
        </div>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>

                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                  <TrendingUp size={15} />
                  {stat.change}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </h3>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Compared with last month
              </p>
            </div>
          );
        })}
      </div>

      {/* ================= PERFORMANCE + ACTIVITY ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Performance */}
        <div className="xl:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Blog Performance
              </h3>
              <p className="text-sm text-gray-500">
                Overview of your blog activity
              </p>
            </div>

            <div className="flex items-center gap-2 text-blue-600">
              <BarChart3 size={20} />
              <span className="text-sm font-medium">This Month</span>
            </div>
          </div>

          {/* Simple chart */}
          <div className="h-64 flex items-end justify-between gap-3 px-2">
            {[45, 65, 50, 80, 60, 90, 75, 100, 85, 70, 95, 110].map(
              (height, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col justify-end items-center gap-2"
                >
                  <div
                    className="w-full max-w-[38px] bg-blue-500 rounded-t-lg hover:bg-blue-600 transition"
                    style={{
                      height: `${height * 1.8}px`,
                    }}
                  ></div>

                  <span className="text-xs text-gray-400">{index + 1}</span>
                </div>
              ),
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-5 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Views</p>
              <p className="text-xl font-bold mt-1">5.2K</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Engagement</p>
              <p className="text-xl font-bold mt-1">68%</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">New Posts</p>
              <p className="text-xl font-bold mt-1">24</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-500">Latest updates</p>
            </div>

            <Clock size={20} className="text-gray-400" />
          </div>

          <div className="space-y-5">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <div key={index} className="flex gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={17} className={activity.color} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.title}
                    </p>

                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {activity.description}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= RECENT POSTS ================= */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
            <p className="text-sm text-gray-500">Your latest blog posts</p>
          </div>

          <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
            View All
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b border-gray-100">
                <th className="px-6 py-4">Post</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Views</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody>
              {recentPosts.map((post, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText size={18} className="text-gray-500" />
                      </div>

                      <span className="font-medium text-gray-900">
                        {post.title}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {post.author}
                  </td>

                  <td className="px-6 py-4">
                    {post.status === "Published" ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle size={13} />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Edit size={13} />
                        Draft
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {post.views}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= USERS + COMMENTS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* New Users */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">New Users</h3>

              <p className="text-sm text-gray-500">Recently registered users</p>
            </div>

            <Users size={20} className="text-gray-400" />
          </div>

          <div className="p-6 space-y-5">
            {recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center font-semibold text-sm">
                    {user.avatar}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>

                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                <span className="text-xs text-gray-400">{user.joined}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Recent Comments
              </h3>

              <p className="text-sm text-gray-500">
                Latest comments from users
              </p>
            </div>

            <MessageSquare size={20} className="text-gray-400" />
          </div>

          <div className="p-6 space-y-5">
            {recentComments.map((comment, index) => (
              <div
                key={index}
                className="pb-5 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-900">
                    {comment.user}
                  </span>

                  {comment.status === "Approved" ? (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle size={13} />
                      Approved
                    </span>
                  ) : (
                    <span className="text-xs text-yellow-600 flex items-center gap-1">
                      <AlertCircle size={13} />
                      Pending
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600">{comment.comment}</p>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">On: {comment.post}</p>

                  <p className="text-xs text-gray-400">{comment.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= QUICK ACTIONS ================= */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition text-left">
            <div className="w-11 h-11 rounded-lg bg-blue-100 flex items-center justify-center">
              <Plus className="text-blue-600" size={20} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">Create Post</p>
              <p className="text-xs text-gray-500 mt-1">Write a new article</p>
            </div>
          </button>

          <button className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition text-left">
            <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center">
              <Users className="text-green-600" size={20} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">Manage Users</p>
              <p className="text-xs text-gray-500 mt-1">View all users</p>
            </div>
          </button>

          <button className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition text-left">
            <div className="w-11 h-11 rounded-lg bg-purple-100 flex items-center justify-center">
              <MessageSquare className="text-purple-600" size={20} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">Comments</p>
              <p className="text-xs text-gray-500 mt-1">Moderate comments</p>
            </div>
          </button>

          <button className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4 hover:shadow-md hover:-translate-y-0.5 transition text-left">
            <div className="w-11 h-11 rounded-lg bg-orange-100 flex items-center justify-center">
              <BarChart3 className="text-orange-600" size={20} />
            </div>

            <div>
              <p className="font-semibold text-gray-900">Analytics</p>
              <p className="text-xs text-gray-500 mt-1">View detailed stats</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Overview;
