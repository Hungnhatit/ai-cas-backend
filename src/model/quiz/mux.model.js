import { DataTypes } from "sequelize";
import Chapter from "./chapter.model.js";
import { sequelize } from "../../config/database.js";

const MuxData = sequelize.define(
  "MuxData",
  {
    muxdata_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    asset_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    playback_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    chapter_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "mux_data",
    timestamps: true, // Sequelize sẽ tự động map createdAt/updatedAt
    createdAt: "created_at", // map sang cột created_at
    updatedAt: "updated_at", // map sang cột updated_at
  }
);

// Quan hệ với bảng Chapter
// import Chapter từ model chapter của bạn
// (nếu file model chapter là models/chapter.js)

// Chapter.hasOne(MuxData, {
//   foreignKey: "chapter_id",
//   as: "muxData",
// });

// MuxData.belongsTo(Chapter, {
//   foreignKey: "chapter_id",
//   as: "chapter",
//   onDelete: "CASCADE",
// });

export default MuxData;
