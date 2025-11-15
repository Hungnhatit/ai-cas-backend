import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const DanhMucBaiKiemTra = sequelize.define(
  "DanhMucBaiKiemTra",
  {
    ma_danh_muc: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ten_danh_muc: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mo_ta: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trang_thai: {
      type: DataTypes.ENUM("cho_duyet", "da_duyet", "tu_choi"),
      defaultValue: "cho_duyet",
    },
    nguoi_tao_danh_muc: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ngay_cap_nhat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "danh_muc_bai_kiem_tra",
    timestamps: false
  }
);

export default DanhMucBaiKiemTra;
