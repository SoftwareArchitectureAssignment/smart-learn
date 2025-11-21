import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="space-y-8 p-8 text-center">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="animate-pulse bg-linear-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-9xl font-bold text-transparent md:text-[12rem]">
            404
          </h1>
          <div className="absolute inset-0 animate-pulse text-9xl font-bold text-purple-500 opacity-20 blur-2xl md:text-[12rem]">
            404
          </div>
        </div>

        {/* Icon/Emoji */}
        <div className="animate-bounce text-6xl md:text-8xl">😢</div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white md:text-5xl">Page Not Found</h2>
          <p className="mx-auto max-w-md text-lg text-gray-300 md:text-xl">
            Oops! The page you're looking for seems to have vanished into the digital void.
          </p>
        </div>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-block rounded-lg bg-linear-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
