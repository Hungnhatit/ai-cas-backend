import PhanTichDanhGia from "../../model/competency/phan_tich-danh_gia.model.js";
import ChiTietDanhGia from "../../model/competency/review-detail.model.js";
import KetQuaAI from "../../model/result/result.model.js";
import KetQuaDanhGia from "../../model/result/results.model.js";
import { aiEvaluationService } from "../../services/aiEvaluation.service.js";

/**
 * Generate review for mutiple choices test
 */
export const evaluate = async (req, res) => {
  try {
    const { ma_lan_lam } = req.body;
    if (!ma_lan_lam)
      return res.status(400).json({ message: "Thiếu mã lần làm bài" });

    const result = await aiEvaluationService.evaluateWithGemini(ma_lan_lam);
    return res.status(200).json({
      message: "Đánh giá AI thành công",
      data: result,
    });

  } catch (error) {
    console.error("❌ Lỗi đánh giá AI:", error);
    return res.status(500).json({
      message: "Lỗi khi đánh giá bằng AI",
      error: error.message,
    });
  }
};

/**
 * Generate review for prompt test
 */
export const evaluatePrompt = async (req, res) => {

}

/**
 * Generate review for situation test
 */
export const evaluateSituation = async (req, res) => {

}


/**
 * Get result of a specific attempt
 */
export const getAIResult = async (req, res) => {
  try {
    const { result_id } = req.params;
    const result = await KetQuaAI.findByPk(result_id);
    if (!result) {
      return res.status(404).json({
        message: 'Result not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Found 1 result',
      data: result
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

/**
 * Get result detail by attempt ID
 */
export const getReviewByAttemptID = async (req, res) => {
  try {
    const { attempt_id } = req.params;

    const result = await KetQuaDanhGia.findOne({
      where: { ma_lan_lam: attempt_id },
      include: [
        { model: ChiTietDanhGia, as: 'chi_tiet_danh_gia' },
        { model: PhanTichDanhGia, as: 'phan_tich' }
      ]
    });

    if (!result) {
      return res.status(404).json({
        message: 'Result not found!'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetched result successfully!`,
      data: result
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Internal Server Error:  ${error.message}`
    })
  }
}