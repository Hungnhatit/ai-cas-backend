// src/model/courseProgress.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Course from "./course.model.js"; // Nếu muốn FK

// Bảng chính: CourseProgress
const CourseProgress = sequelize.define("CourseProgress", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Course,
      key: "course_id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  completionDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "course_progress",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

// Bảng LecturesProgress
const LecturesProgress = sequelize.define("LecturesProgress", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  courseProgressId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: CourseProgress,
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  lectureId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  viewed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dateViewed: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: "lectures_progress",
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

// CourseProgress.hasMany(LecturesProgress, { foreignKey: "courseProgressId", as: "lecturesProgress" });
// LecturesProgress.belongsTo(CourseProgress, { foreignKey: "courseProgressId" });

export { CourseProgress, LecturesProgress };
