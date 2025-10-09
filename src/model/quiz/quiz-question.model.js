import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const CauHoiTracNghiem = sequelize.define("CauHoiTracNghiem", {
  ma_cau_hoi_tn: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  ma_bai_trac_nghiem: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  cau_hoi: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  loai: {
    type: DataTypes.ENUM("trac_nghiem", "dung_sai", "tra_loi_ngan"),
    allowNull: false,
  },
  lua_chon: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  dap_an_dung: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  diem: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ngay_tao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "cau_hoi_trac_nghiem",
  timestamps: false, // Vì bạn đã có 'ngay_tao' và 'ngay_cap_nhat' rồi
});

// Associations
// (sẽ được định nghĩa ở file associations.js)
export default CauHoiTracNghiem;
