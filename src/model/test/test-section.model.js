// models/TestSection.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import BaiKiemTra from "./test.model.js";

const PhanKiemTra = sequelize.define("PhanKiemTra", {
  ma_phan: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  ma_kiem_tra: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: BaiKiemTra,
      key: 'ma_kiem_tra'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  ten_phan: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  mo_ta: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  loai_phan: {
    type: DataTypes.ENUM('trac_nghiem', 'tu_luan', 'viet_prompt', 'xu_ly_du_lieu'),
    allowNull: true,
    defaultValue: 'trac_nghiem',
  },
  thu_tu: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  diem_toi_da: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 10,
  },
  thoi_gian_gioi_han: {
    type: DataTypes.INTEGER(11),
    allowNull: true,
  },
  ngay_tao: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "phan_kiem_tra",
  timestamps: false
});

export default PhanKiemTra;
