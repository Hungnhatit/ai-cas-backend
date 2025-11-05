/**
 * IMPORT MODELS
 */
import TepDinhKem from "./attachment.model.js";              // attachment
import DanhMuc from "./category.model.js";                   // category
import KhoaHoc from "./course.model.js";                     // course
import MuaHang from "./purchase.model.js";                   // purchase
import Chuong from "./quiz/chapter.model.js";                // chapter
import DuLieuMux from "./quiz/mux.model.js";                 // mux_data
import TienDoNguoiDung from "./quiz/user-progress.model.js"; // user_progress
import NguoiDung from "./auth/user.model.js";                // user
import BaiKiemTra from "./test/test.model.js";
import KetQua from "./quiz/result.model.js";                 // result
import CauHoi from './quiz/question.model.js';               // question
import CauTraLoi from './quiz/answer.model.js';              // answer
import LuaChon from './quiz/option.model.js';                // option
import BaiTracNghiem from "./quiz/quiz.model.js";            // quiz
import CauHoiTracNghiem from "./quiz/quiz-question.model.js";// quiz_question
import LanLamTracNghiem from "./quiz/quiz-attempt.model.js"; // quiz_attempt
import GiangVien from "./instructor/instructor.model.js";    // instructor
import HocVien from "./student/student.model.js";            // student
import GiaoBaiKiemTra from "./quiz/quiz-assignment.model.js";// quiz_assignment
import BaiTap from "./assignment/assignment.model.js";        // assignment
import BaiNop from "./assignment/assignment-submission.model.js"; // assignment_submission
import KetNoiKiemTra from "./test/test-association.js";       // test_association
import CauHoiKiemTra from "./test/test-question.model.js";
import LanLamBaiKiemTra from "./test/test-attempt.model.js";
import DanhMucBaiKiemTra from "./category.model.js";
import KetQuaAI from "./result/result.model.js";
import PhanKiemTra from "./test/test-section.model.js";

/**
 * NGƯỜI DÙNG (USERS)
 */
NguoiDung.hasMany(KhoaHoc, { foreignKey: "ma_nguoi_dung", as: "khoa_hoc" }); // ma_nguoi_dung
KhoaHoc.belongsTo(NguoiDung, { foreignKey: "ma_nguoi_dung", as: "giang_vien" }); // instructor

NguoiDung.hasMany(MuaHang, { foreignKey: "ma_nguoi_dung", as: "mua_hang" }); // ma_nguoi_dung
MuaHang.belongsTo(NguoiDung, { foreignKey: "ma_nguoi_dung", as: "nguoi_mua" }); // buyer

NguoiDung.hasMany(TienDoNguoiDung, { foreignKey: "ma_nguoi_dung", as: "tien_do" }); // user_progress
TienDoNguoiDung.belongsTo(NguoiDung, { foreignKey: "ma_nguoi_dung", as: "nguoi_dung" });

NguoiDung.hasMany(KetQua, { foreignKey: "ma_nguoi_dung", as: "ket_qua" }); // results
KetQua.belongsTo(NguoiDung, { foreignKey: "ma_nguoi_dung", as: "nguoi_dung" });

/**
 * DANH MỤC (CATEGORIES)
 */
DanhMuc.hasMany(KhoaHoc, { foreignKey: "ma_danh_muc", as: "khoa_hoc" }); // category_id
KhoaHoc.belongsTo(DanhMuc, { foreignKey: "ma_danh_muc", as: "danh_muc" });

/**
 * KHOÁ HỌC (COURSES)
 */
KhoaHoc.hasMany(Chuong, { foreignKey: "ma_khoa_hoc", as: "chuong" }); // chapters
Chuong.belongsTo(KhoaHoc, { foreignKey: "ma_khoa_hoc", as: "khoa_hoc_cha" }); // parentCourse

KhoaHoc.hasMany(MuaHang, { foreignKey: "ma_khoa_hoc", as: "mua_hang" }); // purchases
MuaHang.belongsTo(KhoaHoc, { foreignKey: "ma_khoa_hoc", as: "khoa_hoc_da_mua" }); // purchasedCourse

