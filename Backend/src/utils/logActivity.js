import ActivityLog from "../models/activityLog.model.js";

const logActivity = async ({ user, action, metadata = {} }) => {
  await ActivityLog.create({
    user,
    action,
    metadata,
  });
};

export default logActivity;
