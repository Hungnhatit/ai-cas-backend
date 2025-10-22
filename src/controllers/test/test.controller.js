import { sequelize } from '../../config/database.js';
import CauHoiKiemTra from '../../model/test/test-question.model.js';
import BaiKiemTra from '../../model/test/test.model.js'
import LanLamBaiKiemTra from '../../model/test/test-attempt.model.js'
import GiangVien from '../../model/instructor/instructor.model.js';
import GiaoBaiKiemTra from '../../model/test/test-assignment.model.js';

/**
 * Create new test
 */
export const createTest = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { ma_giang_vien, tieu_de, mo_ta, thoi_luong, tong_diem, so_lan_lam_toi_da, do_kho, trang_thai, ngay_bat_dau, ngay_ket_thuc, cau_hoi = []
    } = req.body;

    // validate required fields
    if (!ma_giang_vien || !tieu_de || !thoi_luong || tong_diem === undefined || tong_diem === null) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fileds, please check again!',
        data: {
          'ma_giang_vien': ma_giang_vien,
          'tieu_de': tieu_de,
          'thoi_luong': thoi_luong,
          'tong_diem': tong_diem,
        }
      });
    }

    const test = await BaiKiemTra.create({
      ma_giang_vien,
      tieu_de,
      mo_ta: mo_ta || null,
      thoi_luong,
      tong_diem,
      so_lan_lam_toi_da: so_lan_lam_toi_da || 1,
      do_kho: do_kho || "de",
      trang_thai: trang_thai || "ban_nhap",
      ngay_bat_dau: ngay_bat_dau || null,
      ngay_ket_thuc: ngay_ket_thuc || null,
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
    }, { transaction: t });

    if (cau_hoi && Array.isArray(cau_hoi) && cau_hoi.length > 0) {
      const formattedQuestions = cau_hoi.map((q) => ({
        ma_bai_kiem_tra: test.ma_kiem_tra,
        cau_hoi: q.cau_hoi,
        loai: q.loai,
        lua_chon: q.lua_chon ? JSON.stringify(q.lua_chon) : JSON.stringify([]),
        dap_an_dung: q.dap_an_dung,
        diem: q.diem || 1,
        ngay_tao: new Date(),
        ngay_cap_nhat: new Date(),
      }));
      await CauHoiKiemTra.bulkCreate(formattedQuestions, { transaction: t });
      console.log(formattedQuestions)
    }

    await t.commit();

    return res.status(201).json({
      status: 'success',
      message: 'Test created successfully',
      data: test
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'error',
      message: `Internal server error while creating test: ${error}`,
      error: error.message
    })
  }
}

/**
 * Assign test
 */
