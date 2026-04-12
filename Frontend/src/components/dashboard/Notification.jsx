import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markNotificationRead,
  deleteNotification,
} from "../../redux/slices/dashboardSlice";
import { motion } from "framer-motion";
import { Bell, Trash2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 6;

const Notifications = () => {
  const dispatch = useDispatch();

  const { notifications } = useSelector((state) => state.dashboard);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);

  const paginatedNotifications = notifications.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handleRead = async (id) => {
    try {
      await dispatch(markNotificationRead(id)).unwrap();
      toast.success("Marked as read");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success("Deleted");
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white">
          <Bell className="text-cyan-400" />
          Notifications
        </h2>

        {paginatedNotifications.length === 0 ? (
          <div className="rounded-2xl bg-white/5 p-8 text-center text-gray-400">
            No notifications found
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedNotifications.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl border p-4 ${
                  item.isRead
                    ? "border-white/10 bg-white/5"
                    : "border-cyan-400/30 bg-cyan-400/10"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-300">{item.message}</p>

                    <p className="mt-2 text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    {!item.isRead && (
                      <button
                        onClick={() => handleRead(item._id)}
                        className="rounded-xl bg-cyan-500 p-2 hover:bg-cyan-600"
                      >
                        <CheckCircle2 size={18} className="text-white" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-xl bg-red-500 p-2 hover:bg-red-600"
                    >
                      <Trash2 size={18} className="text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-3">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`rounded-xl px-4 py-2 ${
                page === index + 1
                  ? "bg-cyan-500 text-white"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
