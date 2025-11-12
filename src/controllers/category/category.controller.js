import { pool } from "../../config/database.js";
import DanhMucBaiKiemTra from "../../model/category.model.js";

export const getAllCategories = async (req, res) => {
  try {
    const cates = await DanhMucBaiKiemTra.findAll({
      order: [['ngay_tao', 'DESC']]
    });

    if (!cates || cates.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found in the database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${cates.length} categories retrieved successfully.`,
      data: cates,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching categories.",
      error: error.message,
    });
  }
}