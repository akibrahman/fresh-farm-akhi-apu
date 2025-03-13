// @desc: Middleware to protect routes that require private access
const protectMiddleware = (access) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Not authenticated. Please login to access this area.",
      });
    }
    if (access === "admin" && !user.isAdmin) {
      return res.status(403).json({
        status: "failed",
        message: "You are not allowed to perform this action.",
      });
    }
    next();
  };
};

export default protectMiddleware;
