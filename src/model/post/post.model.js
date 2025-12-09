import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const BaiViet = sequelize.define(
  "BaiViet",
  {
    ma_bai_viet: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    ma_tac_gia: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    tieu_de: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    tom_tat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    noi_dung: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    trang_thai: {
      type: DataTypes.ENUM("nhap", "cho_duyet", "da_dang"),
      allowNull: true,
      defaultValue: "nhap",
    },

    ngay_tao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },

    ngay_cap_nhat: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  },
  {
    tableName: "bai_viet",
    timestamps: false,
  }
);

export default BaiViet;
