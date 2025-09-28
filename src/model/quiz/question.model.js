import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Test from "./test.model.js";

const Question = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
  },
  test_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: Test,
      key: 'test_id'
    },
    onDelete: 'CASCADE'
  },
  question_text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  correct_option: {
    type: DataTypes.CHAR,
    allowNull: false,
  }

},
  {
    tableName: 'questions',
    timestamps: true
  }
);

// Test.hasMany(Question, { foreignKey: "test_id", onDelete: "CASCADE" });
// Question.belongsTo(Test, { foreignKey: "test_id" });

export default Question;
