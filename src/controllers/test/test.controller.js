import { sequelize } from '../../config/database.js';
import CauHoiTracNghiem from '../../model/test/test-multichoice.model.js';
import BaiKiemTra from '../../model/test/test.model.js'
import LanLamBaiKiemTra from '../../model/test/test-attempt.model.js'
import GiangVien from '../../model/instructor/instructor.model.js';
import GiaoBaiKiemTra from '../../model/test/test-assignment.model.js';
import PhanKiemTra from '../../model/test/test-section.model.js';
import DanhMucBaiKiemTra from '../../model/category.model.js';
import { Op } from 'sequelize';
import { CauHoi } from '../../model/associations.js';
import LuaChonTracNghiem from '../../model/test/test-multichoice-option.model.js';
import CauHoiTuLuan from '../../model/test/test-prompt.model.js';
import BaiKiemTraDanhMuc from '../../model/test/test-category.model.js';
import { upsertChoices, upsertQuestion, upsertSection } from '../../helpers/test/test.helper.js';
import { updateTestService } from '../../services/test/test.service.js';

export const createTest = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      ma_giang_vien,
      tieu_de,
      mo_ta,
      thoi_luong,
      sections = [],
      danh_muc = [],
      tong_diem,
      so_lan_lam_toi_da = 1,
      do_kho,
      trang_thai = "ban_nhap",
      ngay_bat_dau = null,
      ngay_ket_thuc = null,
      cau_hoi: rootQuestions = []
    } = req.body;

    if (!ma_giang_vien || !tieu_de || !thoi_luong || tong_diem === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields!',
        data: { ma_giang_vien, tieu_de, thoi_luong, tong_diem }
      });
    }

    // 1) CREATE TEST
    const test = await BaiKiemTra.create({
      ma_giang_vien,
      tieu_de,
      mo_ta: mo_ta || null,
      thoi_luong,
      tong_diem,
      so_lan_lam_toi_da,
      do_kho,
      trang_thai,
      ngay_bat_dau,
      ngay_ket_thuc,
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date(),
      danh_muc: danh_muc.length ? danh_muc : null
    }, { transaction: t });

    // 1a. Lưu danh mục vào bảng trung gian nếu có
    if (Array.isArray(danh_muc) && danh_muc.length) {
      const danhMucRows = danh_muc.map(id => ({
        ma_kiem_tra: test.ma_kiem_tra,
        ma_danh_muc: id
      }));
      await BaiKiemTraDanhMuc.bulkCreate(danhMucRows, { transaction: t });
    }

    // 2) CREATE SECTIONS
    const createdSections = [];
    const sectionMap = {}; // map index -> ma_phan

    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      const sec = await PhanKiemTra.create({
        ma_kiem_tra: test.ma_kiem_tra,
        ten_phan: s.ten_phan || `Phần ${i + 1}`,
        mo_ta: s.mo_ta || null,
        loai_phan: s.loai_phan,
        thu_tu: s.thu_tu || i + 1,
        diem_toi_da: s.diem || 0,
        ngay_tao: new Date(),
        ngay_cap_nhat: new Date()
      }, { transaction: t });

      createdSections.push(sec);
      sectionMap[i] = sec.ma_phan;
    }

    for (let i = 0; i < createdSections.length; i++) {
      const section = createdSections[i];
      const questions = sections[i].cau_hoi || [];
      const sectionPoint = questions.reduce((sum, q) => sum + (q.diem || 0), 0);
      section.diem_toi_da = sectionPoint;
      await section.save({ transaction: t });
    }

    // 3) CREATE QUESTIONS (CHA)
    const allQuestions = sections.length ? sections.flatMap((s, i) =>
      s.cau_hoi.map(q => ({
        tieu_de: q.cau_hoi,
        ma_phan: sectionMap[i],
        loai_cau_hoi: q.loai ?? s.loai_phan,
        diem: q.diem || 0,
        mo_ta: q.mo_ta || null,
        ngay_tao: new Date(),
        ngay_cap_nhat: new Date()
      }))
    ) : rootQuestions.map(q => ({
      tieu_de,
      ma_phan: null,
      cau_hoi: q.cau_hoi,
      loai_cau_hoi: q.loai,
      diem: q.diem || 0,
      mo_ta: q.mo_ta || null,
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date()
    }));


    const createdQuestions = await CauHoi.bulkCreate(allQuestions, { transaction: t, returning: true });

    // 4) SPLIT TN/TL & INSERT CHOICES
    const tracNghiemRows = [];
    const tuLuanRows = [];
    const luaChonRows = [];

    let qIndex = 0;
    const questionListFlat = sections.length ? sections.flatMap(s => s.cau_hoi) : rootQuestions;

    for (let q of questionListFlat) {
      const inserted = createdQuestions[qIndex];
      qIndex++;

      if (q.loai === 'trac_nghiem') {
        tracNghiemRows.push({
          // ma_bai_kiem_tra: test.ma_kiem_tra,
          // ma_phan: inserted.ma_phan,
          ma_cau_hoi_trac_nghiem: inserted.ma_cau_hoi,
          dap_an_dung: typeof q.dap_an_dung === 'number' ? (q.lua_chon[q.dap_an_dung] || null) : q.dap_an_dung,
          ngay_tao: new Date(),
          ngay_cap_nhat: new Date()
          // cau_hoi: q.cau_hoi,
          // loai: q.loai,
          // diem: q.diem || 0,
          // lua_chon: q.lua_chon || null,
          // giai_thich: q.mo_ta || null,
        });

        if (Array.isArray(q.lua_chon)) {
          q.lua_chon.forEach((opt, optIndex) => {
            luaChonRows.push({
              ma_cau_hoi_trac_nghiem: inserted.ma_cau_hoi,
              noi_dung: opt,
              la_dap_an_dung: optIndex === q.dap_an_dung,
              ngay_tao: new Date(),
              ngay_cap_nhat: new Date()
            });
          });
        }

      } else if (q.loai === 'tu_luan') {
        tuLuanRows.push({
          ma_cau_hoi_tu_luan: inserted.ma_cau_hoi,
          giai_thich: q.mo_ta || null,
        });
      }
    }

    const testPoint = createdSections.reduce((sum, section) => sum + (section.diem_toi_da || 0), 0);
    test.tong_diem = testPoint;
    await test.save({ transaction: t });

    if (tracNghiemRows.length) await CauHoiTracNghiem.bulkCreate(tracNghiemRows, { transaction: t });
    if (luaChonRows.length) await LuaChonTracNghiem.bulkCreate(luaChonRows, { transaction: t });
    if (tuLuanRows.length) await CauHoiTuLuan.bulkCreate(tuLuanRows, { transaction: t });

    await t.commit();

    return res.status(201).json({
      status: 'success',
      message: 'Test created successfully',
      data: { ma_kiem_tra: test.ma_kiem_tra }
    });

  } catch (error) {
    console.error(error);
    await t.rollback();
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating test',
      error: error.message
    });
  }
};

