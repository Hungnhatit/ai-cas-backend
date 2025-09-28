import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  }
},
  {
    tableName: 'users',
    timestamps: true
  }
);

export default User;