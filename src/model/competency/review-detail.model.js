import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import CauHoi from "../test/test-question.model.js";
import KetQuaDanhGia from "../result/results.model.js";

const ChiTietDanhGia = sequelize.define('ChiTietDanhGia', {
  ma_chi_tiet: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  ma_cau_hoi: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  ma_lan_lam: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  ma_tieu_chi: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  ma_khung_nang_luc: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },

  ma_danh_gia: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
 
  diem: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },

  danh_gia_chi_tiet: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  nhan_xet: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  diem_manh: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  diem_yeu: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  ngay_tao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },

  ngay_cap_nhat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: "chi_tiet_danh_gia",
    timestamps: false,
  }
);

export default ChiTietDanhGia;