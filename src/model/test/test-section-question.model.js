import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const PhanKiemTraCauHoi = sequelize.define("phan_kiem_tra_cau_hoi", {
  ma_phan: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
  },
  ma_cau_hoi: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
  },
},
  {
    tableName: "phan_kiem_tra_cau_hoi",
    timestamps: false,
  }
);

export default PhanKiemTraCauHoi;