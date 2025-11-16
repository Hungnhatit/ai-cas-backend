import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const BinhLuanBaiKiemTra = sequelize.define("BinhLuanBaiKiemTra", {
  ma_binh_luan: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  ma_kiem_tra: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  ma_nguoi_dung: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false
  },
  ma_binh_luan_goc: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true
  },
  noi_dung: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  ngay_tao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ngay_cap_nhat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
},
  {
    tableName: "binh_luan_bai_kiem_tra",
    timestamps: false
  }
);

export default BinhLuanBaiKiemTra;