KhoaHoc.hasMany(TepDinhKem, { foreignKey: "ma_khoa_hoc", as: "tep_dinh_kem" }); // attachments
TepDinhKem.belongsTo(KhoaHoc, { foreignKey: "ma_khoa_hoc", as: "khoa_hoc_dinh_kem" }); // attachedCourse

/**
 * CHƯƠNG (CHAPTERS)
 */
Chuong.hasMany(TienDoNguoiDung, { foreignKey: "ma_chuong", as: "tien_do_nguoi_dung" }); // userProgress
TienDoNguoiDung.belongsTo(Chuong, { foreignKey: "ma_chuong", as: "chuong" });

Chuong.hasOne(DuLieuMux, { foreignKey: "ma_chuong", as: "du_lieu_mux" }); // muxData
DuLieuMux.belongsTo(Chuong, { foreignKey: "ma_chuong", as: "chuong" });

/**
 * BÀI KIỂM TRA (TESTS)
 */
BaiKiemTra.hasMany(CauHoiKiemTra, { foreignKey: "ma_bai_kiem_tra", as: "cau_hoi_kiem_tra" }); 
CauHoiKiemTra.belongsTo(BaiKiemTra, { foreignKey: "ma_bai_kiem_tra", as: "bai_kiem_tra" }); // test

BaiKiemTra.hasMany(KetQua, { foreignKey: "ma_kiem_tra", as: "ket_qua" });
KetQua.belongsTo(BaiKiemTra, { foreignKey: "ma_kiem_tra", as: "bai_kiem_tra" });

/**
 * Test attempts
 */
BaiKiemTra.hasMany(LanLamBaiKiemTra, { foreignKey: 'ma_kiem_tra', as: 'lan_lam_kiem_tra', onDelete: 'CASCADE' });
LanLamBaiKiemTra.belongsTo(BaiKiemTra, { foreignKey: 'ma_kiem_tra', as: 'bai_kiem_tra' });


/**
 * CÂU HỎI (QUESTIONS)
 */
CauHoi.hasMany(LuaChon, { foreignKey: "ma_cau_hoi", as: "lua_chon" }); // options
LuaChon.belongsTo(CauHoi, { foreignKey: "ma_cau_hoi", as: "cau_hoi" });

CauHoi.hasMany(CauTraLoi, { foreignKey: "ma_cau_hoi", as: "cau_tra_loi" }); // answers
CauTraLoi.belongsTo(CauHoi, { foreignKey: "ma_cau_hoi", as: "cau_hoi" });

/**
 * KẾT QUẢ (RESULTS)
 */
KetQua.hasMany(CauTraLoi, { foreignKey: "ma_ket_qua", as: "cau_tra_loi" }); // answers
CauTraLoi.belongsTo(KetQua, { foreignKey: "ma_ket_qua", as: "ket_qua" });

/**
 * BÀI TRẮC NGHIỆM (QUIZZES)
 */
BaiTracNghiem.hasMany(CauHoiTracNghiem, {
  foreignKey: "ma_bai_trac_nghiem",
  as: "cau_hoi_trac_nghiem",
  onDelete: "CASCADE",
});

CauHoiTracNghiem.belongsTo(BaiTracNghiem, {
  foreignKey: "ma_bai_trac_nghiem",
  as: "bai_trac_nghiem",
});

/**
 * LẦN LÀM TRẮC NGHIỆM (ATTEMPTS)
 */
BaiTracNghiem.hasMany(LanLamTracNghiem, { foreignKey: "ma_bai_trac_nghiem", as: "lan_lam_trac_nghiem", onDelete: "CASCADE" });
LanLamTracNghiem.belongsTo(BaiTracNghiem, { foreignKey: "ma_bai_trac_nghiem", as: "bai_trac_nghiem" });

/**
 * GIẢNG VIÊN - HỌC VIÊN (INSTRUCTOR - STUDENT)
 */
GiangVien.hasMany(HocVien, { foreignKey: "ma_giang_vien", as: "hoc_vien" }); // ma_giang_vien
HocVien.belongsTo(GiangVien, { foreignKey: "ma_giang_vien", as: "giang_vien" });

/**
 * GIẢNG VIÊN - BÀI TRẮC NGHIỆM (INSTRUCTOR - QUIZ)
 */
