import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import KhungNangLuc from "./competency.model.js";

const TieuChiDanhGia = sequelize.define('TieuChiDanhGia', {
  ma_tieu_chi: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ma_khung_nang_luc: DataTypes.INTEGER,
  ten_tieu_chi: DataTypes.TEXT,
  mo_ta: DataTypes.TEXT,
  trong_so: DataTypes.DECIMAL(5, 2),
  ngay_tao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  ngay_cap_nhat: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
},
  {
    tableName: 'tieu_chi_danh_gia',
    timestamps: false,
  });

KhungNangLuc.hasMany(TieuChiDanhGia, {
  as: 'tieu_chi_danh_gia',
  foreignKey: 'ma_khung_nang_luc'
});

TieuChiDanhGia.belongsTo(KhungNangLuc, {
  as: 'khung_nang_luc',
  foreignKey: 'ma_khung_nang_luc'
});

export default TieuChiDanhGia;
