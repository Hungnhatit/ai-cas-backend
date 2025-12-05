import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import ChiTietDanhGia from "./review-detail.model.js";

const KhungNangLuc = sequelize.define('KhungNangLuc', {
  ma_khung_nang_luc: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ten_nang_luc: DataTypes.TEXT,
  mo_ta: DataTypes.TEXT,
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
    tableName: "khung_nang_luc",
    timestamps: false,
  }
);

KhungNangLuc.hasMany(ChiTietDanhGia, {
  foreignKey: 'ma_khung_nang_luc',
  as: 'chi_tiet_danh_gia'
});

ChiTietDanhGia.belongsTo(KhungNangLuc, {
  foreignKey: 'ma_khung_nang_luc',
  as: 'khung_nang_luc'
});



export default KhungNangLuc;