GiangVien.hasMany(BaiTracNghiem, { foreignKey: "ma_giang_vien", as: "bai_trac_nghiem" });
BaiTracNghiem.belongsTo(GiangVien, { foreignKey: "ma_giang_vien", as: "giang_vien" });

/**
 * BÀI TRẮC NGHIỆM - GIAO BÀI KIỂM TRA (QUIZ - QUIZ_ASSIGNMENT)
 */
BaiTracNghiem.hasMany(GiaoBaiKiemTra, { foreignKey: "ma_bai_trac_nghiem", as: "giao_bai_kiem_tra" });
GiaoBaiKiemTra.belongsTo(BaiTracNghiem, { foreignKey: "ma_bai_trac_nghiem", as: "bai_trac_nghiem" });

/**
 * HỌC VIÊN - GIAO BÀI KIỂM TRA (STUDENT - QUIZ_ASSIGNMENT)
 */
HocVien.hasMany(GiaoBaiKiemTra, { foreignKey: "ma_hoc_vien", as: "bai_kiem_tra_da_giao" });
GiaoBaiKiemTra.belongsTo(HocVien, { foreignKey: "ma_hoc_vien", as: "hoc_vien" });

/**
 * BÀI TẬP - KHOÁ HỌC - GIẢNG VIÊN - HỌC VIÊN
 */
BaiTap.belongsTo(KhoaHoc, { foreignKey: "ma_khoa_hoc", as: "khoa_hoc" });
BaiTap.belongsTo(GiangVien, { foreignKey: "ma_giang_vien", as: "giang_vien" });

/**
 * HỌC VIÊN - BÀI NỘP (STUDENT - SUBMISSION)
 */
HocVien.hasMany(BaiNop, { foreignKey: "ma_hoc_vien", as: "bai_nop" });
BaiNop.belongsTo(HocVien, { foreignKey: "ma_hoc_vien", as: "hoc_vien" });

/**
 * BÀI TẬP - BÀI NỘP (ASSIGNMENT - SUBMISSION)
 */
BaiTap.hasMany(BaiNop, { foreignKey: "ma_bai_tap", as: "bai_nop" });
BaiNop.belongsTo(BaiTap, { foreignKey: "ma_bai_tap", as: "bai_tap" });

/**
 * Category - User
 */
NguoiDung.hasMany(DanhMucBaiKiemTra, { foreignKey: 'nguoi_tao_danh_muc', as: 'danh_muc_bai_kiem_tra' });
DanhMucBaiKiemTra.belongsTo(NguoiDung, { foreignKey: 'nguoi_tao_danh_muc', as: 'nguoi_tao' });

/**
 * BaiKiemTra - GiangVien
 */
BaiKiemTra.belongsTo(GiangVien, { foreignKey: 'ma_giang_vien', as: 'giang_vien' });


/**
 * KetQuaAi
 */
KetQuaAI.belongsTo(LanLamBaiKiemTra, { foreignKey: "ma_lan_lam", as: "lan_lam_kiem_tra" });

/**
 * BaiKiemTra - PhanKiemTra
 */
PhanKiemTra.belongsTo(BaiKiemTra, { foreignKey: 'ma_kiem_tra', as: 'bai_kiem_tra' });
BaiKiemTra.hasMany(PhanKiemTra, { foreignKey: 'ma_kiem_tra', as: 'phan_kiem_tra', onDelete: 'CASCADE' });

PhanKiemTra.hasMany(CauHoiKiemTra, {
  foreignKey: 'ma_phan',
  as: 'cau_hoi_kiem_tra',
  onDelete: 'CASCADE'
});
CauHoiKiemTra.belongsTo(PhanKiemTra, {
  foreignKey: 'ma_phan',
  as: 'phan_kiem_tra'
});

/**
 * GỌI CÁC LIÊN KẾT KHÁC (TEST ASSOCIATION)
 */
KetNoiKiemTra();


export {
  NguoiDung,
  DanhMuc,
  KhoaHoc,
  Chuong,
  MuaHang,
  TienDoNguoiDung,
  TepDinhKem,
  DuLieuMux,
  BaiKiemTra,
  CauHoi,
  LuaChon,
  KetQua,
  CauTraLoi,
};
