import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Course from "../course.model.js";
import UserProgress from "./user-progress.model.js";

const Chapter = sequelize.define(
  "Chapter",
  {
    chapter_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    video_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    course_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Course,
        key: "course_id",
      },
      onDelete: "CASCADE",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "chapter",
    timestamps: false, // vì đã khai báo createdAt & updatedAt thủ công
  }
);

// Associations
Course.hasMany(Chapter, {
  foreignKey: "course_id",
  as: "chapter",
  onDelete: "CASCADE"
});
Chapter.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
  onDelete: "CASCADE"
});

// UserProgress.belongsTo(Chapter, { foreignKey: "chapter_id", as: "chapter" });
// Chapter.hasMany(UserProgress, { foreignKey: "chapter_id", as: "progress" });

export default Chapter;
