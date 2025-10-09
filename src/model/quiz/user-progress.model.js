import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import User from '../auth/user.model.js';

const UserProgress = sequelize.define(
  "UserProgress",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ma_nguoi_dung: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    chapter_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    progress: {
      type: DataTypes.FLOAT, // ví dụ: 0.0 → 1.0 (0% → 100%)
      defaultValue: 0,
    },
  },
  {
    tableName: "user_progress",
    timestamps: true, 
  }
);

// UserProgress.belongsTo(User, { foreignKey: "ma_nguoi_dung", as: "user" });
// User.hasMany(UserProgress, { foreignKey: "ma_nguoi_dung", as: "progress" });

export default UserProgress;
