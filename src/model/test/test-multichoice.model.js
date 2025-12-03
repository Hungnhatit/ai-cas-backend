// models/CauHoiTracNghiem.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const CauHoiTracNghiem = sequelize.define("CauHoiTracNghiem", {
  ma_cau_hoi_trac_nghiem: { 
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
  },
  giai_thich_dap_an: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ngay_tao: { 
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: { 
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "cau_hoi_trac_nghiem",
  timestamps: false,
  underscored: true,
});

export default CauHoiTracNghiem;
