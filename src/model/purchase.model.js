import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Purchase = sequelize.define("Purchase", {
  purchase_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  ma_nguoi_dung: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  course_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "failed"),
    defaultValue: "pending",
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  purchasedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "purchase",
  timestamps: true,
});

export default Purchase;
