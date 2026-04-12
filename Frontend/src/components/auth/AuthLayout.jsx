import { motion } from "framer-motion";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div
      className="min-h-screen relative overflow-hidden 
    bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
    >
      <div
        className="absolute top-10 left-10 w-72 h-72 
      bg-purple-300 rounded-full blur-3xl opacity-30 animate-pulse"
      />
      <div
        className="absolute bottom-10 right-10 w-80 h-80 
      bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse"
      />
      <div
        className="absolute top-1/2 left-1/2 w-96 h-96 
      bg-pink-300 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"
      />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-6xl font-bold text-gray-800 leading-tight">
              Welcome to <span className="text-indigo-600">AcadLytics</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg leading-relaxed">
              Smart academic feedback intelligence with CO attainment analytics,
              faculty insights, trend dashboards, and automated reporting.
            </p>
          </motion.div>
        </div>

        <div className="flex items-center justify-center px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md backdrop-blur-xl bg-white/70 
            border border-white/40 shadow-2xl rounded-3xl p-8"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
              <p className="text-gray-500 mt-2">{subtitle}</p>
            </div>

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
