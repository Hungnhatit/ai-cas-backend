// models/TestSection.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const TestSection = sequelize.define("TestSection", {
  ma_phan: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  ma_kiem_tra: {
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
  thu_tu: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  diem: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "phan_kiem_tra",
  timestamps: true,
  createdAt: "ngay_tao",
  updatedAt: "ngay_cap_nhat",
});

export default TestSection;
