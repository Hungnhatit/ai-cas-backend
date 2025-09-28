import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Question from "./question.model.js";

const Option = sequelize.define('Option', {
  option_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
  },
  question_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: Question,
      key: 'question_id'
    },
    onDelete: 'CASCADE'
  },
  option_label: {
    type: DataTypes.CHAR,
    allowNull: false,
  },
  option_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
},
  {
    tableName: 'options',
    timestamps: true
  }
);

// Question.hasMany(Option, { foreignKey: "question_id", onDelete: "CASCADE" });
// Option.belongsTo(Question, { foreignKey: "question_id" });

export default Option;
