import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";


const Quiz = sequelize.define("Quiz", {
  quiz_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  instructor_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: "users", // tên bảng trong DB
      key: "user_id",
    },
    onDelete: "CASCADE",
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  duration: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  totalPoints: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: "total_points",
  },
  attempts: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("active", "draft", "archived"),
    defaultValue: "draft",
  },
  dueDate: {
    type: DataTypes.DATE,
    field: "due_date",
  },
}, {
  tableName: "quizzes",
  timestamps: true,
});
export default Quiz;
