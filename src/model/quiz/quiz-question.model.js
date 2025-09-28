import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const QuizQuestion = sequelize.define("QuizQuestion", {
  quizQuestion_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("multiple-choice", "true-false", "short-answer"),
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  correctAnswer: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "correct_answer",
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "quiz_questions",
  timestamps: true,
});

// Associations
// Quiz.hasMany(QuizQuestion, { foreignKey: "quiz_id" });
// QuizQuestion.belongsTo(Quiz, { foreignKey: "quiz_id" });

export default QuizQuestion;
