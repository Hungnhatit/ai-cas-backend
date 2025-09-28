import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from '../../model/auth/user.model.js';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "mysecret";

/**
 * Register an accout
 */
export const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // check trùng email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "student"   // nếu không truyền thì mặc định là student
    });

    return res.status(201).json({
      message: "User created",
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // tìm user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // tạo token kèm role
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};