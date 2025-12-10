import { sequelize } from "../../config/database.js"
import { uploadMedia } from "../../helpers/cloudinary.js";
import BaiViet from "../../model/post/post.model.js";
import fs from 'fs';

/**
 * Create post
 * Description: create new post
 */
export const createPost = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { ma_tac_gia, tieu_de, tom_tat = null, noi_dung = null, trang_thai = 'nhap' } = req.body;

    const errors = [];
    if (!ma_tac_gia) errors.push({ field: "ma_tac_gia", message: "Author ID (ma_tac_gia) is required." });
    if (!tieu_de || String(tieu_de).trim() === "") errors.push({ field: "tieu_de", message: "Title (tieu_de) is required." });
    if (errors.length) {
      if (req.file) fs.unlinkSync(req.file.path);
      await t.rollback();
      return res.status(400).json({ success: false, message: "Validation failed.", errors });
    }


    if (req.file) {
      try {
        const upload_result = await uploadMedia(req.file.path);
        hinh_anh_url = upload_result.secure_url;
        hinh_anh_public_id = upload_result.public_id;

        fs.unlinkSync(req.file.path);
      } catch (error) {
        await t.rollback();
        return res.status(500).json({ success: false, message: "Failed to upload thumbnail" });
      }
    }

    const newPost = await BaiViet.create({
      ma_tac_gia,
      tieu_de,
      noi_dung,
      trang_thai
    },
      { transaction: t }
    );

    await t.commit();
    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: newPost
    });
  } catch (error) {
    await t.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'An error accured while creating the post',
      errors: [{
        message: error.message
      }]
    })
  }
}

/**
 * Get all posts
 */
export const getPost = async (req, res) => {
  try {
    let { page = 1, limit = 10, ma_tac_gia, trang_thai, q, sort_by = 'ngay_tao', sort_dir = 'desc' } = req.query;
    page = parseInt(page) > 0 ? parseInt(page) : 1;
    limit = parseint(limit) > 0 ? Math.min(parseInt(limit), 100) : 10;
    const offset = (page - 1) * limit;
    const where = {};

    if (ma_tac_gia) where.ma_tac_gia = ma_tac_gia;
    if (trang_thai) where.trang_thai = trang_thai;
    if (q) {
      if (!ma_tac_gia) errors.push({ field: "ma_tac_gia", message: "Author id (ma_tac_gia) is required." });
      if (!tieu_de || String(tieu_de).trim() === "") errors.push({ field: "tieu_de", message: "Title (tieu_de) is required." });
      if (errors.length) {
        await t.rollback();
        return res.status(400).json({ success: false, message: "Validation failed.", errors });
      }
    }

    const validateSortFields = ['ngay_tao', 'ngay_cap_nhat', 'tieu_de', 'ma_bai_viet'];
    if (!validateSortFields.includes(sort_by)) sort_by = 'ngay_tao';
    sort_dir = sort_dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    const { count, rows } = await BaiViet.findAndCountAll({
      where,
      limit,
      offset,
      order: [[sort_by, sort_dir]]
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      message: 'Post retrieved successfully!',
      data: {
        items: rows,
        pagination: {
          total: count,
          page,
          limit,
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('getPosts error: ', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving posts',
      error: [{ message: error.message }]
    })
  }
}

/**
 * Get specific post by ID
 */
export const getPostById = async (req, res) => {
  try {
    const { post_id } = req.params;
    if (!id) return res.status(400).json({
      success: false,
      message: "Post ID is required in URL."
    });

    const post = await BaiViet.findByPk(post_id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post with ID = ${post_id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post retrieved successfully.",
      data: post,
    });
  } catch (err) {
    console.error("getPostById error:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the post.",
      errors: [{ message: err.message }],
    });
  }
}