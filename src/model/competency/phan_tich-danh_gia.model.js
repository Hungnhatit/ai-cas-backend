import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const PhanTichDanhGia = sequelize.define(
  "PhanTichDanhGia",
  {
    ma_phan_tich: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    ma_danh_gia: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },

    tong_quan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    de_xuat_cai_thien: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    huong_phat_trien: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ke_hoach_ngan_han: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ke_hoach_dai_han: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    tai_nguyen_de_xuat: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    ngay_tao: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    },

    ngay_cap_nhat: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    },
  },
  {
    tableName: "phan_tich_danh_gia",
    timestamps: false,
  }
);

export default PhanTichDanhGia;
