import { sequelize } from '../../config/database.js';
import CauHoiKiemTra from '../../model/test/test-question.model.js';
import BaiKiemTra from '../../model/test/test.model.js'
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
 * Get test by ID
 */
export const getTestById = async (req, res) => {
  try {
    const { test_id } = req.params;

    const test = await BaiKiemTra.findByPk(test_id, {
      include: [
        { model: CauHoiKiemTra, as: 'cau_hoi' },
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
      cau_hoi: test.cau_hoi.map((q) => ({
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
 * Submit test
 */
export const submitTest = async (req, res) => {
  try {

  } catch (error) {

  }
}