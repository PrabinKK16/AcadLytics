import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Camera, Trash2, Lock, User, Mail, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
} from "../../redux/slices/profileSlice";
import { getCurrentUser } from "../../redux/slices/authSlice";

const InputField = ({ label, children }) => (
  <div>
    {label && (
      <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-400">
        {label}
      </label>
    )}
    {children}
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.profile);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: user?.name || "", oldPassword: "", newPassword: "" },
  });

  const avatarUrl =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=6366f1&color=fff&bold=true`;

  const onProfileUpdate = async (data) => {
    try {
      await dispatch(updateProfile({ name: data.name })).unwrap();
      await dispatch(getCurrentUser());
      toast.success("Profile updated");
    } catch (e) {
      toast.error(e);
    }
  };

  const onAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await dispatch(updateAvatar(file)).unwrap();
      await dispatch(getCurrentUser());
      toast.success("Avatar updated");
    } catch (e) {
      toast.error(e);
    }
  };

  const onAvatarRemove = async () => {
    try {
      await dispatch(removeAvatar()).unwrap();
      await dispatch(getCurrentUser());
      toast.success("Avatar removed");
    } catch (e) {
      toast.error(e);
    }
  };

  const onPasswordChange = async (data) => {
    try {
      await dispatch(
        changePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      ).unwrap();
      reset({ ...data, oldPassword: "", newPassword: "" });
      toast.success("Password changed");
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid gap-6 xl:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/6 dark:bg-[#111827]"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            <img
              src={avatarUrl}
              alt="avatar"
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-xl dark:border-white/10"
            />
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Camera size={18} className="text-white" />
            </div>
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
            {user?.name}
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {user?.email}
          </p>

          <div className="mt-2 flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 dark:bg-indigo-500/10">
            <ShieldCheck
              size={13}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <span className="text-xs font-semibold capitalize text-indigo-600 dark:text-indigo-400">
              {user?.role}
            </span>
          </div>

          <div className="mt-6 w-full space-y-2.5">
            <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700">
              <Camera size={16} />
              Upload Photo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={onAvatarUpload}
              />
            </label>
            <button
              onClick={onAvatarRemove}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
            >
              <Trash2 size={16} />
              Remove Photo
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-2.5 border-t border-slate-100 pt-5 dark:border-white/6">
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-2.5 dark:bg-white/3">
            <User size={15} className="text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
              {user?.name}
            </span>
          </div>
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-2.5 dark:bg-white/3">
            <Mail size={15} className="text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-300 truncate">
              {user?.email}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-5 xl:col-span-2">
        <motion.form
          onSubmit={handleSubmit(onProfileUpdate)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/6 dark:bg-[#111827]"
        >
          <h3 className="mb-5 text-base font-semibold text-slate-800 dark:text-white">
            Update Profile
          </h3>
          <InputField label="Full Name">
            <input
              {...register("name")}
              className="w-full rounded-xl border border-slate-200
              bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none
               transition focus:border-indigo-400 focus:bg-white
               focus:ring-2 focus:ring-indigo-100 dark:border-white/10
                dark:bg-white/3 dark:text-white dark:focus:border-indigo-500
                 dark:focus:bg-white/5"
            />
          </InputField>
          <button
            disabled={loading}
            className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
        </motion.form>

        <motion.form
          onSubmit={handleSubmit(onPasswordChange)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-white/6 dark:bg-[#111827]"
        >
          <h3 className="mb-5 flex items-center gap-2.5 text-base font-semibold text-slate-800 dark:text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/5">
              <Lock size={15} className="text-slate-500 dark:text-slate-400" />
            </span>
            Security
          </h3>
          <div className="space-y-3.5">
            <InputField label="Current Password">
              <input
                type="password"
                placeholder="Enter current password"
                {...register("oldPassword")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/3 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-white/5"
              />
            </InputField>
            <InputField label="New Password">
              <input
                type="password"
                placeholder="Enter new password"
                {...register("newPassword")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-white/10 dark:bg-white/3 dark:text-white dark:focus:border-indigo-500 dark:focus:bg-white/5"
              />
            </InputField>
          </div>
          <button
            disabled={loading}
            className="mt-4 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 disabled:opacity-60 dark:bg-white/10 dark:hover:bg-white/20"
          >
            {loading ? "Updating…" : "Change Password"}
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Profile;
