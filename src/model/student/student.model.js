import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Instructor from "../instructor/instructor.model.js";
const Student = sequelize.define("Student", {
  ma_hoc_vien: {                            // student_id
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  ma_giang_vien: {                          // instructor_id
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: Instructor,
      key: "ma_giang_vien",
    },
    onDelete: "SET NULL",
  },
  mat_khau: {                               // password
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ten: {                                    // name
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {                                  // email
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  anh_dai_dien: {                           // avatar
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  khoa_hoc_da_dang_ky: {                   // enrolled_courses_count
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  khoa_hoc_hoan_thanh: {                   // completed_courses_count
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  tien_do: {                               // progress_percentage
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  ngay_tham_gia: {                         // join_date
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  ngay_tao: {                              // created_at
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: {                         // updated_at
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "hoc_vien",
  timestamps: false, // vì DB đã có cột ngay_tao / ngay_cap_nhat
});

export default Student;
