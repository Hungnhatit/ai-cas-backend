// src/model/attachment.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Course from "./course.model.js"; // import Course để tạo association

const Attachment = sequelize.define(
  "Attachment",
  {
    attachment_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    course_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Course,
        key: "course_id",
      },
      onDelete: "CASCADE",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "attachments",
    timestamps: false,
    indexes: [
      {
        fields: ["course_id"],
      },
    ],
  }
);

// Course.hasMany(Attachment, {
//   foreignKey: "course_id",
//   as: 'attachments',
//   onDelete: "CASCADE",
// });
// Attachment.belongsTo(Course, {
//   foreignKey: "course_id",
//   as: 'course',
//   onDelete: "CASCADE",
// });

export default Attachment;
