import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import User from "../auth/user.model.js";
import Test from "./test.model.js";

const Result = sequelize.define(
  "Result",
  {
    ma_ket_qua: {                           // result_id
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
    },
    ma_nguoi_dung: {                        // ma_nguoi_dung (FK -> nguoi_dung)
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "ma_nguoi_dung",
      },
      onDelete: "CASCADE",
    },
    ma_kiem_tra: {                          // ma_kiem_tra (FK -> bai_kiem_tra)
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Test,
        key: "ma_kiem_tra",
      },
      onDelete: "SET NULL",
    },
    diem: {                                 // score
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    thoi_gian_nop: {                        // submitted_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ket_qua",
    timestamps: false, // DB đã có timestamp riêng
  }
);

// Associations (khuyến nghị bật trong index.js hoặc sau khi import hết model)
/// User.hasMany(Result, { foreignKey: "ma_nguoi_dung" });
/// Result.belongsTo(User, { foreignKey: "ma_nguoi_dung" });

/// Test.hasMany(Result, { foreignKey: "ma_kiem_tra" });
/// Result.belongsTo(Test, { foreignKey: "ma_kiem_tra" });

export default Result;
