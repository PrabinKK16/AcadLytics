import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Camera,
  Trash2,
  Lock,
  User,
  Mail,
  ShieldCheck,
  Check,
  KeyRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  updateProfile,
  updateAvatar,
  removeAvatar,
  changePassword,
} from "../../redux/slices/profileSlice";
import { getCurrentUser } from "../../redux/slices/authSlice";
import { Card, Input, Button, SectionHeader } from "../../components/ui/index";

const roleStyle = {
  admin: "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
  faculty:
    "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
  student:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400",
};

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.profile);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: user?.name || "", oldPassword: "", newPassword: "" },
  });

  const avatar =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=6366f1&color=fff&bold=true&size=256`;

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
      reset({ name: data.name, oldPassword: "", newPassword: "" });
      toast.success("Password updated");
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <SectionHeader
        title="Your Profile"
        subtitle="Manage your account details and security"
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {/* Avatar card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="relative group">
              <img
                src={avatar}
                alt={user?.name}
                className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-xl dark:border-white/10"
              />
              <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={20} className="text-white" />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={onAvatarUpload}
                />
              </label>
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-800 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {user?.email}
            </p>
            <span
              className={`mt-2.5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleStyle[user?.role] || roleStyle.student}`}
            >
              <ShieldCheck size={11} /> {user?.role}
            </span>

            <div className="mt-6 w-full space-y-2">
              <Button variant="primary" className="w-full" onClick={() => {}}>
                <label className="flex cursor-pointer items-center justify-center gap-2 w-full">
                  <Camera size={15} /> Change Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={onAvatarUpload}
                  />
                </label>
              </Button>
              <Button
                variant="danger"
                className="w-full"
                onClick={onAvatarRemove}
              >
                <Trash2 size={15} /> Remove Photo
              </Button>
            </div>

            <div className="mt-5 w-full space-y-2 border-t border-slate-100 pt-5 dark:border-white/[0.06]">
              {[
                { icon: User, val: user?.name },
                { icon: Mail, val: user?.email },
              ].map(({ icon: Icon, val }) => (
                <div
                  key={val}
                  className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-4 py-2.5 dark:bg-white/[0.03]"
                >
                  <Icon size={14} className="flex-shrink-0 text-slate-400" />
                  <span className="truncate text-sm text-slate-600 dark:text-slate-300">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Forms */}
        <div className="space-y-5 xl:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                <User size={15} className="text-indigo-500" /> Personal
                Information
              </h3>
              <form
                onSubmit={handleSubmit(onProfileUpdate)}
                className="space-y-4"
              >
                <Input
                  label="Full Name"
                  placeholder="Your full name"
                  {...register("name")}
                />
                <Input
                  label="Email Address"
                  value={user?.email || ""}
                  readOnly
                  className="cursor-not-allowed opacity-60"
                />
                <p className="text-xs text-slate-400 dark:text-slate-500 -mt-2">
                  Email address cannot be changed.
                </p>
                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    "Saving…"
                  ) : (
                    <>
                      <Check size={15} /> Save Changes
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="p-6">
              <h3 className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-white">
                <KeyRound size={15} className="text-slate-500" /> Security
                Settings
              </h3>
              <form
                onSubmit={handleSubmit(onPasswordChange)}
                className="space-y-4"
              >
                <Input
                  label="Current Password"
                  type="password"
                  placeholder="Enter current password"
                  {...register("oldPassword")}
                />
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  {...register("newPassword")}
                />
                <Button type="submit" variant="secondary" disabled={loading}>
                  {loading ? (
                    "Updating…"
                  ) : (
                    <>
                      <Lock size={14} /> Change Password
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
