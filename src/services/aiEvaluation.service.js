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
        console.log((JSON.parse(q.lua_chon))[q.dap_an_dung])
        return `
          ${index + 1}. [${q.loai}] Câu hỏi: ${q.cau_hoi}\n
          Đáp án đúng: ${(JSON.parse(q.lua_chon))[ans]}\n
          Câu trả lời của học viên: ${(JSON.parse(q.lua_chon))[ans]}
        `;
      })
      .join("\n\n");

    if (!qaPairs.trim()) {
      throw new Error("Không có dữ liệu câu hỏi/trả lời hợp lệ để đánh giá");
    }

    console.log(qaPairs)

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

        Trả về **chính xác format JSON object**, không thêm ký tự, không thêm giải thích.
        Format:
        {
          "hieu_biet_ai": <float>,
          "ung_dung_cong_cu": <float>,
          "tu_duy_sang_tao": <float>,
          "dao_duc_ai": <float>,
          "tong_diem": <float>,
          "xep_loai": "beginner|intermediate|advanced",
          "nhan_xet": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng",
          "phan_tich": {
            "diem_manh": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: phân tích chi tiết các điểm mạnh nổi bật, có ví dụ minh họa nếu có",
            "diem_yeu": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: phân tích chi tiết các điểm hạn chế, cần cải thiện, nêu nguyên nhân cụ thể",            
            "hieu_biet_ai": {
              "diem": "<float>",
              "mo_ta": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: mức độ hiểu biết về AI, mô hình, khái niệm, và nguyên lý hoạt động",
              "nhan_xet_chi_tiet": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: giải thích cụ thể vì sao đạt điểm này"
            },
            "ung_dung_cong_cu": {
              "diem": "<float>",
              "mo_ta": "<chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: đánh giá khả năng sử dụng các công cụ AI (ChatGPT, Midjourney, Claude, v.v.) để giải quyết vấn đề",
              "nhan_xet_chi_tiet": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng"
            },
            "tu_duy_sang_tao": {
              "diem": "<float>",
              "mo_ta": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: đánh giá sự sáng tạo, linh hoạt trong cách ứng dụng AI hoặc phát triển ý tưởng mới",
              "nhan_xet_chi_tiet": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng"
            },
            "dao_duc_ai": {
              "diem": "<float>",
              "mo_ta": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: nhận thức và hành vi đạo đức khi dùng AI: bản quyền, minh bạch, tính trách nhiệm",
              "nhan_xet_chi_tiet": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng"
            },
            "ky_nang_phan_tich_du_lieu": {
              "diem": "<float>",
              "mo_ta": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: (Tuỳ chọn) Đánh giá khả năng hiểu, xử lý, và diễn giải dữ liệu AI",
              "nhan_xet_chi_tiet": "<string>"
            },
            "tu_danh_gia_va_tu_hoc": {
              "diem": "<float>",
              "mo_ta": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: (Tuỳ chọn) Đánh giá khả năng tự phản tư, tự cải thiện và học hỏi từ phản hồi của AI",
              "nhan_xet_chi_tiet": "<string>"
            }
            "de_xuat_cai_thien": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: dựa vào các đánh giá trên, hãy tóm tắt chi tiết hướng khắc phục hoặc cải thiện năng lực"
          },
          "goi_y_hoc_tap": {
            "huong_phat_trien": "chuỗi nhận xét đầy đủ, chi tiết, rõ ràng: Hướng học tập hoặc chuyên ngành AI phù hợp để phát triển thêm",
            "ke_hoach_hanh_dong": {
              "ngan_han": "kế hoạch hành động trong 1–3 tháng",
              "dai_han": "kế hoạch hành động trong 6–12 tháng"
            },
            "tai_nguyen_de_xuat": [
              {
                "ten": "Tên tài nguyên hoặc khoá học",
                "loai": "video | khoa_hoc | sach | cong_cu | bai_viet",
                "link": "URL hoặc nguồn tài nguyên"
              }
            ]
          },
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

    // 6️⃣ save result to DB
    const ketQua = await KetQuaAI.create({
      ma_lan_lam,
      ...parsed,
    });

    return ketQua;
  },
};
