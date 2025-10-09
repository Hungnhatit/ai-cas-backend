import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const GiaoBaiTracNghiem = sequelize.define("GiaoBaiTracNghiem", {
  ma_giao_bai: { // assignment_id
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  ma_bai_trac_nghiem: { // quiz_id
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  ma_hoc_vien: { // student_id
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  nguoi_giao: { // assigned_by (giảng viên giao bài)
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  thoi_gian_giao: { // assigned_at
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  trang_thai: { // status
    type: DataTypes.ENUM("da_giao", "dang_lam", "hoan_thanh", "het_han"),
    allowNull: false,
    defaultValue: "da_giao",
  },
  ngay_tao: { // created_at
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: { // updated_at
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "giao_bai_trac_nghiem",
  timestamps: false, // vì bảng đã có cột ngày_tao & ngày_cap_nhat
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ["ma_bai_trac_nghiem", "ma_hoc_vien"],
      name: "uq_bai_trac_nghiem_hoc_vien"
    }
  ]
});

export default GiaoBaiTracNghiem;
