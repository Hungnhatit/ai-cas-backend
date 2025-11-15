import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

/**
 * Table: giang_vien
 * mo_ta: Stores instructor information.
 */
const GiangVien = sequelize.define("GiangVien", {
  ma_giang_vien: {                 // instructor_id
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  ten: {                           // name
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {                         // email
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
  },
  mat_khau: {                      // password
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  so_dien_thoai: {                 // phone
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  anh_dai_dien: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  tieu_su: {                       // bio
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
  tableName: "giang_vien",
  timestamps: false, // disable auto timestamps, since DB columns already handle created/updated time
});

export default GiangVien;
