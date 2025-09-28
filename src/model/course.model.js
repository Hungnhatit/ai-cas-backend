// src/model/course.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import Category from "./category.model.js";
import Purchase from "./purchase.model.js";

// main table: Courses
const Course = sequelize.define("Course", {
  course_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  tableName: "courses",
  timestamps: false,
});

// Category.hasMany(Course, { foreignKey: 'category_id' });
// Course.belongsTo(Category, { foreignKey: "category_id", as: "category" });
// Course.hasMany(Purchase, { foreignKey: "course_id", as: "purchases" });

export default Course;
