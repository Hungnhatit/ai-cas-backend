// src/models/category.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Category = sequelize.define(
  "Category",
  {
    ma_danh_muc: { // category_id
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ten_danh_muc: { // name
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "danh_muc",
    timestamps: true,
    createdAt: "ngay_tao",
    updatedAt: "ngay_cap_nhat",
  }
);

export default Category;
