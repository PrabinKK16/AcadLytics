import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Camera, Trash2, Lock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
} from "../../redux/slices/profileSlice";
import { getCurrentUser } from "../../redux/slices/authSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || "",
      oldPassword: "",
      newPassword: "",
    },
  });

  const avatarUrl =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User",
    )}`;

  const handleProfileUpdate = async (data) => {
    try {
      await dispatch(updateProfile({ name: data.name })).unwrap();
      await dispatch(getCurrentUser());
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await dispatch(updateAvatar(file)).unwrap();
      await dispatch(getCurrentUser());
      toast.success("Avatar updated");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      await dispatch(removeAvatar()).unwrap();
      await dispatch(getCurrentUser());
      toast.success("Avatar removed");
    } catch (error) {
      toast.error(error);
    }
  };

  const handlePasswordChange = async (data) => {
    try {
      await dispatch(
        changePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      ).unwrap();

      reset({
        ...data,
        oldPassword: "",
        newPassword: "",
      });

      toast.success("Password changed");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 
        shadow-sm dark:border-white/10 dark:bg-slate-900"
      >
        <div className="flex flex-col items-center">
          <img
            src={avatarUrl}
            alt="avatar"
            className="h-28 w-28 rounded-full object-cover border-4 
            border-slate-200 dark:border-white/10"
          />

          <h2 className="mt-4 text-xl font-semibold text-slate-800 dark:text-white">
            {user?.name}
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user?.email}
          </p>

          <span
            className="mt-3 rounded-full bg-indigo-100 px-4 py-1 text-sm 
          font-medium text-indigo-600 dark:bg-cyan-500/10 dark:text-cyan-300"
          >
            {user?.role}
          </span>

          <label
            className="mt-6 w-full cursor-pointer rounded-2xl 
          bg-indigo-600 px-4 py-3 text-center font-medium text-white hover:bg-indigo-700"
          >
            <Camera className="inline mr-2" size={18} />
            Upload Avatar
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </label>

          <button
            onClick={handleAvatarRemove}
            className="mt-3 w-full rounded-2xl bg-red-500 px-4 py-3 font-medium 
            text-white hover:bg-red-600"
          >
            <Trash2 className="inline mr-2" size={18} />
            Remove Avatar
          </button>
        </div>
      </motion.div>

      <div className="space-y-6 xl:col-span-2">
        <motion.form
          onSubmit={handleSubmit(handleProfileUpdate)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm 
          dark:border-white/10 dark:bg-slate-900"
        >
          <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-white">
            Update Profile
          </h3>

          <input
            {...register("name")}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none 
            focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800 
            dark:text-white"
          />

          <button
            disabled={loading}
            className="mt-4 rounded-2xl bg-indigo-600 px-6 py-3 font-medium 
            text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </motion.form>

        <motion.form
          onSubmit={handleSubmit(handlePasswordChange)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm 
          dark:border-white/10 dark:bg-slate-900"
        >
          <h3
            className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 
          dark:text-white"
          >
            <Lock size={18} />
            Security
          </h3>

          <div className="space-y-4">
            <input
              type="password"
              placeholder="Old Password"
              {...register("oldPassword")}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none 
              focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-800 
              dark:text-white"
            />

            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword")}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 
              outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 
              dark:bg-slate-800 dark:text-white"
            />
          </div>

          <button
            disabled={loading}
            className="mt-4 rounded-2xl bg-indigo-600 px-6 py-3 font-medium text-white 
            hover:bg-indigo-700"
          >
            Change Password
          </button>
        </motion.form>
      </div>
    </div>
  );
};

export default Profile;
