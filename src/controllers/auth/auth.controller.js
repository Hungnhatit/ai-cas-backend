import bcrypt from "bcrypt";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import Student from '../../model/student/student.model.js'
import User from '../../model/auth/user.model.js';
import Instructor from "../../model/instructor/instructor.model.js";
import NguoiDung from "../../model/auth/user.model.js";
import { Op } from "sequelize";
import { sendResetPasswordEmail } from "../../services/email.service.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "mysecret";

/**
 * Register an accout
 */
// export const signup = async (req, res) => {
//   try {
//     const { ten, email, mat_khau, vai_tro } = req.body;

//     // check trùng email
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already in use" });
//     }

//     // hash mat_khau
//     const hashedmat_khau = await bcrypt.hash(mat_khau, 10);

//     // tạo user
//     const newUser = await User.create({
//       ten,
//       email,
//       mat_khau: hashedmat_khau,
//       vai_tro: vai_tro || "student"   // nếu không truyền thì mặc định là student
//     });

//     return res.status(201).json({
//       message: "User created",
//       user: {
//         ma_nguoi_dung: newUser.ma_nguoi_dung,
//         ten: newUser.ten,
//         email: newUser.email,
//         vai_tro: newUser.vai_tro
//       }
//     });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

export const register = async (req, res) => {
  try {
    const { ten, email, mat_khau, avatar, so_dien_thoai, vai_tro } = req.body;
    const existingUser = await NguoiDung.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    const hashedPasword = await bcrypt.hash(mat_khau, 10);

    const newUser = await NguoiDung.create({
      ten,
      email,
      vai_tro,
      so_dien_thoai,
      mat_khau: hashedPasword,
    });

    if (vai_tro === 'student') {
      await Student.create({
        ma_hoc_vien: newUser.ma_nguoi_dung,
        ten,
        email,
        mat_khau: hashedPasword,
      });
    }

    if (vai_tro === 'instructor') {
      await Instructor.create({
        ma_giang_vien: newUser.ma_nguoi_dung,
        ten,
        email,
        mat_khau: hashedPasword,
      })
    }

    const token = jwt.sign(
      { ma_nguoi_dung: newUser.ma_nguoi_dung, email: newUser.email, vai_tro: newUser.vai_tro },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '5d' }
    )

    return res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      user: newUser,
      token
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error when creating a new student: ${error}`
    })
  }
}


/**
 * Login
 * Description: 
 */
export const login = async (req, res) => {
  try {
    const { email, mat_khau } = req.body;

    // tìm user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or mat_khau" });
    }

    // check mat_khau
    const isMatch = await bcrypt.compare(mat_khau, user.mat_khau);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or mat_khau" });
    }

    // tạo token kèm vai_tro
    const token = jwt.sign(
      { ma_nguoi_dung: user.ma_nguoi_dung, email: user.email, vai_tro: user.vai_tro },
      JWT_SECRET_KEY,
      { expiresIn: "5d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        ma_nguoi_dung: user.ma_nguoi_dung,
        ten: user.ten,
        email: user.email,
        vai_tro: user.vai_tro,
        anh_dai_dien: user.anh_dai_dien
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
/**
 * Forgot password
 * Description:
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await NguoiDung.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not exist"
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.token_khoi_phuc_mat_khau = token;
    user.han_dat_mat_khau = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();


    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${token}`;

    await sendResetPasswordEmail(user.email, resetUrl);

    console.log("---------------------------------------------------");
    console.log("RESET PASSWORD LINK:", resetUrl);
    console.log("---------------------------------------------------");

    res.status(200).json({
      success: true,
      message: "Vui lòng kiểm tra email để đặt lại mật khẩu."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Lỗi server:  ${error}`
    });
  }
}

/**
 * Reset password
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    console.log('TOKEN: ', token)

    const user = await NguoiDung.findOne({
      where: {
        token_khoi_phuc_mat_khau: token,
        // han_dat_mat_khau: { [Op.gt]: new Date() }
      }
    });
    console.log('USER: ', user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn."
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    user.mat_khau = hashedPassword;
    user.token_khoi_phuc_mat_khau = null;
    user.han_dat_mat_khau = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server."
    });
  }
}