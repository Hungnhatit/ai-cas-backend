import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Instructor from "../model/instructor/instructor.model.js";
import Student from "../model/student/student.model.js";
import User from '../model/auth/user.model.js';

/**
 * Get student by instructor ID
 */
export const getStudentsByInstructorId = async (req, res) => {
  try {
    const { ma_giang_vien } = req.params;

    if (!ma_giang_vien) {
      return res.status(400).json({ message: 'ma_giang_vien is required!' });
    }

    const instructor = await Instructor.findByPk(ma_giang_vien, {
      include: [
        { model: Student, as: 'hoc_vien' }
      ]
    });

    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found!' });
    }

    return res.status(200).json({
      success: true,
      data: instructor
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: `Failed to fetch students: ${error}` });
  }
}

/**
 * Create student
 */
export const createStudent = async (req, res) => {
  try {
    const { name, email, mat_khau, avatar, role } = req.body;
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    const newUser = await User.create({
      name,
      email,
      role,
      mat_khau: hashedPassword,
    });

    if (role === 'student') {
      await Student.create({
        name,
        email
      });
    }

    if (role === 'instructor') {
      await Instructor.create({
        name,
        email,
        bio: ''
      })
    }

    const token = jwt.sign(
      { ma_nguoi_dung: newUser.ma_nguoi_dung, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '5d' }
    )

    return res.status(201).json({
      message: 'User registered successfully!',
      user: newUser,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: `Error when creating a new student: ${error}`
    })
  }
}