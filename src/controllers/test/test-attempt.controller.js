import { sequelize } from "../../config/database.js";
import LanLamBaiKiemTra from "../../model/test/test-attempt.model.js";
import LuaChonTracNghiem from "../../model/test/test-multichoice-option.model.js";
import CauHoiTracNghiem from "../../model/test/test-multichoice.model.js";
import LuaChonKhaoSat from "../../model/test/test-multiple-select-option.model.js";
import CauHoiKhaoSat from "../../model/test/test-multiple-select.model.js";
import CauHoiTuLuan from "../../model/test/test-prompt.model.js";
import CauHoi from "../../model/test/test-question.model.js";
import PhanKiemTraCauHoi from "../../model/test/test-section-question.model.js";
import PhanKiemTra from "../../model/test/test-section.model.js";
import CauTraLoiHocVien from "../../model/test/test-student-answer.model.js";
import BaiKiemTra from '../../model/test/test.model.js';

/**
 * Get all the tests the student has taken
 */
export const getTestsAttemptByStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const attempts = await LanLamBaiKiemTra.findAll({
      where: { ma_hoc_vien: student_id },
      attributes: ['ma_kiem_tra'],
      include: [
        { model: BaiKiemTra, as: 'bai_kiem_tra' }
      ],
      group: ['ma_kiem_tra']
    });

    const tests = attempts.map(item => item.bai_kiem_tra);

    return res.status(200).json({
      success: true,
      count: tests.length,
      data: tests
    });

  } catch (error) {
    console.error("Error get tests:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

/**
 * Get attempt by student ID
 * Description: student test history
 */
export const getAttemptByStudentID = async (req, res) => {
  try {
    const { student_id, test_id } = req.params;
    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'student_id is required'
      });
    }

    const attempts = await LanLamBaiKiemTra.findAll({
      where: {
        ma_hoc_vien: student_id,
        ma_kiem_tra: test_id
      },
      include: [
        { model: BaiKiemTra, as: 'bai_kiem_tra' }
      ],
      order: [['ngay_tao', 'DESC']]
    });

    if (!attempts) {
      return res.status(404).json({
        message: 'Attempt not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: `Fetch ${attempts.length} attempts`,
      data: attempts
    });
  } catch (error) {
    console.error("Error when fetch test attempt by student ID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching test attempt",
      error: error.message,
    });
  }
}


/**
 * Start test attempt
 * Description: start test attempt, set status to in-progress
 */
export const startTestAttempt = async (req, res) => {
  try {
    const { test_id, student_id } = req.body;
    const { answers } = req.body;

    // console.log(test_id, student_id);
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

/**
 * Submit test answer
 */
export const submitTestAnswers = async (req, res) => {
  try {
    const { testAttempt_id } = req.params;
    const { answers } = req.body;

    // console.log("ANSWERS: ", answers);

    const attempt = await LanLamBaiKiemTra.findByPk(testAttempt_id);

    if (!attempt) {
      return res.status(404).json({
        message: 'Attempt not found'
      })
    }

    const savePromises = Object.entries(answers).map(async ([ma_cau_hoi, tra_loi]) => {
      const existing = await CauTraLoiHocVien.findOne({
        where: {
          ma_lan_lam: attempt.ma_lan_lam,
          ma_cau_hoi: ma_cau_hoi
        }
      });

      if (existing) {
        return existing.update({ tra_loi });
      } else {
        return CauTraLoiHocVien.create({
          ma_lan_lam: attempt.ma_lan_lam,
          ma_cau_hoi: ma_cau_hoi,
          tra_loi,
          diem: 0
        })
      }
    });

    await Promise.all(savePromises);

    return res.status(200).json({
      success: true,
      message: 'Answers saved'
    });

  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ message: "Failed to submit answers" });
  }
}

/**
 * Submit test attempt and scoring
 */
