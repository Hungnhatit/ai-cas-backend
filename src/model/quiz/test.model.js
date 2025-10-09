import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const Test = sequelize.define('Test', {
  ma_kiem_tra: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mo_ta: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
},
  {
    tableName: 'tests',
    timestamps: true
  }
);

export default Test;