import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";
import KetQua from "./result.model.js";       // Result model
import CauHoi from "./question.model.js";       // Question model

/**
 * Table: cau_tra_loi
 * mo_ta: Stores the student's selected answers for each question in a test result.
 * Old table: quiz_answer
 */
const CauTraLoi = sequelize.define("CauTraLoi", {
  ma_cau_tra_loi: {                 // answer_id (UUID)
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    allowNull: false,
  },
  ma_ket_qua: {                     // result_id (UUID)
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: KetQua,
      key: "ma_ket_qua",
    },
  },
  ma_cau_hoi: {                     // question_id (UUID)
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: CauHoi,
      key: "ma_cau_hoi",
    },
  },
  lua_chon_chon: {                  // chosen_option (A/B/C/D)
    type: DataTypes.CHAR(1),
    allowNull: false,
  },
  ngay_tao: {                       // created_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  ngay_cap_nhat: {                  // updated_at
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "cau_tra_loi",
  timestamps: false, // Database already manages timestamps
});


export default CauTraLoi;
