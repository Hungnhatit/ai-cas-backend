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
    user_id: {
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

// UserProgress.belongsTo(User, { foreignKey: "user_id", as: "user" });
// User.hasMany(UserProgress, { foreignKey: "user_id", as: "progress" });

export default UserProgress;
