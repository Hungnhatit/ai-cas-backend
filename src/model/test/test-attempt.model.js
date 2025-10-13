// models/LanLamBaiKiemTra.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const LanLamBaiKiemTra = sequelize.define("LanLamBaiKiemTra", {
  ma_lan_lam: { // test_attempt_id
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  ma_kiem_tra: { // test_id
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  ma_hoc_vien: { // student_id
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  cau_tra_loi: { // answers (JSON)
    type: DataTypes.JSON,
    allowNull: true,
  },
  diem: { // score
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  thoi_gian_bat_dau: { // start_time
    type: DataTypes.DATE,
    allowNull: false,
  },
  thoi_gian_ket_thuc: { // end_time
    type: DataTypes.DATE,
    allowNull: true,
  },
  trang_thai: { // status
    type: DataTypes.ENUM("dang_lam", "hoan_thanh", "da_nop"),
    defaultValue: "dang_lam",
  },
  ngay_tao: { // created_at
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: { // updated_at
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "lan_lam_kiem_tra",
  timestamps: false, 
  underscored: true,
});

export default LanLamBaiKiemTra;
