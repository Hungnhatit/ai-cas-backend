// src/model/attachment.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const DinhKemTaiLieu = sequelize.define(
  "DinhKemTaiLieu",
  {
    ma_dinh_kem: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ma_tai_lieu: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    ten_tep: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    duong_dan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    dung_luong: {
      type: DataTypes.INTEGER,
    },
    dinh_dang: {
      type: DataTypes.TEXT,
    }
  },
  {
    tableName: "dinh_kem_tai_lieu",
    timestamps: true,
    createdAt: "ngay_tao",
    updatedAt: "ngay_cap_nhat"
  }
);


export default DinhKemTaiLieu;
