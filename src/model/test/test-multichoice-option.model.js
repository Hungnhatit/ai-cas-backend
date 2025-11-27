import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const LuaChonTracNghiem = sequelize.define("LuaChonTracNghiem", {
  ma_lua_chon: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  ma_cau_hoi_trac_nghiem: {
    type: DataTypes.INTEGER.UNSIGNED,
  },
  noi_dung: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  ngay_tao: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  la_dap_an_dung: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  ngay_cap_nhat: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
},
  {
    tableName: "lua_chon_trac_nghiem",
    timestamps: false
  }
);

export default LuaChonTracNghiem;
