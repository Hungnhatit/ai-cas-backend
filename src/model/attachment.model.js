// src/model/attachment.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Course from "./course.model.js";

const Attachment = sequelize.define(
  "Attachment",
  {
    ma_dinh_kem: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ten: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    duong_dan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ma_khoa_hoc: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Course,
        key: "ma_khoa_hoc",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "dinh_kem",
    timestamps: true,
    createdAt: "ngay_tao",
    updatedAt: "ngay_cap_nhat",
    indexes: [
      {
        fields: ["ma_khoa_hoc"],
      },
    ],
  }
);

// Associations
Course.hasMany(Attachment, {
  foreignKey: "ma_khoa_hoc",
  as: "dinh_kem",
  onDelete: "CASCADE",
});

Attachment.belongsTo(Course, {
  foreignKey: "ma_khoa_hoc",
  as: "khoa_hoc",
  onDelete: "CASCADE",
});

export default Attachment;
