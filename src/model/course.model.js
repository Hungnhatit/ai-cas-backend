// src/models/course.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Course = sequelize.define(
  "Course",
  {
    ma_khoa_hoc: { // course_id
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ma_nguoi_dung: { // ma_nguoi_dung (instructor/creator)
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    tieu_de: { // title
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mo_ta: { // mo_ta
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duong_dan_anh: { // image_url
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gia: { // price
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    da_xuat_ban: { // is_published
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ma_danh_muc: { // category_id
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "khoa_hoc",
    timestamps: true,
    createdAt: "ngay_tao",
    updatedAt: "ngay_cap_nhat",
  }
);

export default Course;
