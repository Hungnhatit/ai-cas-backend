import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const CauHoiKhaoSat = sequelize.define("CauHoiKhaoSat", {
  ma_cau_hoi: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
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
  tableName: "cau_hoi_khao_sat",
  timestamps: false,
});

export default CauHoiKhaoSat;