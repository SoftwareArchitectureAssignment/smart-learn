import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="text-center space-y-8 p-8">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-purple-500 opacity-20 blur-2xl animate-pulse">
            404
          </div>
        </div>

        {/* Icon/Emoji */}
        <div className="text-6xl md:text-8xl animate-bounce">😢</div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold text-white">Page Not Found</h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-md mx-auto">
            Oops! The page you're looking for seems to have vanished into the digital void.
          </p>
        </div>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-block px-8 py-4 bg-linear-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
