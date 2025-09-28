import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import User from '../auth/user.model.js'
import Test from "./test.model.js";

const Result = sequelize.define('Result', {
  result_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  test_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    references: {
      model: Test,
      key: 'test_id'
    },
  },
  score: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }

},
  {
    tableName: 'results',
    timestamps: false
  }
);

// Result.belongsTo(User, { foreignKey: 'result_id' });
// Result.belongsTo(Test, { foreignKey: "test_id" });

// User.hasMany(Result, { foreignKey: 'user_id' });
// Test.hasMany(Result, { foreignKey: 'test_id' });

export default Result;
