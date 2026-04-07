import ApiError from "../utils/ApiError.js";

authorizeRoles = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "Access denied");
    }

    next();
  };
};

export default authorizeRoles;
