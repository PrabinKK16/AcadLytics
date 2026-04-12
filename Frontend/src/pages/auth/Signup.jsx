import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import AuthLayout from "../../components/auth/AuthLayout";
import { signupUser } from "../../redux/slices/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      const result = await dispatch(signupUser(payload)).unwrap();

      toast.success(result.message || "Signup successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error || "Signup failed");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start using AcadLytics with smart academic analytics"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700">Full Name</label>

          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition-all">
            <User size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full bg-transparent outline-none text-gray-700"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
            />
          </div>

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Email Address
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition-all">
            <Mail size={18} className="text-gray-400" />

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent outline-none text-gray-700"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                  message: "Please enter a valid email",
                },
              })}
            />
          </div>

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Select Role
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
            <ShieldCheck size={18} className="text-gray-400" />

            <select
              className="w-full bg-transparent outline-none text-gray-700"
              {...register("role", {
                required: "Role is required",
              })}
            >
              <option value="">Choose role</option>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {errors.role && (
            <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Password</label>

          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition-all">
            <Lock size={18} className="text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              className="w-full bg-transparent outline-none text-gray-700"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>

          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-400 transition-all">
            <Lock size={18} className="text-gray-400" />

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              className="w-full bg-transparent outline-none text-gray-700"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              })}
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          type="submit"
          className="w-full rounded-2xl bg-indigo-600 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create Account"}
        </motion.button>

        <div className="relative flex items-center justify-center py-2">
          <div className="absolute w-full border-t border-gray-200" />
          <span className="relative bg-white px-3 text-sm text-gray-500">
            OR
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white py-3 font-medium text-gray-700 hover:bg-gray-50 transition-all"
        >
          <Chrome size={18} />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
