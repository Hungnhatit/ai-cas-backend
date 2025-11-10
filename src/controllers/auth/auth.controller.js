import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from '../../model/student/student.model.js'
import User from '../../model/auth/user.model.js';
import Instructor from "../../model/instructor/instructor.model.js";
import NguoiDung from "../../model/auth/user.model.js";

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
    const { ten, email, mat_khau, avatar, vai_tro } = req.body;
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
        bio: ''
      })
    }

    const token = jwt.sign(
      { ma_nguoi_dung: newUser.ma_nguoi_dung, email: newUser.email, vai_tro: newUser.vai_tro },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '5d' }
    )

    return res.status(201).json({
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
        vai_tro: user.vai_tro
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};