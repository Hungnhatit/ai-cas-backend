import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import LanLamBaiKiemTra from "./test-attempt.model.js";

const CauTraLoiHocVien = sequelize.define('CauTraLoiHocVien', {
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
    allowNull: true,
  },
  diem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
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
    tableName: 'cau_tra_loi_hoc_vien',
    timestamps: false,
  }
);

LanLamBaiKiemTra.hasMany(CauTraLoiHocVien, {
  foreignKey: 'ma_lan_lam',
  as: 'cau_tra_loi_hoc_vien',
});
CauTraLoiHocVien.belongsTo(LanLamBaiKiemTra, {
  foreignKey: 'ma_lan_lam',
  as: 'lan_lam_kiem_tra',
});


export default CauTraLoiHocVien;