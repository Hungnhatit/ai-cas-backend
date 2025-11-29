import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const BaiKiemTra = sequelize.define("BaiKiemTra", {
  ma_kiem_tra: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  ma_giang_vien: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  tieu_de: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  mo_ta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  thoi_luong: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tong_diem: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  so_lan_lam_toi_da: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  do_kho: {
    type: DataTypes.ENUM("de", "trung_binh", "kho"),
    allowNull: false,
    defaultValue: "trung_binh",
  },
  trang_thai: {
    type: DataTypes.ENUM("hoat_dong", "ban_nhap", "luu_tru"),
    allowNull: false,
    defaultValue: "ban_nhap",
  },
  pham_vi_hien_thi: {
    type: DataTypes.ENUM("cong_khai", "lop_hoc", "rieng_tu"),
    allowNull: false,
    defaultValue: "cong_khai",
  },
  ngay_bat_dau: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ngay_ket_thuc: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  ngay_tao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "bai_kiem_tra",
  timestamps: false,
  underscored: true,
});

export default BaiKiemTra;
