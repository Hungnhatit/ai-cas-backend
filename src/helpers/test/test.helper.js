import PhanKiemTra from "../../model/test/test-section.model.js";
import CauHoi from "../../model/test/test-question.model.js";
import LuaChonTracNghiem from "../../model/test/test-multichoice-option.model.js";

/**
 * Test helper
 * Description: serve for test controller
 */
export async function upsertSection(sectionData, testId, transaction) {
  let section;
  if (sectionData.ma_phan) {
    section = await PhanKiemTra.findByPk(sectionData.ma_phan, { transaction });
    if (section) {
      await section.update({
        ten_phan: sectionData.ten_phan,
        mo_ta: sectionData.mo_ta,
        thu_tu: sectionData.thu_tu || 1,
      }, { transaction });
    }
  }
  if (!section) {
    section = await PhanKiemTra.create({
      ma_kiem_tra: testId,
      ten_phan: sectionData.ten_phan,
      mo_ta: sectionData.mo_ta,
      thu_tu: sectionData.thu_tu || 1,
    }, { transaction });
  }
  return section;
}

export async function upsertQuestion(q, sectionId, transaction) {
  let question;
  if (q.ma_cau_hoi) {
    question = await CauHoi.findByPk(q.ma_cau_hoi, { transaction });
    if (question) {
      await question.update({
        tieu_de: q.tieu_de || q.cau_hoi,
        loai_cau_hoi: q.loai,
        diem: q.diem || 0,
        mo_ta: q.mo_ta || null,
      }, { transaction });
    }
  }
  if (!question) {
    question = await CauHoi.create({
      tieu_de: q.tieu_de || q.cau_hoi,
      ma_phan: sectionId,
      loai_cau_hoi: q.loai,
      diem: q.diem || 0,
      mo_ta: q.mo_ta || null,
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date()
    }, { transaction });
  }
  return question;
}

export async function upsertChoices(tracNghiem, transaction) {
  if (!tracNghiem?.lua_chon_trac_nghiem?.length) return;

  const existingChoices = await LuaChonTracNghiem.findAll({
    where: { ma_cau_hoi_trac_nghiem: tracNghiem.ma_cau_hoi_trac_nghiem },
    transaction
  });

  const clientChoiceIds = tracNghiem.lua_chon_trac_nghiem
    .filter(c => c.ma_lua_chon)
    .map(c => c.ma_lua_chon);

  // Xóa những lựa chọn bị remove
  for (const choice of existingChoices) {
    if (!clientChoiceIds.includes(choice.ma_lua_chon)) {
      await choice.destroy({ transaction });
    }
  }

  // Upsert choices
  for (const choiceData of tracNghiem.lua_chon_trac_nghiem) {
    if (choiceData.ma_lua_chon) {
      const choice = await LuaChonTracNghiem.findByPk(choiceData.ma_lua_chon, { transaction });
      if (choice) {
        await choice.update({
          noi_dung: choiceData.noi_dung,
          la_dap_an_dung: choiceData.la_dap_an_dung
        }, { transaction });
        continue;
      }
    }
    // tạo mới nếu không tồn tại
    await LuaChonTracNghiem.create({
      ma_cau_hoi_trac_nghiem: tracNghiem.ma_cau_hoi_trac_nghiem,
      noi_dung: choiceData.noi_dung,
      la_dap_an_dung: choiceData.la_dap_an_dung,
      ngay_tao: new Date(),
      ngay_cap_nhat: new Date()
    }, { transaction });
  }
}
