// import genAI from "../utils/geminiClient.js";
// import LanLamBaiKiemTra from "../model/test/test-attempt.model.js";
// import CauHoiKiemTra from "../model/test/test-question.model.js";
// import BaiKiemTra from "../model/test/test.model.js";
// import KetQuaAI from "../model/result/result.model.js";

// export const aiEvaluationService = {
//   async evaluateWithGemini(ma_lan_lam) {
//     // 1️⃣ Lấy dữ liệu bài làm
//     const lanLam = await LanLamBaiKiemTra.findByPk(ma_lan_lam);
//     if (!lanLam) throw new Error("Không tìm thấy lần làm bài");

//     const { ma_kiem_tra, cau_tra_loi } = lanLam;
//     const baiKiemTra = await BaiKiemTra.findByPk(ma_kiem_tra);
//     if (!baiKiemTra) throw new Error("Không tìm thấy bài kiểm tra");

//     const cauHoiList = await CauHoiKiemTra.findAll({
//       where: { ma_bai_kiem_tra: ma_kiem_tra },
//     });

//     // 2️⃣ Ghép câu hỏi & câu trả lời
//     const answers = cau_tra_loi || {};
//     const qaPairs = cauHoiList
//       .filter((q) => q.loai === "trac_nghiem" || q.loai === "tu_luan")
//       .map((q, idx) => {
//         const ans = answers[q.ma_cau_hoi] || "(Chưa trả lời)";
//         return `${idx + 1}. Câu hỏi: ${q.cau_hoi}\n   Trả lời: ${ans}`;
//       })
//       .join("\n\n");

//     if (!qaPairs.trim()) {
//       throw new Error("Không có câu hỏi hoặc câu trả lời hợp lệ để đánh giá");
//     }

//     // 3️⃣ Prompt gửi Gemini
//     const prompt = `
//       Bạn là chuyên gia đánh giá năng lực sử dụng công cụ AI của sinh viên.
//       Dưới đây là danh sách câu hỏi và câu trả lời:

//       ${qaPairs}

//       Hãy đánh giá theo 4 tiêu chí (thang điểm 0–10):
//       1. Hiểu biết về AI (hieu_biet_ai)
//       2. Ứng dụng công cụ AI (ung_dung_cong_cu)
//       3. Tư duy sáng tạo (tu_duy_sang_tao)
//       4. Đạo đức AI (dao_duc_ai)

//       Trả về JSON với format:
//       {
//         "hieu_biet_ai": <float>,
//         "ung_dung_cong_cu": <float>,
//         "tu_duy_sang_tao": <float>,
//         "dao_duc_ai": <float>,
//         "tong_diem": <float>,
//         "xep_loai": "beginner | intermediate | advanced",
//         "nhan_xet": "chuỗi nhận xét ngắn gọn"
//       }
//     `;

//     // 4️⃣ Gọi API Gemini (SDK mới)
//     const response = await genAI.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//     });

//     // 5️⃣ Lấy text từ phản hồi
//     const text = response.output_text?.trim() || "";

//     // 6️⃣ Parse JSON từ output
//     let parsed;
//     try {
//       parsed = JSON.parse(text);
//     } catch (e) {
//       console.error("⚠️ Gemini trả về format không hợp lệ:", text);
//       throw new Error("Không thể phân tích phản hồi từ Gemini");
//     }

//     // 7️⃣ Lưu kết quả vào DB
//     const ketQua = await KetQuaAI.create({
//       ma_lan_lam,
//       ...parsed,
//     });

//     return ketQua;
//   },
// };

import genAI from "../utils/geminiClient.js";
import LanLamBaiKiemTra from "../model/test/test-attempt.model.js";
import CauHoiKiemTra from "../model/test/test-question.model.js";
import BaiKiemTra from "../model/test/test.model.js";
import KetQuaAI from "../model/result/result.model.js";

