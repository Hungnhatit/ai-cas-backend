// models/ket_qua_danh_gia.model.js
import { DataTypes } from 'sequelize';
import { sequelize } from "../../config/database.js";

const KetQuaDanhGia = sequelize.define('KetQuaDanhGia', {
  ma_danh_gia: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },

  ma_lan_lam: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: 'lan_lam_kiem_tra', 
      key: 'ma_lan_lam'
    }
  },

  tong_diem: {
    type: DataTypes.FLOAT,
    allowNull: true
  },

  xep_loai: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },

  nhan_xet: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  nguoi_cham: {
    type: DataTypes.ENUM('ai', 'giang_vien'),
    allowNull: false,
    defaultValue: 'ai'
  },

  trang_thai: {
    type: DataTypes.ENUM('dang_cham', 'da_cham'),
    allowNull: false,
    defaultValue: 'dang_cham'
  },

  ngay_danh_gia: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },

  ngay_tao: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },

  ngay_cap_nhat: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
}, {
  tableName: 'ket_qua_danh_gia',
  timestamps: false,
});

export default KetQuaDanhGia;
