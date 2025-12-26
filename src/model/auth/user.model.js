import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const NguoiDung = sequelize.define("NguoiDung", {
  ma_nguoi_dung: {              // user_id
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  ten: {                        // name
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {                      // email
    type: DataTypes.STRING,
    allowNull: false,
  },
  mat_khau: {                   // password
    type: DataTypes.STRING,
    allowNull: false,
  },
  so_dien_thoai: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  anh_dai_dien: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  vai_tro: {                    // role
    type: DataTypes.STRING,
    allowNull: false,
  },
  token_khoi_phuc_mat_khau: {
    type: DataTypes.STRING,
    allowNull: true
  },
  han_dat_mat_khau: {
    type: DataTypes.DATE,
    allowNull: true
  },
  trang_thai: {
    type: DataTypes.ENUM("dang_hoat_dong", "ngung_hoat_dong"),
    defaultValue: 'dang_hoat_dong',
    allowNull: false,
  }

}, {
  tableName: "nguoi_dung",      // users → nguoi_dung
  timestamps: true,
  createdAt: "ngay_tao",
  updatedAt: "ngay_cap_nhat",
});

export default NguoiDung;