export const assignTestToStudent = async (req, res) => {
  try {
    const { test_id } = req.params;
    const { student_ids, han_nop, instructor_id } = req.body;

    console.log(test_id, student_ids);

    if (!test_id || !Array.isArray(student_ids)) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: test_id=${test_id}, student_id=${student_ids}`
      });
    }

    const dataToInsert = student_ids.map((student_id) => ({
      ma_kiem_tra: test_id,
      ma_hoc_vien: student_id,
      ngay_giao: new Date(),
      nguoi_giao: instructor_id,
      han_nop: han_nop || null,
      trang_thai: 'chua_lam'
    }));

    GiaoBaiKiemTra.destroy({
      where: {
        ma_kiem_tra: test_id,
        ma_hoc_vien: student_ids
      }
    })

    const assigned = await GiaoBaiKiemTra.bulkCreate(dataToInsert);

    return res.status(201).json({
      success: true,
      message: `The test has been successfully assigned to ${assigned.length} student!`,
      data: assigned
    })

  } catch (error) {
    console.error("Error assigning test:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assign test to student",
      error: error.message,
    });
  }
}

/**
 * Get test by ID
 */
export const getTestById = async (req, res) => {
  try {
    const { test_id } = req.params;

    const test = await BaiKiemTra.findByPk(test_id, {
      include: [
        { model: CauHoiKiemTra, as: 'cau_hoi_kiem_tra' },
      ]
    });

    if (!test) {
      return res.status(404).json({
        sucess: false,
        message: 'No test found'
      });
    }

    const parsedTest = {
      ...test.toJSON(),
      cau_hoi: test.cau_hoi_kiem_tra.map((q) => ({
        ...q.toJSON(),
        lua_chon:
          typeof q.lua_chon === "string"
            ? JSON.parse(q.lua_chon) || []
            : q.lua_chon,
      })),
    };

    return res.status(200).json({
      success: true,
      message: 'Fetch test successfully!',
      data: parsedTest
    })

  } catch (error) {
    console.log(error);
    res.status(404).json({
      sucess: false,
      message: `Error fetching test: ${error}`
    });
  }
}

/**
 * Get all tests
 */
export const getTests = async (req, res) => {
  try {
    const tests = await BaiKiemTra.findAll({
      where: { pham_vi_hien_thi: 'cong_khai' },
      include: [
        { model: GiangVien, as: 'giang_vien', attributes: ['ten', 'email'] },
      ],
      order: [['ngay_tao', 'desc']]
    });

    if (!tests) {
      return res.status(404), json({
        success: false,
        message: 'No test found',
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: `${tests.length} tests found!`,
      data: tests
    })
  } catch (error) {
    console.log(error);
    res.status(404).json({
      sucess: false,
      message: `Error fetching test: ${error}`
    });
  }
}

/**
 * Get tests for student
 */
export const getTestsForStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing student_id parameter'
      });
    }

    const attempts = await LanLamBaiKiemTra.findAll({
      where: { ma_hoc_vien: student_id },
      attributes: ['ma_kiem_tra'],
    });

    const joinedTestIds = attempts.map(a => a.ma_kiem_tra);

    const joinedTests = await BaiKiemTra.findAll({
      where: { ma_kiem_tra: { [Op.in]: joinedTestIds } },
      include: [
        { model: GiangVien, as: 'giang_vien', attributes: ['ten', 'email'] },
      ]
    });

    const assigned = await GiaoBaiKiemTra.findAll({
      where: { ma_hoc_vien: student_id },
      attributes: ['ma_kiem_tra']
    });

    const assignTestIds = assigned.map(a => a.ma_kiem_tra);

    const unjoinedAssignTests = await BaiKiemTra.findAll({
      where: {
        pham_vi_hien_thi: 'cong_khai',
        ma_kiem_tra: { [Op.notIn]: [...joinedTestIds, ...assignTestIds] },
      },
      include: [
        { model: GiangVien, as: 'giang_vien', attributes: ['ten', 'email'] }
      ]
    })

    return res.status(200).json({
      success: true,
      message: 'Fetch all tests for student successfully!',
      data: {
        joined_tests: joinedTests,
        assigned_tests: unjoinedAssignTests,
      }
    });
  } catch (error) {
    console.error("Error fetching tests for student:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching tests for student.",
      error: error.message,
    });
  }
}

/**
 * Submit test
 */
export const getTestsByInstructorId = async (req, res) => {
  try {
    const { instructor_id } = req.params;

    if (!instructor_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing instructor_id parameter'
      });
    }

    const tests = await BaiKiemTra.findAll({
      where: { ma_giang_vien: instructor_id },
      include: [
        { model: CauHoiKiemTra, as: 'cau_hoi_kiem_tra' }
      ],
      order: [['ngay_tao', 'DESC']]
    });

    if (!tests || !tests.length === 0) {
      return res.staus(404).json({
        success: false,
        message: `No test found for instructor with ID=${instructor_id}`,
        data: []
      })
    }

    return res.status(200).json({
      success: true,
      message: `Fetched ${tests.length} test${tests.length > 1 ? 's' : ''} for instructor with ID = ${instructor_id}`,
      data: tests
    })

  } catch (error) {
    console.error("Error fetching tests by instructor ID:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching tests by instructor ID.",
      error: error.message,
    });
  }
}

/**
 * Get test result
 */
export const getTestResults = async (req, res) => {
  try {
    const { test_id, student_id } = req.params;

    const tests = await LanLamBaiKiemTra.findAll({
      where: {
        ma_kiem_tra: test_id,
        ma_hoc_vien: student_id
      },
      order: [["ngay_tao", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: `Fetch test result for test_id=${test_id} & student_id=${student_id} successfully!`,
      data: tests
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching test results.",
      error: error.message,
    });

  }
}

/**
 * Update test
 */
export const updateTest = async (req, res) => {
  const transaction = await BaiKiemTra.sequelize.transaction();
  const { test_id } = req.params;
  const ma_giang_vien = req.user.ma_nguoi_dung;

  try {
    const { tieu_de, mo_ta, thoi_luong, tong_diem, ngay_het_han, so_lan_lam_toi_da, trang_thai, cau_hoi = [] } = req.body;

    const test = await BaiKiemTra.findOne({
      where: { ma_kiem_tra: test_id, ma_giang_vien },
      transaction
    });

    if (!test) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "Test not found or you don't have permission to update it.",
      });
    }

    await test.update({
      tieu_de, mo_ta, thoi_luong, tong_diem, ngay_het_han, so_lan_lam_toi_da, trang_thai,
    }, { transaction });

    if (cau_hoi.length > 0) {
      await CauHoiKiemTra.destroy({
        where: { ma_bai_kiem_tra: test.ma_kiem_tra },
        transaction
      });

      const formattedQuestions = cau_hoi.map((q) => ({
        ma_bai_kiem_tra: test.ma_kiem_tra,
        cau_hoi: q.cau_hoi,
        loai: q.loai,
        lua_chon: q.lua_chon || [],
        dap_an_dung: q.dap_an_dung,
        diem: q.diem,
      }));

      await CauHoiKiemTra.bulkCreate(formattedQuestions, { transaction });
    }

    await transaction.commit();

    // fetch updated test with its questions
    const updatedTest = await BaiKiemTra.findByPk(test_id, {
      include: [{ model: CauHoiKiemTra, as: "cau_hoi_kiem_tra" }],
    });

    // success response
    return res.status(200).json({
      success: true,
      message: "Test updated successfully.",
      data: updatedTest,
    });
  } catch (error) {
    if (transaction) await transaction.rollback();

    console.error("Error updating test:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating the test.",
      error: error.message,
    });
  }
}

/**
 * Delete test: soft delete and force delete
 */
export const deleteTest = async (req, res) => {
  const { test_id } = req.params;
  const forceDelete = req.query.force === 'true';

  try {
    const test = await BaiKiemTra.findByPk(test_id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      })
    }

    if (!forceDelete) {
      test.trang_thai = 'luu_tru';
      await test.save();

      return res.status(200).json({
        success: true,
        message: 'Test archived successfully (soft delete)'
      });
    }

    await test.destroy();

    return res.status(200).json({
      success: true,
      message: 'Test and related data have been deleted successfully!'
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Failed to delete test: ${error}`
    });
  }
}

/** 
 * Restore test
 */
export const restoreTest = async (req, res) => {
  try {
    const { test_id } = req.params;
    const test = await BaiKiemTra.findOne({
      where: { ma_kiem_tra: test_id }
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found'
      })
    }

    if (test.trang_thai !== 'luu_tru') {
      return res.status(400).json({
        success: false,
        message: 'Test is not archived, cannot restore'
      })
    }

    await test.update({
      trang_thai: 'ban_nhap'
    });

    return res.status(200).json({
      success: true,
      message: 'Test restored sucessfully',
      data: test
    });
  } catch (error) {
    console.error("Error restoring test:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to restore test",
      error: error.message,
    });
  }
}