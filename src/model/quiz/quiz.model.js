import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import Instructor from "../instructor/instructor.model.js";

const Quiz = sequelize.define(
  "Quiz",
  {
    ma_bai_trac_nghiem: {                         // quiz_id
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      comment: "quiz_id",
    },
    ma_giang_vien: {                              // instructor_id
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Instructor,
        key: "ma_giang_vien",
      },
      onDelete: "CASCADE",
      comment: "instructor_id",
    },
    tieu_de: {                                    // title
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "title",
    },
    khoa_hoc: {                                   // course
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: "course",
    },
    mo_ta: {                                      // description
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "description",
    },
    thoi_luong: {                                 // duration
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "duration (minutes)",
    },
    tong_diem: {                                  // total_points
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "total_points",
    },
    so_lan_lam: {                                 // attempts
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "attempts count",
    },
    trang_thai: {                                 // status
      type: DataTypes.ENUM("hoat_dong", "ban_nhap", "luu_tru"),
      allowNull: false,
      defaultValue: "ban_nhap",
      comment: "status",
    },
    che_do_xem: {                                 // visibility
      type: DataTypes.ENUM("cong_khai", "rieng_tu", "da_giao"),
      allowNull: false,
      defaultValue: "cong_khai",
      comment: "visibility",
    },
    han_nop: {                                    // due_date
      type: DataTypes.DATE,
      allowNull: true,
      comment: "due_date",
    },
    ngay_tao: {                                   // created_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "created_at",
    },
    ngay_cap_nhat: {                              // updated_at
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "updated_at",
    },
  },
  {
    tableName: "bai_trac_nghiem",
    timestamps: false, // vì trong DB bạn đã có trường timestamp riêng
  }
);

export default Quiz;
