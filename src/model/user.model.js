import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const NguoiDung = sequelize.define('NguoiDung', {
  ma_nguoi_dung: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  ten: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  so_dien_thoai: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mat_khau: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  vai_tro: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  trang_thai: {
    type: DataTypes.ENUM("dang_hoat_dong", "ngung_hoat_dong"),
    defaultValue: "dang_hoat_dong",
    allowNull: false
  },
  ngay_tao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  ngay_cap_nhat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
},
  {
    tableName: "nguoi_dung",
    timestamps: true,
    createdAt: "ngay_tao",
    updatedAt: "ngay_cap_nhat"
  }
);

export default NguoiDung