export const submitTestAttempt = async (req, res) => {
  try {
    const { testAttempt_id } = req.params;

    if (!testAttempt_id) {
      return res.status(400).json({
        success: false,
        message: 'testAttempt_id is required'
      });
    }

    const attempt = await LanLamBaiKiemTra.findByPk(testAttempt_id, {
      include: [
        { model: CauTraLoiHocVien, as: 'cau_tra_loi_hoc_vien' }
      ]
    });

    if (!attempt) {
      return res.status(404).json({
        message: 'Attempt not found'
      });
    }

    if (attempt.trang_thai === 'da_nop') {
      return res.status(400).json({
        message: 'Attempt already submitted'
      });
    }

    // get test information with sections and questions
    const test = await BaiKiemTra.findByPk(attempt.ma_kiem_tra, {
      include: [
        {
          model: PhanKiemTra, as: 'phan_kiem_tra', include: [
            {
              model: PhanKiemTraCauHoi,
              as: 'phan_kiem_tra_cau_hoi',
              include: [
                {
                  model: CauHoi,
                  as: 'cau_hoi',
                  include: [
                    {
                      model: CauHoiTracNghiem,
                      as: 'cau_hoi_trac_nghiem',
                      include: [
                        { model: LuaChonTracNghiem, as: 'lua_chon_trac_nghiem' },
                      ]
                    },
                    {
                      model: CauHoiTuLuan,
                      as: 'cau_hoi_tu_luan'
                    },
                    {
                      model: CauHoiKhaoSat,
                      as: 'cau_hoi_nhieu_lua_chon',
                      include: [
                        { model: LuaChonKhaoSat, as: 'lua_chon' }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!test) {
      return res.status(404).json({
        message: 'Test not found'
      });
    }

    const userAnswers = {};
    (attempt.cau_tra_loi_hoc_vien || []).forEach((answer) => {
      userAnswers[answer.ma_cau_hoi] = answer.tra_loi;
    });

    let totalScore = 0;
    const savePromises = [];

    // console.log('TEST: ', test);

    test.phan_kiem_tra.forEach((section) => {
      section.phan_kiem_tra_cau_hoi.forEach((sectionQuestion, index) => {
        const question = sectionQuestion.cau_hoi;
        const userAnswer = userAnswers[question.ma_cau_hoi].toString() || '';
        let score = 0;

        /**
         * Process single-choice question
         */
        if (question.cau_hoi_trac_nghiem) {
          const correctChoice = question.cau_hoi_trac_nghiem.lua_chon_trac_nghiem.find((option) => option.la_dap_an_dung === 1);

          console.log("USER ANSWER: ", userAnswer, typeof userAnswer);
          console.log("CORRECT CHOICE: ", correctChoice.ma_lua_chon, typeof correctChoice.ma_lua_chon);          

          if (userAnswer === correctChoice.ma_lua_chon.toString()) {
            score = question.diem || 0;
            console.log('SCORE: ', score);
          }
        }

        /**
         * Process multiple-select question
         */
        if (question.cau_hoi_nhieu_lua_chon) {
          // Giả định: userAnswer là chuỗi JSON của mảng các ma_lua_chon đã chọn
          let selectedOptionIds = [];
          try {
            selectedOptionIds = JSON.parse(userAnswer);
          } catch (e) {
            // console.error("Invalid JSON answer for multiple choice:", userAnswer);
          }

          const allOptions = question.cau_hoi_nhieu_lua_chon.lua_chon || [];
          let correctAnswersCount = 0;
          let incorrectAnswersCount = 0;

          const correctOptions = allOptions.filter(opt => opt.la_dap_an_dung === 1);
          const totalCorrect = correctOptions.length;

          // Nếu không có câu trả lời nào được chọn thì điểm là 0
          if (selectedOptionIds.length === 0 && totalCorrect > 0) {
            score = 0;
          } else {
            // Tính điểm cho các lựa chọn đúng được chọn và lựa chọn sai không được chọn
            correctOptions.forEach(correctOpt => {
              if (selectedOptionIds.includes(correctOpt.ma_lua_chon)) {
                correctAnswersCount++;
              }
            });

            // Tính số lựa chọn sai mà người dùng chọn (chọn thừa)
            const incorrectSelected = selectedOptionIds.filter(id => {
              return !correctOptions.some(opt => opt.ma_lua_chon === id);
            });

            // Áp dụng công thức tính điểm phức tạp hơn (ví dụ: điểm tương ứng với tỷ lệ đáp án đúng)
            // Đây là công thức ví dụ: [Số đáp án đúng được chọn] / [Tổng số đáp án đúng] * [Tổng điểm câu hỏi]
            if (totalCorrect > 0) {
              score = Math.round((correctAnswersCount / totalCorrect) * question.diem);
            }

            // Nếu người dùng chọn bất kỳ đáp án sai nào, có thể trừ điểm (tùy theo logic nghiệp vụ)
            // Hoặc đơn giản: chỉ được điểm nếu tất cả các lựa chọn đúng được chọn VÀ không chọn lựa chọn sai nào.
            if (incorrectSelected.length > 0 || correctAnswersCount !== totalCorrect) {
              score = 0; // Nếu chọn sai hoặc thiếu thì 0 điểm (Logic nghiêm ngặt)
            } else if (correctAnswersCount === totalCorrect && incorrectSelected.length === 0) {
              score = question.diem || 0; // Full điểm nếu chọn đúng tất cả và không chọn sai
            } else {
              score = 0;
            }
          }
        }

        if (question.cau_hoi_tu_luan) {
          score = 0;
        }

        totalScore += score;

        savePromises.push(
          (async () => {
            const existing = await CauTraLoiHocVien.findOne({
              where: { ma_lan_lam: attempt.ma_lan_lam, ma_cau_hoi: question.ma_cau_hoi }
            });

            if (existing) {
              await existing.update({ tra_loi: userAnswer, diem: score });
            } else {
              await CauTraLoiHocVien.create({
                ma_lan_lam: attempt.ma_lan_lam,
                ma_cau_hoi: question.ma_cau_hoi,
                tra_loi: userAnswer,
                diem: score
              });
            }
          })()
        );
      })
    })

    await Promise.all(savePromises)

    attempt.diem = totalScore;
    attempt.trang_thai = "da_nop";
    attempt.thoi_gian_ket_thuc = new Date();

    await attempt.save();

    return res.json({
      success: true,
      message: "Test submitted successfully",
      diem: totalScore,
      attempt,
    });
  } catch (error) {
    console.error("Error submitting test attempt:", error);
    res.status(500).json({ message: "Failed to submit test attempt" });
  }
}

/**
 * Get test attempt by ID
 */
export const getTestAttemptById = async (req, res) => {
  try {
    const { attempt_id } = req.params;

    if (!attempt_id) {
      return res.status(400).json({
        success: false,
        message: 'attempt_id is required'
      });
    }

    const attempt = await LanLamBaiKiemTra.findOne({
      where: { ma_lan_lam: attempt_id },
      include: [
        {
          model: BaiKiemTra, as: 'bai_kiem_tra', include: [
            {
              model: PhanKiemTra, as: 'phan_kiem_tra', include: [
                {
                  model: CauHoi, as: 'cau_hoi', include: [
                    {
                      model: CauHoiTracNghiem,
                      as: 'cau_hoi_trac_nghiem',
                      include: [
                        { model: LuaChonTracNghiem, as: 'lua_chon_trac_nghiem' }
                      ]
                    },
                    {
                      model: CauHoiTuLuan,
                      as: 'cau_hoi_tu_luan',
                    },
                  ]
                }
              ]
            },

          ]
        },
        {
          model: CauTraLoiHocVien,
          as: 'cau_tra_loi_hoc_vien',
        },
      ]
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'No attempt found with this ID'
      });
    }

    const parsedAttempt = attempt.toJSON();
    parsedAttempt.bai_kiem_tra?.phan_kiem_tra?.forEach((part) => {
      part.cau_hoi?.forEach((q) => {
        if (q.cau_hoi_trac_nghiem?.lua_chon && typeof q.cau_hoi_trac_nghiem.lua_chon === 'string') {
          try {
            q.cau_hoi_trac_nghiem.lua_chon = JSON.parse(q.cau_hoi_trac_nghiem.lua_chon);
          } catch {
            q.cau_hoi_trac_nghiem.lua_chon = [];
          }
        }
      });
    });

    return res.status(200).json({
      success: true,
      message: "Fetched test attempt successfully",
      data: parsedAttempt,
    });

  } catch (error) {
    console.error("Error in getTestAttemptById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching test attempt",
      error: error.message,
    });
  }
}

export const getTestAttemptByID = async (req, res) => {
  try {
    const { attempt_id } = req.params;

    if (!attempt_id) {
      return res.status(400).json({
        success: false,
        message: 'attempt_id is required'
      });
    }

    const attempt = await LanLamBaiKiemTra.findOne({
      where: { ma_lan_lam: attempt_id },
      include: [
        {
          model: BaiKiemTra, as: 'bai_kiem_tra', include: [
            {
              model: PhanKiemTra, as: 'phan_kiem_tra', include: [
                {
                  model: CauHoi, as: 'cau_hoi', include: [
                    {
                      model: CauHoiTracNghiem,
                      as: 'cau_hoi_trac_nghiem',
                      include: [
                        { model: LuaChonTracNghiem, as: 'lua_chon_trac_nghiem' }
                      ]
                    },
                    {
                      model: CauHoiTuLuan,
                      as: 'cau_hoi_tu_luan',
                    },
                  ]
                }
              ]
            },

          ]
        },
        { model: CauTraLoiHocVien, as: 'cau_tra_loi_hoc_vien' },
      ]
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'No attempt found with this ID'
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched test attempt successfully",
      data: attempt,
    });

  } catch (error) {
    console.error("Error in getTestAttemptById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching test attempt",
      error: error.message,
    });
  }
}


/**
 * Get test attempts by test_id & student_id
 */
export const getTestAttempts = async (req, res) => {
  try {
    const { test_id, student_id } = req.query;

    if (!test_id || !student_id) {
      return res.status(400).json({
        message: 'test_id and student_id is required'
      });
    }

    const attempts = await LanLamBaiKiemTra.findAll({
      where: {
        ma_kiem_tra: test_id,
        ma_hoc_vien: student_id
      }
    });

    if (!attempts) {
      return res.status(404).json({
        success: false,
        message: "No attempts found",
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: `${attempts.length} attempts found`,
      data: attempts
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error when fetching attempts"
    });
  }
}

/**
 * Abort test attempt
 */
export const abortTestAttempt = async (req, res) => {
  const { attempt_id } = req.params;
  const user_id = req.user.ma_nguoi_dung;

  if (!attempt_id) {
    return res.status(400).json({
      message: 'attempt_id not found'
    });
  }
  const t = await sequelize.transaction();

  try {
    const attempt = await LanLamBaiKiemTra.findOne({
      where: { ma_lan_lam: attempt_id },
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    if (!attempt) {
      await t.rollback();
      return res.status(404).json({
        message: 'Attempt not found'
      });
    }

    // permission: only owner or admin can abort
    if (attempt.ma_hoc_vien !== user_id) {
      await t.rollback();
      return res.status(403).json({
        message: 'Not allowed'
      });
    }

    if (attempt.trang_thai === 'da_nop') {
      await t.rollback();
      return res.status(400).json({
        message: `Attempt already ${attempt.trang_thai}`
      })
    }

    // update: set status to aborted and set end_at
    attempt.trang_thai = 'da_huy';
    attempt.thoi_gian_ket_thuc = new Date();
    await attempt.save({ transaction: t });

    await t.commit();
    return res.status(200).json({
      success: true,
      message: 'Attempt aborted',
      data: attempt
    });
  } catch (error) {
    await t.rollback();
    console.error('Abort test attempt error: ', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    })
  }
}