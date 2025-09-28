import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
  {
    tableName: "categories",
    timestamps: false
  }
); 

export default Category;