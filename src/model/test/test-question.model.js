import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const CauHoi = sequelize.define("CauHoi", {
  ma_cau_hoi: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  // ma_phan: {
  //   type: DataTypes.INTEGER.UNSIGNED,
  //   allowNull: false
  // },
  // ma_nguoi_tao: {
  //   type: DataTypes.INTEGER.UNSIGNED,
  //   allowNull: false
  // },
  tieu_de: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  diem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 0
  },
  mo_ta: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  do_kho: {
    type: DataTypes.ENUM("de", "trung_binh", "kho"),
    defaultValue: "trung_binh"
  },
  loai_cau_hoi: {
    type: DataTypes.ENUM("trac_nghiem", "tu_luan"),
    allowNull: false
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
    tableName: "cau_hoi",
    timestamps: false
  }
);

export default CauHoi;
