import LanLamBaiKiemTra from "../../model/test/test-attempt.model.js"
import LuaChonTracNghiem from "../../model/test/test-multichoice-option.model.js";
import CauHoiTracNghiem from "../../model/test/test-multichoice.model.js";
import CauHoi from "../../model/test/test-question.model.js";
import PhanKiemTra from "../../model/test/test-section.model.js";
import CauTraLoiHocVien from "../../model/test/test-student-answer.model.js";
import BaiKiemTra from "../../model/test/test.model.js";
import { aiEvaluationService } from "../../services/aiEvaluation.service.js";

export const testResultEvaluate = async (req, res) => {
  try {
    const { attempt_id } = req.params;
    const attempts = await LanLamBaiKiemTra.findByPk(attempt_id, {
      include: [
        { model: CauTraLoiHocVien, as: 'cau_tra_loi_hoc_vien' }
      ]
    });

    if (!attempts) {
      return res.status(404).json({
        message: 'Attempt not found'
      });
    }

    const tests = await BaiKiemTra.findByPk(attempts.ma_kiem_tra, {
      include: [
        {
          model: PhanKiemTra, as: 'phan_kiem_tra', include: [
            {
              model: CauHoi, as: 'cau_hoi', include: [
                {
                  model: CauHoiTracNghiem, as: 'cau_hoi_trac_nghiem', include: [
                    { model: LuaChonTracNghiem, as: 'lua_chon_trac_nghiem', attributes: ['ma_lua_chon', 'ma_cau_hoi_trac_nghiem', 'la_dap_an_dung', 'noi_dung'] }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    const answerMap = {};
    const questionAnswers = {};
    const studentAnswerMap = [];

    attempts.cau_tra_loi_hoc_vien.forEach((answer) => {
      tests.phan_kiem_tra.forEach((section) => {
        section.cau_hoi.forEach((question) => {
          if (question.loai_cau_hoi === 'trac_nghiem' && question.cau_hoi_trac_nghiem) {
            const option = question.cau_hoi_trac_nghiem.lua_chon_trac_nghiem.find(
              (lc) => lc.ma_lua_chon.toString() === answer.tra_loi.toString()
            );
            if (option) {
              answerMap[answer.ma_cau_hoi] = option.noi_dung;
            }
          } else if (question.loai_cau_hoi === 'tu_luan') {
            answerMap[answer.ma_cau_hoi] = answer.tra_loi;
          }
        });
      });
    });

    tests.phan_kiem_tra.forEach((section) => {
      section.cau_hoi.forEach((question) => {
        let correct = null;
        let allQuestionOption = [];

        let allOptions = [];

        if (question.loai_cau_hoi === 'trac_nghiem' && question.cau_hoi_trac_nghiem) {
          const correctOption = question.cau_hoi_trac_nghiem.lua_chon_trac_nghiem.find((option) => option.la_dap_an_dung === 1);
          if (correctOption) {
            correct = correctOption.noi_dung;
          }
          allQuestionOption = question.cau_hoi_trac_nghiem.lua_chon_trac_nghiem.map((opt) => ({
            ma_lua_chon: opt.ma_lua_chon,
            noi_dung: opt.noi_dung,
            la_dap_an_dung: opt.la_dap_an_dung
          }));

          question.cau_hoi_trac_nghiem.lua_chon_trac_nghiem.forEach((option) => {
            allOptions.push(option.noi_dung);
          })
        } else if (question.loai_cau_hoi === 'tu_luan' && question.cau_hoi_tu_luan) {
          correct = question.cau_hoi_tu_luan.giai_thich_dap_an || null;
        }

        studentAnswerMap.push({
          'Câu hỏi': question.tieu_de,
          'Các lựa chọn': allOptions,
          'Đáp án đúng của câu hỏi': correct,
          'Câu trả lời của học viên': answerMap[question.ma_cau_hoi] || null
        })
      })
    })



    return res.status(200).json({
      success: true,
      message: 'Fetch successfully!',
      data: studentAnswerMap
    })
  } catch (error) {

  }
}

export const testAttemptResultEvaluate = async (req, res) => {
  try {
    const { ma_lan_lam } = req.body;
    if (!ma_lan_lam)
      return res.status(400).json({ message: "Missing attempt_id" });

    const result = await aiEvaluationService.testResultEvaluate(ma_lan_lam);
    return res.status(200).json({
      message: "Evaluate test result successfully",
      data: result,
    });

  } catch (error) {
    console.error("Error when evaluating test result:", error);
    return res.status(500).json({
      message: "Error when evaluating test result",
      error: error.message,
    });
  }
}