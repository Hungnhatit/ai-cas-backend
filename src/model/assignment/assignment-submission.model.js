import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const BaiNop = sequelize.define("BaiNop", {
  ma_bai_nop: {                    // submission_id
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ma_bai_tap: {                    // assignment_id
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  ma_hoc_vien: {                   // student_id
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  nop_luc: {                       // submitted_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  duong_dan_file: {                // file_url
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  trang_thai: {                    // status: pending / submitted / graded
    type: DataTypes.ENUM("cho_xu_ly", "da_nop", "da_cham"),
    defaultValue: "cho_xu_ly",
  },
  diem: {                          // grade
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  phan_hoi: {                      // feedback
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ngay_tao: {                      // created_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: {                 // updated_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "bai_nop",
  timestamps: false, // Disable Sequelize auto timestamps (DB already has created/updated columns)
});

export default BaiNop;
