import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Test from "./test.model.js";              // corresponds to ma_kiem_tra
import Student from "../student/student.model.js"; // corresponds to ma_hoc_vien
import Instructor from "../instructor/instructor.model.js"; // corresponds to nguoi_giao

const QuizAssignment = sequelize.define(
  "QuizAssignment",
  {
    ma_giao_kiem_tra: {                           // quizAssignment_id
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    ma_kiem_tra: {                                // ma_kiem_tra
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Test,
        key: "ma_kiem_tra",
      },
      onDelete: "CASCADE",
    },
    ma_hoc_vien: {                                // student_id
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Student,
        key: "ma_hoc_vien",
      },
      onDelete: "CASCADE",
    },
    nguoi_giao: {                                 // assigned_by (ma_giang_vien)
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Instructor,
        key: "ma_giang_vien",
      },
      onDelete: "SET NULL",
    },
    thoi_gian_giao: {                             // assigned_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    trang_thai: {                                 // status
      type: DataTypes.ENUM("da_giao", "dang_lam", "hoan_thanh", "het_han"),
      defaultValue: "da_giao",
    },
    ngay_tao: {                                   // created_at
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    ngay_cap_nhat: {                              // updated_at
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "giao_bai_kiem_tra",
    timestamps: true,
    createdAt: "ngay_tao",       // map Sequelize createdAt -> ngay_tao
    updatedAt: "ngay_cap_nhat",  // map Sequelize updatedAt -> ngay_cap_nhat
  }
);

// // Associations
// Test.hasMany(QuizAssignment, {
//   foreignKey: "ma_kiem_tra",
//   as: "giao_bai_kiem_tra",
//   onDelete: "CASCADE",
// });

// Student.hasMany(QuizAssignment, {
//   foreignKey: "ma_hoc_vien",
//   as: "bai_kiem_tra_duoc_giao",
//   onDelete: "CASCADE",
// });

// Instructor.hasMany(QuizAssignment, {
//   foreignKey: "nguoi_giao",
//   as: "bai_kiem_tra_da_giao",
// });

// QuizAssignment.belongsTo(Test, {
//   foreignKey: "ma_kiem_tra",
//   as: "bai_kiem_tra",
//   onDelete: "CASCADE",
// });

// QuizAssignment.belongsTo(Student, {
//   foreignKey: "ma_hoc_vien",
//   as: "hoc_vien",
//   onDelete: "CASCADE",
// });

// QuizAssignment.belongsTo(Instructor, {
//   foreignKey: "nguoi_giao",
//   as: "giang_vien",
//   onDelete: "SET NULL",
// });

export default QuizAssignment;
