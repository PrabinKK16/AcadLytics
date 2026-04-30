import ApiError from "../utils/ApiError.js";

const authorizeRoles = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Access denied"));
    }
    next();
  };
};

export default authorizeRoles;
