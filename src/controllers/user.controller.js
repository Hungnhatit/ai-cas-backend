import NguoiDung from "../model/auth/user.model.js"
import bcrypt from 'bcrypt';

/**
 * Get all users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await NguoiDung.findAll();

    if (!users) {
      return res.status(404).json({
        message: 'No users found'
      })
    }

    return res.status(200).json({
      success: true,
      message: `${users.length} users found`,
      data: users
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

    return res.status(400).json({
      sucess: true,
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
 */
export const updateUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { ten, email, mat_khau, so_dien_thoai, vai_tro, trang_thai } = req.body;
    const user = await NguoiDung.findByPk(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID=${user_id} not found`
      });
    }

    if (mat_khau) {
      user.mat_khau = await bcrypt.hash(mat_khau, 10);
    }

    await user.update({
      ten: ten || user.ten,
      email: email || user.email,
      so_dien_thoai: so_dien_thoai || user.so_dien_thoai,
      vai_tro: vai_tro || user.vai_tro,
      trang_thai: trang_thai || user.trang_thai,
    });

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: user,
    });

  } catch (error) {
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
    const { id } = req.params;

    const user = await NguoiDung.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found.`,
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
    const { id } = req.params;

    const user = await NguoiDung.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User with ID ${id} not found.`,
      });
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: `User with ID ${id} permanently deleted.`,
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