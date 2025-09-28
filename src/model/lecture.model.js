// src/model/lecture.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Course from "./course.model.js";

const Lecture = sequelize.define("Lecture", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
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
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  public_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  freePreview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "lectures",
  timestamps: true,
});

// Course.hasMany(Lecture, { foreignKey: "course_id", as: "curriculum" });
// Lecture.belongsTo(Course, { foreignKey: "course_id" });

export default Lecture;
