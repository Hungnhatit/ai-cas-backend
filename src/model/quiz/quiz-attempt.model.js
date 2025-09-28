import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Quiz from "./quiz.model.js";

const QuizAttempt = sequelize.define("QuizAttempt", {
  quizAttempt_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  student_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "student_id",
  },
  answers: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  score: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
    field: "start_time",
  },
  end_time: {
    type: DataTypes.DATE,
    field: "end_time",
  },
  status: {
    type: DataTypes.ENUM("in-progress", "completed", "submitted"),
    defaultValue: "in-progress",
  },
}, {
  tableName: "quiz_attempts",
  timestamps: true,
});

// Associations
// Quiz.hasMany(QuizAttempt, { foreignKey: "quiz_id" });
// QuizAttempt.belongsTo(Quiz, { foreignKey: "quiz_id" });

export default QuizAttempt;
