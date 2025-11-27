import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const BaiKiemTraDanhMuc = sequelize.define(
  "bai_kiem_tra_danh_muc",
  {
    ma_kiem_tra: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: 'bai_kiem_tra', key: 'ma_kiem_tra' }
    },
    ma_danh_muc: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: { model: 'danh_muc_bai_kiem_tra', key: 'ma_danh_muc' }
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
    tableName: "bai_kiem_tra_danh_muc",
    timestamps: false
  }
);

export default BaiKiemTraDanhMuc