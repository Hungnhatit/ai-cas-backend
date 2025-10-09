import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Question from "./question.model.js";

const Option = sequelize.define(
  "LuaChon",
  {
    ma_lua_chon: {                            // option_id
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
    },
    ma_cau_hoi: {                             // question_id
      type: DataTypes.CHAR(36),
      allowNull: true,
      references: {
        model: Question,
        key: "ma_cau_hoi",
      },
      onDelete: "CASCADE",
    },
    nhan_lua_chon: {                          // option_label
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    noi_dung_lua_chon: {                      // option_text
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ngay_tao: {                               // created_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ngay_cap_nhat: {                          // updated_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "lua_chon",
    timestamps: true,             // Sequelize tự map thời gian
    createdAt: "ngay_tao",        // ánh xạ createdAt → ngay_tao
    updatedAt: "ngay_cap_nhat",   // ánh xạ updatedAt → ngay_cap_nhat
  }
);

// Associations
// Question.hasMany(Option, {
//   foreignKey: "ma_cau_hoi",
//   as: "lua_chon",
//   onDelete: "CASCADE",
// });

// Option.belongsTo(Question, {
//   foreignKey: "ma_cau_hoi",
//   as: "cau_hoi",
//   onDelete: "CASCADE",
// });

export default Option;
