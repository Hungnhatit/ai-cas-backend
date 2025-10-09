import LanLamBaiKiemTra from "../../model/test/test-attemtp.model.js";

/**
 * Start test attempt
 * Description: start test attempt, set status to in-progress
 */
export const startTestAttempt = async (req, res) => {
  try {
    const { test_id, student_id } = req.body;

    if (!test_id || !student_id) {
      return res.status(400).json({
        success: false,
        message: 'test_id and student_id is required'
      });
    }

    const attempt = await LanLamBaiKiemTra.create({
      ma_kiem_tra: test_id,
      ma_hoc_vien: student_id,
      thoi_gian_bat_dau: new Date(),
      thoi_gian_ket_thuc: null,
      trang_thai: 'dang_lam'
    });

    res.status(201).json({
      success: true,
      data: attempt
    })

  } catch (error) {
    console.error("Error starting test attempt:", error);
    res.status(500).json({ message: "Failed to start test attempt" });
  }
}