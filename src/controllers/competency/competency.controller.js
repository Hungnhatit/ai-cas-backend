import TieuChiDanhGia from "../../model/competency/criteria.model.js"

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