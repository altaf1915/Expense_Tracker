import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!Types.ObjectId.isValid(decoded.id)) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = { id: decoded.id };
    next();
  } catch (_error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default authMiddleware;
