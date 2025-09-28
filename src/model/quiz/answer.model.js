import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Result from "./result.model.js";
import Question from "./question.model.js";

const Answer = sequelize.define('Answer', {
  answer_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  result_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Result,
      key: 'result_id'
    }
  },
  question_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Question,
      key: 'question_id'
    }
  },
  chosen_option: {
    type: DataTypes.CHAR,
    allowNull: false,
  }
}, {
  tableName: 'answers',
  timestamps: true
});

// Answer.belongsTo(Result, { foreignKey: 'result_id', onDelete: 'CASCADE' });
// Answer.belongsTo(Question, { foreignKey: 'question_id' });

// Result.hasMany(Answer, { foreignKey: 'result_id', onDelete: 'CASCADE' });
// Question.hasMany(Answer, { foreignKey: 'question_id' });

export default Answer;