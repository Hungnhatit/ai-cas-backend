import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const Test = sequelize.define('Test', {
  test_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
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