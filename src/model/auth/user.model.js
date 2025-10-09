import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const NguoiDung = sequelize.define("NguoiDung", {
  ma_nguoi_dung: {              // user_id
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  ten: {                        // name
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {                      // email
    type: DataTypes.STRING,
    allowNull: false,
  },
  mat_khau: {                   // password
    type: DataTypes.STRING,
    allowNull: false,
  },
  vai_tro: {                    // role
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: "nguoi_dung",      // users → nguoi_dung
  timestamps: true,
  createdAt: "ngay_tao",        
  updatedAt: "ngay_cap_nhat",
});

export default NguoiDung;
