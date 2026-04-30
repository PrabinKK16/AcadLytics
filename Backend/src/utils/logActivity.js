import ActivityLog from "../models/activityLog.model.js";

const logActivity = async ({ user, action, metadata = {} }) => {
  ActivityLog.create({
    user,
    action,
    metadata,
  }).catch((err) => {
    console.error("[logActivity] Failed to log activity:", err.message);
  });
};

export default logActivity;
