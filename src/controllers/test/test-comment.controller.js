import BinhLuanBaiKiemTra from "../../model/test/test-comment.model.js";
import NguoiDung from "../../model/user.model.js";

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

    const populatedComment = await BinhLuanBaiKiemTra.findByPk(newComment.ma_binh_luan, {
      include: [
        { model: NguoiDung, as: 'nguoi_dung', attributes: ['ma_nguoi_dung', 'ten', 'email'] }
      ]
    })

    return res.status(201).json({
      success: true,
      message: ma_binh_luan_goc ? "Reply comment created successfully" : "Comment created successfully",
      data: populatedComment
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

/**
 * Get comments by test ID
 */
// sử dụng đệ quy
export const getCommentsByTestId = async (req, res) => {
  try {
    const { test_id } = req.params;

    // get all test comments
    const allComments = await BinhLuanBaiKiemTra.findAll({
      where: { ma_kiem_tra: test_id },
      include: [
        {
          model: NguoiDung,
          as: "nguoi_dung",
          attributes: ["ma_nguoi_dung", "ten", "email", "anh_dai_dien"]
        },
        {
          model: BinhLuanBaiKiemTra,
          as: "binh_luan_cha",
          include: [
            {
              model: NguoiDung,
              as: "nguoi_dung",
              attributes: ["ma_nguoi_dung", "ten"]
            }
          ]
        }
      ],
      order: [["ngay_tao", "ASC"]]
    });

    const totalComments = allComments.length;

    // build an infinite level comment tree
    const buildTree = (comments) => {
      const map = {};
      const roots = [];

      comments.forEach((c) => {
        map[c.ma_binh_luan] = {
          ...c,
          binh_luan_phan_hoi: []
        };
      });

      comments.forEach((c) => {
        if (c.ma_binh_luan_goc === null) {
          roots.push(map[c.ma_binh_luan]);
        } else {
          if (map[c.ma_binh_luan_goc]) {
            map[c.ma_binh_luan_goc].binh_luan_phan_hoi.push(
              map[c.ma_binh_luan]
            );
          }
        }
      });

      return roots;
    };

    const formatted = allComments.map(c => ({
      ...c.dataValues,
      reply_to_user_id: c.binh_luan_cha?.nguoi_dung?.ma_nguoi_dung || null,
      reply_to_user_name: c.binh_luan_cha?.nguoi_dung?.ten || null
    }));

    const commentTree = buildTree(formatted);

    return res.status(200).json({
      success: true,
      message: `Get comments tree for test ${test_id} successfully`,
      total_comments: totalComments,
      data: commentTree
    });

  } catch (error) {
    console.error("Lỗi lấy comment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

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
    const { comment_id } = req.params;
    const ma_nguoi_dung = req.user.ma_nguoi_dung;

    const comment = await BinhLuanBaiKiemTra.findByPk(comment_id);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    await comment.destroy();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};