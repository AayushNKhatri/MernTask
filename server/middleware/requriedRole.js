export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.status(403).json({ message: "Forbidden: Invalid role" });
    }
    next();
  };
};
