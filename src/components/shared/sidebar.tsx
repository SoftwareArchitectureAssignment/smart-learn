import { BookOpen, FileText, LayoutDashboard, GraduationCap, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Tổng quan",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Bảng điều khiển",
    icon: FileText,
    href: "/reports",
  },
  {
    title: "Khóa học",
    icon: BookOpen,
    href: "/courses",
  },
  {
    title: "Cài đặt",
    icon: Settings,
    href: "/settings",
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo Section */}
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500">
          <GraduationCap className="size-6 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900">SmartLearn</h1>
          <p className="text-sm text-gray-500">Giảng viên</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <Icon className="size-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanAn"
            alt="Nguyễn Văn An"
            className="size-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Nguyễn Văn An</p>
            <p className="text-xs text-gray-500 truncate">Giảng viên</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
