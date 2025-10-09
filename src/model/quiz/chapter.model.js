import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import KhoaHoc from "../course.model.js";          // Course → KhoaHoc
// import TienDoHocVien from "./user-progress.model.js"; // UserProgress → TienDoHocVien

/**
 * Table: chuong
 * mo_ta: Stores chapter information for each course.
 */
const Chuong = sequelize.define("Chuong", {
  ma_chuong: {                     // chapter_id
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  tieu_de: {                       // title
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  mo_ta: {                         // mo_ta
    type: DataTypes.TEXT,
    allowNull: true,
  },
  duong_dan_video: {               // video_url
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  vi_tri: {                        // position (order in course)
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  },
  da_xuat_ban: {                   // isPublished (1 = true, 0 = false)
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  mien_phi: {                      // isFree (1 = true, 0 = false)
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  ma_khoa_hoc: {                   // course_id
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: KhoaHoc,
      key: "ma_khoa_hoc",
    },
    onDelete: "CASCADE",
  },
  ngay_tao: {                      // created_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: {                 // updated_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "chuong",
  timestamps: false, // Database already manages created/updated timestamps
});


export default Chuong;
