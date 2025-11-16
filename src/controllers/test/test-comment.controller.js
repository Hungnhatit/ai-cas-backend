/**
 * Create or reply a comment
 */
export const createComment = async (req, res) => {
  try {
    const { ma_kiem_tra, ma_nguoi_dung, noi_dung, ma_binh_luan_goc } = req.body;

    if (!ma_kiem_tra || !ma_nguoi_dung || !noi_dung) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: ma_kiem_tra, ma_nguoi_dung, noi_dung"
      });
    }

    const newComment = await BinhLuanBaiKiemTra.create({
      ma_kiem_tra,
      ma_nguoi_dung,
      noi_dung,
      ma_binh_luan_goc: ma_binh_luan_goc || null
    });

    return res.status(201).json({
      success: true,
      message: ma_binh_luan_goc ? "Reply comment created successfully" : "Comment created successfully",
      data: newComment
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * Get comments by test ID
 */
export const getCommentsByTestId = async (req, res) => {
  try {
    const { testId } = req.params;

    const comments = await BinhLuanBaiKiemTra.findAll({
      where: { ma_kiem_tra: testId, ma_binh_luan_goc: null },
      include: [
        { model: NguoiDung, as: "nguoi_dung", attributes: ["ma_nguoi_dung", "ten", "email"] },
        {
          model: BinhLuanBaiKiemTra,
          as: "binh_luan_phan_hoi",
          include: [
            { model: NguoiDung, as: "nguoi_dung", attributes: ["ma_nguoi_dung", "ten", "email"] }
          ]
        }
      ],
      order: [["ngay_tao", "ASC"]]
    });

    return res.status(200).json({
      success: true,
      message: `Comments fetched successfully for test ID ${testId}`,
      data: comments
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * Update a comment
 */
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { noi_dung } = req.body;

    const comment = await BinhLuanBaiKiemTra.findByPk(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    comment.noi_dung = noi_dung || comment.noi_dung;
    comment.ngay_cap_nhat = new Date();
    await comment.save();

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await BinhLuanBaiKiemTra.findByPk(id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    await comment.destroy(); // thanks to ON DELETE CASCADE, replies are deleted automatically

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};