/**
 * Assign test
 */
export const assignTestToStudent = async (req, res) => {
  try {
    const { test_id } = req.params;
    const { student_ids, ngay_ket_thuc, instructor_id } = req.body;

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
      ngay_bat_dau: new Date(),
      nguoi_giao: instructor_id,
      ngay_ket_thuc: ngay_ket_thuc || null,
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
        {
          model: PhanKiemTra, as: 'phan_kiem_tra', include: [
            {
              model: CauHoi, as: 'cau_hoi', include: [
                {
                  model: CauHoiTracNghiem, as: 'cau_hoi_trac_nghiem', include: [
                    { model: LuaChonTracNghiem, as: 'lua_chon_trac_nghiem' },
                  ]
                },
                {
                  model: CauHoiTuLuan, as: 'cau_hoi_tu_luan'
                },
              ]
            }
          ]
        },
        { model: DanhMucBaiKiemTra, as: 'danh_muc', attributes: ['ten_danh_muc'], through: { attributes: [] } },
        { model: GiangVien, as: 'giang_vien', attributes: ['ten', 'email'] }
      ]
    });

    if (!test) {
      return res.status(404).json({
        sucess: false,
        message: 'No test found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Fetch test successfully!',
      data: test
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
    let { page = 1, limit = 10, query = '', category = '' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    const where = {
      pham_vi_hien_thi: 'cong_khai'
    };

    if (query) {
      where.tieu_de = { [Op.like]: `%${query}%` };
    }

    const categoryFilter = category
      ? {
        model: DanhMucBaiKiemTra,
        as: 'danh_muc',
        where: { ten_danh_muc: { [Op.like]: `%${category}%` } },
        attributes: ['ma_danh_muc', 'ten_danh_muc'],
        through: { attributes: [] },
        required: true
      }
      : {
        model: DanhMucBaiKiemTra,
        as: 'danh_muc',
        attributes: ['ma_danh_muc', 'ten_danh_muc'],
        through: { attributes: [] },
        required: false
      }

    const totalItems = await BaiKiemTra.count({
      where,
      include: category ? [categoryFilter] : []
    });

    const totalPages = Math.ceil(totalItems / limit);

    const tests = await BaiKiemTra.findAll({
      where,
      include: [
        { model: PhanKiemTra, as: 'phan_kiem_tra', attributes: ['ma_phan', 'ten_phan'] },
        { model: GiangVien, as: 'giang_vien', attributes: ['ten', 'email'] },
        categoryFilter,
      ],
      order: [['ngay_tao', 'DESC']],
      offset,
      limit
    });

    return res.status(200).json({
      success: true,
      message: `${tests.length} tests found`,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit
      },
      filters: {
        query,
        category
      },
      data: tests
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Error fetching tests: ${error.message}`
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
        {
          model: PhanKiemTra, as: 'phan_kiem_tra', include: [
            {
              model: CauHoi, as: 'cau_hoi', include: [
                {
                  model: CauHoiTracNghiem, as: 'cau_hoi_trac_nghiem', include: [
                    { model: LuaChonTracNghiem, as: 'lua_chon_trac_nghiem' }
                  ]
                },
                { model: CauHoiTuLuan, as: 'cau_hoi_tu_luan' }
              ]
            }
          ]
        },
        {
          model: DanhMucBaiKiemTra,
          as: 'danh_muc',
          through: { attributes: [] }
        }
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
  try {
    const { test_id } = req.params;
    const ma_giang_vien = req.user.ma_nguoi_dung;
    const payload = req.body;

    const updatedTest = await updateTestService(test_id, ma_giang_vien, payload);

    return res.status(200).json({
      success: true,
      message: "Test updated successfully.",
      data: updatedTest,
    });
  } catch (error) {
    console.error("Error updating test:", error);

    const status = error.status || 500;
    const message = error.message || "An unexpected error occurred while updating the test.";

    return res.status(status).json({
      success: false,
      message,
      error: error.message,
    });
  }
};


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

    await sequelize.transaction(async (t) => {
      await CauHoiTracNghiem.destroy({
        where: { ma_bai_kiem_tra: test_id },
        transaction: t
      });
      await PhanKiemTra.destroy({
        where: { ma_kiem_tra: test_id },
        transaction: t
      })

      await test.destroy({ transaction: t });
    })

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