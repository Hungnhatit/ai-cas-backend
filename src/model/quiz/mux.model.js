import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Chapter from "./chapter.model.js";

const MuxData = sequelize.define(
  "MuxData",
  {
    ma_mux: {                                // muxdata_id
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    ma_tai_san: {                            // asset_id
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ma_phat_lai: {                           // playback_id
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ma_chuong: {                             // chapter_id
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Chapter,
        key: "ma_chuong",
      },
      onDelete: "CASCADE",
    },
    ngay_tao: {                              // created_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ngay_cap_nhat: {                         // updated_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "du_lieu_mux",
    timestamps: true,              // Cho phép Sequelize tự quản lý
    createdAt: "ngay_tao",         // ánh xạ sang cột "ngay_tao"
    updatedAt: "ngay_cap_nhat",    // ánh xạ sang cột "ngay_cap_nhat"
  }
);

// // Associations
// Chapter.hasOne(MuxData, {
//   foreignKey: "ma_chuong",
//   as: "du_lieu_mux",
//   onDelete: "CASCADE",
// });

// MuxData.belongsTo(Chapter, {
//   foreignKey: "ma_chuong",
//   as: "chuong",
//   onDelete: "CASCADE",
// });

export default MuxData;
