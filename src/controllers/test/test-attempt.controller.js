import { sequelize } from "../../config/database.js";
import LanLamBaiKiemTra from "../../model/test/test-attempt.model.js";
import CauHoiKiemTra from "../../model/test/test-question.model.js";
import BaiKiemTra from '../../model/test/test.model.js';

/**
 * Start test attempt
 * Description: start test attempt, set status to in-progress
 */
export const startTestAttempt = async (req, res) => {
  try {
    const { test_id, student_id } = req.body;

    console.log(test_id, student_id);
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

    const attempt = await LanLamBaiKiemTra.findByPk(testAttempt_id);

    if (!attempt) {
      return res.status(404).json({
        message: 'Attempt not found'
      })
    }

    await attempt.update({
      cau_tra_loi: answers
    });

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

    const attempt = await LanLamBaiKiemTra.findByPk(testAttempt_id);

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

    const test = await BaiKiemTra.findByPk(attempt.ma_kiem_tra, {
      include: [
        { model: CauHoiKiemTra, as: 'cau_hoi_kiem_tra' }
      ]
    });

    if (!test) {
      return res.status(404).json({
        message: 'Test not found'
      });
    }

    console.log(attempt)

    const userAnswers = JSON.parse(attempt.cau_tra_loi || '{}');

    let totalScore = 0;

    test.cau_hoi_kiem_tra.forEach((q) => {
      const userAnswer = userAnswers?.[q.ma_cau_hoi];
      if (userAnswer?.toString() === q.dap_an_dung?.toString()) {
        totalScore += q.diem;
      }
    });

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
              model: CauHoiKiemTra, as: 'cau_hoi_kiem_tra', attributes: ["ma_cau_hoi", "cau_hoi", "loai", "lua_chon", "dap_an_dung", "diem",
              ],
            }
          ]
        }
      ]
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'No attempt found with this ID'
      });
    }

    const parsedAttempt = attempt.toJSON();
    // console.log(parsedAttempt);
    if (parsedAttempt.bai_kiem_tra?.cau_hoi_kiem_tra) {
      parsedAttempt.bai_kiem_tra.cau_hoi_kiem_tra = parsedAttempt.bai_kiem_tra.cau_hoi_kiem_tra.map((q) => ({
        ...q,
        lua_chon:
          typeof q.lua_chon === "string"
            ? (() => {
              try {
                return JSON.parse(q.lua_chon);
              } catch {
                return [];
              }
            })()
            : q.lua_chon,
      }));
    }

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