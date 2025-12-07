import { sequelize } from "../../config/database.js";
import KhungNangLuc from "../../model/competency/competency.model.js";
import TieuChiDanhGia from "../../model/competency/criteria.model.js"

export const getCompetencies = async (req, res) => {
  try {
    const competencies = await KhungNangLuc.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              select count(*)
              from tieu_chi_danh_gia as t
              where t.ma_khung_nang_luc = KhungNangLuc.ma_khung_nang_luc
              )`),
            'tong_so_tieu_chi'
          ]
        ]
      },
      include: [
        { model: TieuChiDanhGia, as: 'tieu_chi_danh_gia' }
      ]
    });

    return res.status(200).json({
      success: true,
      message: 'Fetched successfully!',
      data: competencies
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error when fetching competencies',
    })
  }
}

export const getAllCriterias = async (req, res) => {
  try {
    const criterias = await TieuChiDanhGia.findAll();
    return res.status(200).json({
      success: true,
      message: `Fetched ${criterias.length} criterias successfully`,
      data: criterias
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error fetching criterias: ${error.message}`,
    });
  }
}

export const getCompetencyById = async (req, res) => {
  try {
    const { competency_id } = req.params;

    const competency = await KhungNangLuc.findByPk(competency_id, {
      include: [
        { model: TieuChiDanhGia, as: 'tieu_chi_danh_gia' }
      ]
    });

    if (!competency) {
      return res.status(404).json({
        success: false,
        message: 'Competency not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: "Fetched successfully",
      data: competency
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}