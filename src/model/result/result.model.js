import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.js";

const KetQuaAI = sequelize.define(
  "KetQuaAI",
  {
    ket_qua_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    ma_lan_lam: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false
    },
    hieu_biet_ai: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ung_dung_cong_cu: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tu_duy_sang_tao: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    dao_duc_ai: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tong_diem: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    xep_loai: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    nhan_xet: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phan_tich: {
      type: DataTypes.JSON,
      allowNull: true
    },
    goi_y_hoc_tap: {
      type: DataTypes.JSON,
      allowNull: true
    },
    ngay_danh_gia: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ngay_tao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    ngay_cap_nhat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "ket_qua_ai",
    timestamps: false
  }
);

KetQuaAI.associate = (models) => {
  KetQuaAI.belongsTo(models.LanLamKiemTra, {
    foreignKey: "ma_lan_lam",
    targetKey: "ma_lan_lam",
    as: "lan_lam"
  });
};

export default KetQuaAI;