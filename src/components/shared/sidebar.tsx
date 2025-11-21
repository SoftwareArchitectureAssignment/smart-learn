import { BookOpen, FileText, LayoutDashboard, GraduationCap, Settings, MoreVertical, User, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { cn } from "@/lib/utils";
import { navigate } from "@/lib/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/teacher/dashboard",
  },
  {
    title: "Courses",
    icon: BookOpen,
    href: "/teacher/courses",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/teacher/settings",
  },

  {
    title: "Reports",
    icon: FileText,
    href: "/student/reports",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const label = user.role === "ADMIN" ? "Administrator" : user.role === "TEACHER" ? "Teacher" : "Student";

  const handleLogout = () => {
    logout();
  };

  const handleViewProfile = () => {
    navigate(`/${user.role.toLowerCase()}/settings`);
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo Section */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500">
          <GraduationCap className="size-10 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900">SmartLearn</h1>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems
          .filter((item) => item.href.startsWith(`/${user.role.toLowerCase()}`))
          .map((item) => {
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
      <div className="border-t p-2">
        <div className="flex items-center gap-3 rounded-lg p-3">
          <Avatar className="size-10">
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="size-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 px-0" align="end">
              <div className="flex flex-col gap-1">
                <button
                  onClick={handleViewProfile}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                >
                  <User className="size-4" />
                  <span>View Profile</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="size-4" />
                  <span>Logout</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
