import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const LuaChonKhaoSat = sequelize.define("LuaChonKhaoSat", {
  ma_lua_chon: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  ma_cau_hoi: {
    type: DataTypes.INTEGER.UNSIGNED,
  },
  noi_dung: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  la_dap_an_dung: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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
    tableName: "lua_chon_khao_sat",
    timestamps: false
  }
);

export default LuaChonKhaoSat;
