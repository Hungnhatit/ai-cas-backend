import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Test from "./test.model.js";

const Question = sequelize.define(
  "Question",
  {
    ma_cau_hoi: {                          // question_id
      type: DataTypes.CHAR(36),
      allowNull: false,
      primaryKey: true,
    },
    ma_kiem_tra: {                         // ma_kiem_tra
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: Test,
        key: "ma_kiem_tra",
      },
      onDelete: "CASCADE",
    },
    noi_dung_cau_hoi: {                    // question_text
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lua_chon_dung: {                       // correct_option
      type: DataTypes.CHAR(1),
      allowNull: false,
    },
    ngay_tao: {                            // created_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ngay_cap_nhat: {                       // updated_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "cau_hoi",
    timestamps: true,             // enable automatic timestamp tracking
    createdAt: "ngay_tao",        // map Sequelize createdAt → ngay_tao
    updatedAt: "ngay_cap_nhat",   // map Sequelize updatedAt → ngay_cap_nhat
  }
);

// // Associations
// Test.hasMany(Question, {
//   foreignKey: "ma_kiem_tra",
//   as: "cau_hoi",
//   onDelete: "CASCADE",
// });

// Question.belongsTo(Test, {
//   foreignKey: "ma_kiem_tra",
//   as: "kiem_tra",
//   onDelete: "CASCADE",
// });

export default Question;
