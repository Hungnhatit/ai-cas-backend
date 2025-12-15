import PhanTichDanhGia from "../../model/competency/phan_tich-danh_gia.model.js";
import KetQuaDanhGia from "../../model/result/results.model.js";

/**
 * Get analytical information for the test
 */
export const getAnalyticAttemptReview = async (req, res) => {
  try {
    const { attempt_id } = req.params;

    const review = await KetQuaDanhGia.findOne({
      where: { ma_lan_lam: attempt_id }, include: [
        { model: PhanTichDanhGia, as: 'phan_tich_danh_gia' }
      ]
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Fetched successfully!'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`
    })
  }
}