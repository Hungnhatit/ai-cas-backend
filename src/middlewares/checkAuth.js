import jwt from "jsonwebtoken";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "mysecret";

// check login
export const authenticate = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded; // { user_id, email, type }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// check quyền cụ thể
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.type)) {
      return res.status(403).json({ message: "Forbidden: insufficient rights" });
    }
    next();
  };
};

export const authMiddleware = (req, res, next) => {
  // Lấy token từ header
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); 
    // Gắn thông tin user vào request
    req.user = decoded;

    // Cho đi tiếp
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
