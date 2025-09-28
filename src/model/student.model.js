// src/model/student.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Course from "./course.model.js";

const Student = sequelize.define("Student", {
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
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paidAmount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "students",
  timestamps: true,
});

// Course.hasMany(Student, { foreignKey: "course_id", as: "students" });
// Student.belongsTo(Course, { foreignKey: "course_id" });

export default Student;
