import DanhMucBaiKiemTra from "../../model/category.model.js";

/**
 * Get all categories
 * Description: 
 */
export const getAllCategories = async (req, res) => {
  try {
    const cates = await DanhMucBaiKiemTra.findAll({
      order: [['ngay_tao', 'DESC']]
    });

    if (!cates || cates.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found in the database.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${cates.length} categories retrieved successfully.`,
      data: cates,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching categories.",
      error: error.message,
    });
  }
}

/**
 * GET /api/test-categories/:id
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await DanhMucBaiKiemTra.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Test category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test category retrieved successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve test category.",
      error: error.message,
    });
  }
};

/**
 * POST /api/test-categories
 */
export const createCategory = async (req, res) => {
  try {
    const { ten_danh_muc, mo_ta, nguoi_tao_danh_muc } = req.body;

    if (!ten_danh_muc) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    const category = await DanhMucBaiKiemTra.create({
      ten_danh_muc,
      mo_ta,
      nguoi_tao_danh_muc,
    });

    return res.status(201).json({
      success: true,
      message: "Test category created successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create test category.",
      error: error.message,
    });
  }
};

/**
 * PUT /api/test-categories/:id
 */
export const updateCategory = async (req, res) => {
  try {
    const category = await DanhMucBaiKiemTra.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Test category not found.",
      });
    }

    const { ten_danh_muc, mo_ta, trang_thai } = req.body;

    await category.update({
      ten_danh_muc,
      mo_ta,
      trang_thai,
      ngay_cap_nhat: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Test category updated successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update test category.",
      error: error.message,
    });
  }
};

/**
 * PATCH /api/test-categories/:id/status
 */
export const updateCategoryStatus = async (req, res) => {
  try {
    const { trang_thai } = req.body;

    const category = await DanhMucBaiKiemTra.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Test category not found.",
      });
    }

    await category.update({
      trang_thai,
      ngay_cap_nhat: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Test category status updated successfully.",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update test category status.",
      error: error.message,
    });
  }
};

/**
 * DELETE /api/test-categories/:id
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await DanhMucBaiKiemTra.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Test category not found.",
      });
    }

    await category.destroy();

    return res.status(200).json({
      success: true,
      message: "Test category deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete test category.",
      error: error.message,
    });
  }
};