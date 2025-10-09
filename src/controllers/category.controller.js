import { pool } from "../config/database.js";

export const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM danh_muc");
    return res.status(200).json({
      success: true,
      message: 'Successfully',
      data: rows,
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'No category found'
    })
  }
}