export const aiEvaluationService = {
  async evaluateWithGemini(ma_lan_lam) {
    // 1️⃣ Lấy dữ liệu bài làm
    const lanLam = await LanLamBaiKiemTra.findByPk(ma_lan_lam);
    if (!lanLam) throw new Error("Không tìm thấy lần làm bài");

    const { ma_kiem_tra, cau_tra_loi } = lanLam;
    const baiKiemTra = await BaiKiemTra.findByPk(ma_kiem_tra);
    if (!baiKiemTra) throw new Error("Không tìm thấy bài kiểm tra");

    const cauHoiList = await CauHoiKiemTra.findAll({
      where: { ma_bai_kiem_tra: ma_kiem_tra },
    });

    // 2️⃣ Ghép câu hỏi & câu trả lời
    const answers = cau_tra_loi ? JSON.parse(cau_tra_loi) : {};
    const qaPairs = cauHoiList
      .map((q, index) => {
        const ans = answers[q.ma_cau_hoi] ?? "(Chưa trả lời)";
        // console.log(q.dataValues)
        return `${index + 1}. [${q.loai}] Câu hỏi: ${q.cau_hoi}\n   Trả lời: ${ans}`;
      })
      .join("\n\n");

    if (!qaPairs.trim()) {
      throw new Error("Không có dữ liệu câu hỏi/trả lời hợp lệ để đánh giá");
    }

    // console.log(cauHoiList)
    // console.log(typeof answers)
    // console.log(answers[])
    // console.log(qaPairs)
      // 3️⃣ Prompt gửi Gemini
      const prompt = `
        Bạn là chuyên gia đánh giá năng lực sử dụng công cụ AI của sinh viên.

        Dưới đây là danh sách câu hỏi và câu trả lời của sinh viên:
        ${qaPairs}

        Hãy đánh giá năng lực của sinh viên theo 4 tiêu chí (thang điểm 0–10):
        1. Hiểu biết về AI (hieu_biet_ai)
        2. Ứng dụng công cụ AI (ung_dung_cong_cu)
        3. Tư duy sáng tạo (tu_duy_sang_tao)
        4. Đạo đức AI (dao_duc_ai)

        Tính "tong_diem" là trung bình 4 tiêu chí.
        Xếp loại (xep_loai):
        - beginner: <5
        - intermediate: 5–7.9
        - advanced: ≥8

        Trả về **chính xác 1 JSON object duy nhất**, không thêm ký tự, không thêm giải thích.
        Format:
        {
          "hieu_biet_ai": <float>,
          "ung_dung_cong_cu": <float>,
          "tu_duy_sang_tao": <float>,
          "dao_duc_ai": <float>,
          "tong_diem": <float>,
          "xep_loai": "beginner|intermediate|advanced",
          "nhan_xet": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng"
        }
        `;

      // 4️⃣ Gọi Gemini API (đúng chuẩn @google/genai)
      let text = "";
      try {
        const response = await genAI.models.generateContent({
          model: "gemini-2.5-flash", // Adjust model name as needed
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        });

        text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
        if (!text) {
          console.error("⚠️ Không có phản hồi text từ Gemini:", response);
          throw new Error("Gemini không trả về nội dung");
        }
      } catch (error) {
        console.error("❌ Lỗi gọi Gemini API:", error);
        throw new Error("Không thể kết nối với Gemini API");
      }

      // 5️⃣ Parse JSON
      const tryParseJSON = (str) => {
        const match = str.match(/\{[\s\S]*\}/);
        if (!match) return null;
        try {
          return JSON.parse(match[0]);
        } catch {
          return null;
        }
      };

      let parsed = tryParseJSON(text);

      if (!parsed) {
        console.warn("⚠️ Gemini trả về format sai, thử lại lần 2...");
        const retryPrompt =
          prompt +
          "\n\n⚠️ Lưu ý: Hãy chỉ trả về JSON, không thêm bất kỳ chữ nào khác.";

        const retryResponse = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            {
              role: "user",
              parts: [{ text: retryPrompt }],
            },
          ],
        });

        const retryText = retryResponse.output?.[0]?.content?.[0]?.text?.trim() || "";
        parsed = tryParseJSON(retryText);

        if (!parsed) {
          console.error("⚠️ Gemini trả về format không hợp lệ:", retryText);
          throw new Error("Không thể phân tích phản hồi từ Gemini");
        }
      }

      // 6️⃣ Lưu kết quả vào DB
      const ketQua = await KetQuaAI.create({
        ma_lan_lam,
        ...parsed,
      });

      return ketQua;
  },
};
