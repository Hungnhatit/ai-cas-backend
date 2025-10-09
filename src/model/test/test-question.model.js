// models/CauHoiKiemTra.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import BaiKiemTra from "./test.model.js";

const CauHoiKiemTra = sequelize.define("CauHoiKiemTra", {
  ma_cau_hoi: { // test_question_id
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  ma_bai_kiem_tra: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: BaiKiemTra,
      key: 'ma_kiem_tra'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  // ma_phan: { // section_id
  //   type: DataTypes.INTEGER.UNSIGNED,
  //   allowNull: false,
  // },
  cau_hoi: { // question_text
    type: DataTypes.TEXT,
    allowNull: false,
  },
  loai: {
    type: DataTypes.ENUM("trac_nghiem", "dung_sai", "tra_loi_ngan", "tu_luan"),
    allowNull: false,
  },
  lua_chon: { // options (JSON)
    type: DataTypes.JSON,
    allowNull: true,
  },
  dap_an_dung: { // correct_answer
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  diem: { // points
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ngay_tao: { // created_at
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: { // updated_at
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "cau_hoi_kiem_tra",
  timestamps: false,
  underscored: true,
});

export default CauHoiKiemTra;
