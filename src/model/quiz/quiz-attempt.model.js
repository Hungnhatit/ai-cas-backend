import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Test from "./test.model.js"; // corresponds to ma_kiem_tra
import Student from "../student/student.model.js"; // corresponds to ma_hoc_vien

const QuizAttempt = sequelize.define(
  "QuizAttempt",
  {
    ma_lan_lam_kt: {                             // quizAttempt_id
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ma_kiem_tra: {                               // test_id
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Test,
        key: "ma_kiem_tra",
      },
      onDelete: "CASCADE",
    },
    ma_hoc_vien: {                               // student_id
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Student,
        key: "ma_hoc_vien",
      },
      onDelete: "CASCADE",
    },
    cau_tra_loi: {                               // answers (JSON)
      type: DataTypes.JSON,
      allowNull: true,
    },
    diem: {                                      // score
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    thoi_gian_bat_dau: {                         // start_time
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    thoi_gian_ket_thuc: {                        // end_time
      type: DataTypes.DATE,
      allowNull: true,
    },
    trang_thai: {                                // status
      type: DataTypes.ENUM("dang_lam", "da_nop", "da_cham"),
      defaultValue: "dang_lam",
    },
    ngay_tao: {                                  // created_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ngay_cap_nhat: {                             // updated_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "lan_lam_kiem_tra",
    timestamps: true,
    createdAt: "ngay_tao",
    updatedAt: "ngay_cap_nhat",
  }
);

// Associations
Test.hasMany(QuizAttempt, {
  foreignKey: "ma_kiem_tra",
  as: "lan_lam_kiem_tra",
  onDelete: "CASCADE",
});

Student.hasMany(QuizAttempt, {
  foreignKey: "ma_hoc_vien",
  as: "lich_su_lam_kiem_tra",
  onDelete: "CASCADE",
});

QuizAttempt.belongsTo(Test, {
  foreignKey: "ma_kiem_tra",
  as: "bai_kiem_tra",
  onDelete: "CASCADE",
});

QuizAttempt.belongsTo(Student, {
  foreignKey: "ma_hoc_vien",
  as: "hoc_vien",
  onDelete: "CASCADE",
});

export default QuizAttempt;
