import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const CauTraLoiNhieuLuaChon = sequelize.define('CauTraLoiNhieuLuaChon', {
  ma_tra_loi: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  ma_lan_lam: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  ma_cau_hoi: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  tra_loi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  diem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
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
},
  {
    sequelize,
    tableName: 'cau_tra_loi_khao_sat_hoc_vien',
    timestamps: false,
  }
);

export default CauTraLoiNhieuLuaChon;