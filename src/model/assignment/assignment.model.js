import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const BaiTap = sequelize.define("BaiTap", {
  ma_bai_tap: {                     // assignment_id
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  },
  tieu_de: {                        // title
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  ma_khoa_hoc: {                    // course_id
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  ma_giang_vien: {                  // ma_giang_vien
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  danh_sach_ma_hoc_vien: {          // student_ids (JSON hoặc danh sách ID học viên)
    type: DataTypes.JSON,
    allowNull: true,
  },
  mo_ta: {                          // mo_ta
    type: DataTypes.TEXT,
    allowNull: true,
  },
  han_nop: {                        // due_date / deadline
    type: DataTypes.DATE,
    allowNull: false,
  },
  trang_thai: {                     // status: pending / submitted / graded
    type: DataTypes.ENUM("cho_xu_ly", "da_nop", "da_cham"),
    defaultValue: "cho_xu_ly",
  },
  diem: {                           // grade
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  ngay_nop: {                       // submission_date
    type: DataTypes.DATE,
    allowNull: true,
  },
  dinh_kem: {                       // attachments (JSON lưu file đính kèm)
    type: DataTypes.TEXT("long"),
    allowNull: true,
    get() {
      const value = this.getDataValue("dinh_kem");
      try {
        return value ? JSON.parse(value) : null;
      } catch {
        return value;
      }
    },
    set(value) {
      this.setDataValue("dinh_kem", JSON.stringify(value));
    },
  },
  phan_hoi: {                       // feedback
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ngay_tao: {                       // created_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: {                  // updated_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "bai_tap",
  timestamps: false,
});

export default BaiTap;
