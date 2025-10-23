import { aiEvaluationService } from "../../services/aiEvaluation.service.js";

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

