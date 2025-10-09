// src/models/userProgress.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const UserProgress = sequelize.define(
  "UserProgress",
  {
    ma_tien_do: { // progress_id
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ma_nguoi_dung: { // ma_nguoi_dung
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    ma_chuong: { // chapter_id
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    da_hoan_thanh: { // completed
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "tien_do_nguoi_dung",
    timestamps: true,
    createdAt: "ngay_tao",
    updatedAt: "ngay_cap_nhat",
  }
);

export default UserProgress;
