import NguoiDung from "../model/auth/user.model.js"
import bcrypt from 'bcrypt';
import fs from 'fs';
import { uploadMedia } from "../helpers/cloudinary.js";
import Student from "../model/student/student.model.js";
import GiangVien from "../model/instructor/instructor.model.js";
import { sequelize } from "../config/database.js";

/**
 * Get all users
 * Description: retrieve a list of users
 */
export const getUsers = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: users } = await NguoiDung.findAndCountAll({
      limit,
      offset,
      order: [['ngay_tao', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    if (!users) {
      return res.status(404).json({
        message: 'No users found'
      })
    }

    return res.status(200).json({
      success: true,
      message: `${users.length} users found`,
      data: users,
      pagination: {
        totalUsers: count,
        totalPages,
        currentPage: page,
        pageSize: limit
      }
    })
  } catch (error) {
    console.log(error);
    res.status(404).json({
      sucess: false,
      message: `Error fetching users: ${error}`
    });
  }
}

/**
 * Get specific user
 * Description: retrieve user details by ID
 */
export const getUserById = async (req, res) => {
  const { user_id } = req.params;

  const user = await NguoiDung.findByPk(user_id);

  try {
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID=${user_id} not found`
      })
    }

    return res.status(200).json({
      success: true,
      message: 'User found successfully',
      data: user
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching user.",
      error: error.message,
    });
  }
}

/**
 * Update user
 * Description: update user information
 */
export const updateUser = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { user_id } = req.params;
    const { ten, email, mat_khau, so_dien_thoai, vai_tro, trang_thai, tieu_su, truong } = req.body;
    const userCommon = await NguoiDung.findByPk(user_id);

    if (!userCommon) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: `User with ID=${user_id} not found`
      });
    }

    const role = userCommon.vai_tro;
    let userSpecific = null;
    let isInstructor = false;

    if (role === "instructor" || role === "giang_vien") {
      isInstructor = true;
      userSpecific = await GiangVien.findOne({ where: { ma_giang_vien: user_id } });
    } else {
      userSpecific = await Student.findOne({ where: { ma_hoc_vien: user_id } });
    }

    let anh_dai_dien_url = userSpecific ? userSpecific.anh_dai_dien : null;

    if (req.file) {
      try {
        const uploadResult = await uploadMedia(req.file.path);
        anh_dai_dien_url = uploadResult.secure_url;
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        await t.rollback();
        return res.status(500).json({ success: false, message: "Error uploading avatar." });
      }
    }

    let hashedPassword = userCommon.mat_khau;
    if (mat_khau) {
      hashedPassword = await bcrypt.hash(mat_khau, 10);
    }

    await userCommon.update({
      ten: ten || userCommon.ten,
      email: email || userCommon.email,
      so_dien_thoai: so_dien_thoai || userCommon.so_dien_thoai,
      mat_khau: hashedPassword,
      trang_thai: trang_thai || userCommon.trang_thai,
      ngay_cap_nhat: new Date(),
      anh_dai_dien: anh_dai_dien_url || userCommon.anh_dai_dien,
      tieu_su: tieu_su || userCommon.tieu_su
    });

    if (userSpecific) {
      if (isInstructor) {
        await userSpecific.update({
          anh_dai_dien: anh_dai_dien_url,
          tieu_su: tieu_su || userSpecific.tieu_su,
          truong: truong || userSpecific.truong,
        }, { transaction: t });
      } else {
        await userSpecific.update({
          anh_dai_dien: anh_dai_dien_url,
        }, { transaction: t });
      }
    } else {
      console.warn(`Specific profile not found for user_id ${user_id} with role ${role}`);
    }

    await t.commit();

    const updatedUser = {
      ...userCommon.toJSON(),
      ...(userSpecific ? userSpecific.toJSON() : {})
    };

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: updatedUser,
    });

  } catch (error) {
    await t.rollback();
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating user.",
      error: error.message,
    });
  }
}

/**
 * Soft delete user (mark as inactive)
 * Description: 
 */
export const softDeleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await NguoiDung.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID=${user_id} not found.`,
      });
    }

    if (user.trang_thai === "ngung_hoat_dong") {
      return res.status(400).json({
        success: false,
        message: "User is already inactive.",
      });
    }

    await user.update({ trang_thai: "ngung_hoat_dong" });

    return res.status(200).json({
      success: true,
      message: "User soft deleted (status set to inactive).",
      data: user,
    });
  } catch (error) {
    console.error("Error soft deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while soft deleting user.",
      error: error.message,
    });
  }
};

/**
 * Restore soft-deleted user
 */
export const restoreUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await NguoiDung.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${user_id} not found.`,
      });
    }

    if (user.trang_thai === "dang_hoat_dong") {
      return res.status(400).json({
        success: false,
        message: "User is already active.",
      });
    }

    await user.update({ trang_thai: "dang_hoat_dong" });

    return res.status(200).json({
      success: true,
      message: "User restored successfully (status set to active).",
      data: user,
    });
  } catch (error) {
    console.error("Error restoring user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while restoring user.",
      error: error.message,
    });
  }
};

/**
 * Permanently delete user (force delete)
 */
export const forceDeleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await NguoiDung.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${user_id} not found.`,
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: `User with ID ${user_id} permanently deleted.`,
    });
  } catch (error) {
    console.error("Error force deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while force deleting user.",
      error: error.message,
    });
  }
};