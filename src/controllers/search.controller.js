import { Op } from "sequelize";
import BaiViet from "../model/post/post.model.js";
import BaiKiemTra from "../model/test/test.model.js";

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query; 

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập từ khóa tìm kiếm",
      });
    }

    const keyword = q.trim();
   
    const [posts, exams] = await Promise.all([
      
      BaiViet.findAll({
        where: {
          tieu_de: { [Op.like]: `%${keyword}%` }, 
          
        },
        limit: 5, 
        attributes: ["ma_bai_viet", "tieu_de", "tom_tat", "anh_bia", "ngay_tao"], 
      }),

      
      BaiKiemTra.findAll({
        where: {
          tieu_de: { [Op.like]: `%${keyword}%` },
        },
        limit: 5,
        attributes: ["ma_kiem_tra", "tieu_de", "mo_ta"],
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        posts,
        exams,
        total: posts.length + exams.length
      },
    });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi tìm kiếm",
    });
  }
};