import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const CauHoiTuLuan = sequelize.define("CauHoiTuLuan", {
  ma_cau_hoi_tu_luan: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true
  },
  giai_thich: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  dap_an_mau: {
    type: DataTypes.TEXT,
    allowNull: true
  },
},
  {
    tableName: "cau_hoi_tu_luan",
    timestamps: false
  }
);

export default CauHoiTuLuan;
