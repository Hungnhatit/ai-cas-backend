import { sequelize } from "../../config/database.js";
import BaiKiemTraDanhMuc from "../../model/test/test-category.model.js";
import PhanKiemTra from "../../model/test/test-section.model.js";
import BaiKiemTra from '../../model/test/test.model.js';
import CauHoi from "../../model/test/test-question.model.js";
import PhanKiemTraCauHoi from "../../model/test/test-section-question.model.js";
import CauHoiTracNghiem from "../../model/test/test-multichoice.model.js";
import LuaChonTracNghiem from "../../model/test/test-multichoice-option.model.js";
import CauHoiTuLuan from "../../model/test/test-prompt.model.js";
import { upsertChoices, upsertQuestion, upsertSection } from "../../helpers/test/test.helper.js";

export const createTestService = async (data) => {
  const t = await sequelize.transaction();
  try {
    const { ma_giang_vien, tieu_de, mo_ta, thoi_luong, sections = [], danh_muc = [], tong_diem, so_lan_lam_toi_da = 1, do_kho, trang_thai = "ban_nhap", ngay_bat_dau = null, ngay_ket_thuc = null,
      cau_hoi: rootQuestions = []
    } = data;

    // create test
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

    // save category
    if (Array.isArray(danh_muc) && danh_muc.length) {
      const danhMucRows = danh_muc.map(id => ({
        ma_kiem_tra: test.ma_kiem_tra,
        ma_danh_muc: id
      }));
      await BaiKiemTraDanhMuc.bulkCreate(danhMucRows, { transaction: t });
    }

    // 2) CREATE SECTIONS
    const createdSections = [];
    const sectionMap = {};
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

    // update section point
    for (let i = 0; i < createdSections.length; i++) {
      const section = createdSections[i];
      const questions = sections[i].cau_hoi || [];
      const sectionPoint = questions.reduce((sum, q) => sum + (q.diem || 0), 0);
      section.diem_toi_da = sectionPoint;
      await section.save({ transaction: t });
    }

    // 3) create question
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
      tieu_de: q.cau_hoi,
      ma_phan: null,
      loai_cau_hoi: q.loai,
      diem: q.diem || 0,
      mo_ta: q.mo_ta || null,
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date()
    }));

    const createdQuestions = await CauHoi.bulkCreate(allQuestions, { transaction: t, returning: true });

    // 4) LƯU VÀO BẢNG PHÂN CÂU HỎI
    const phanCauHoiRows = createdQuestions.map(q => ({
      ma_phan: q.ma_phan,
      ma_cau_hoi: q.ma_cau_hoi
    }));
    if (phanCauHoiRows.length) {
      await PhanKiemTraCauHoi.bulkCreate(phanCauHoiRows, { transaction: t });
    }

    // 5) SPLIT TN/TL & INSERT CHOICES
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
          ma_cau_hoi_trac_nghiem: inserted.ma_cau_hoi,
          dap_an_dung: typeof q.dap_an_dung === 'number' ? (q.lua_chon[q.dap_an_dung] || null) : q.dap_an_dung,
          ngay_tao: new Date(),
          ngay_cap_nhat: new Date()
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

    return test;

  } catch (error) {
    await t.rollback();
    throw error;
  }
}

export const updateTestService = async (testId, maGiangVien, payload) => {
  const transaction = await BaiKiemTra.sequelize.transaction();
  try {
    const { tieu_de, mo_ta, thoi_luong, tong_diem, ngay_het_han,
      so_lan_lam_toi_da, trang_thai, phan = [] } = payload;

    const test = await BaiKiemTra.findOne({
      where: { ma_kiem_tra: testId, ma_giang_vien: maGiangVien },
      transaction,
    });

    if (!test) {
      await transaction.rollback();
      throw { status: 404, message: "Test not found or no permission." };
    }

    // Update test info
    await test.update({ tieu_de, mo_ta, thoi_luong, tong_diem, ngay_het_han, so_lan_lam_toi_da, trang_thai }, { transaction });

    // Xóa section đã remove
    const existingSections = await PhanKiemTra.findAll({ where: { ma_kiem_tra: test.ma_kiem_tra }, transaction });
    const clientSectionIds = phan.filter(s => s.ma_phan).map(s => s.ma_phan);
    for (const section of existingSections) {
      if (!clientSectionIds.includes(section.ma_phan)) await section.destroy({ transaction });
    }

    // Upsert section + questions + choices
    for (const sectionData of phan) {
      const section = await upsertSection(sectionData, test.ma_kiem_tra, transaction);

      // Xóa câu hỏi bị remove
      const existingQuestions = await CauHoi.findAll({ where: { ma_phan: section.ma_phan }, transaction });
      const clientQuestionIds = sectionData.cau_hoi?.map(q => q.ma_cau_hoi).filter(Boolean) || [];
      for (const q of existingQuestions) {
        if (!clientQuestionIds.includes(q.ma_cau_hoi)) await q.destroy({ transaction });
      }

      for (const q of sectionData.cau_hoi || []) {
        const question = await upsertQuestion(q, section.ma_phan, transaction);
        await upsertChoices(q.cau_hoi_trac_nghiem, transaction);
      }
    }

    await transaction.commit();

    // Lấy lại test với nested include
    const updatedTest = await BaiKiemTra.findByPk(testId, {
      include: [
        {
          model: PhanKiemTra,
          as: "phan_kiem_tra",
          include: [
            {
              model: CauHoi, as: 'cau_hoi', include: [
                { model: CauHoiTracNghiem, as: 'cau_hoi_trac_nghiem', include: [{ model: LuaChonTracNghiem, as: "lua_chon_trac_nghiem" }] },
                { model: CauHoiTuLuan, as: "cau_hoi_tu_luan" }
              ]
            }
          ],
        },
      ],
    });

    return updatedTest;

  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback();
    throw error;
  }
}