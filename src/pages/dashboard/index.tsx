import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Sidebar from "@/components/shared/sidebar";

// Example API call using axios and TanStack Query
const fetchUserData = async () => {
  // Replace with your actual API endpoint
  const response = await axios.get("https://jsonplaceholder.typicode.com/users/1");
  return response.data;
};

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserData,
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Tổng quan</h1>

          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin người dùng</h2>

            {isLoading && <p className="text-gray-600">Đang tải...</p>}

            {error && <p className="text-red-600">Lỗi tải dữ liệu: {error.message}</p>}

            {data && (
              <div className="space-y-3">
                <p className="text-gray-700">
                  <span className="font-semibold">Tên:</span> {data.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Email:</span> {data.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Tên đăng nhập:</span> {data.username}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
