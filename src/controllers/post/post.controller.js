import { sequelize } from "../../config/database.js"
import { uploadMedia } from "../../helpers/cloudinary.js";
import DinhKemTaiLieu from "../../model/attachment.model.js";
import BaiViet from "../../model/post/post.model.js";
import fs from 'fs';

/**
 * Create post
 * Description: create new post
 */
export const createPost = async (req, res) => {
  const t = await sequelize.transaction();
  const cleanupFiles = (filesObject) => {
    if (!filesObject) return;
    Object.values(filesObject).flat().forEach(file => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
  };

  try {
    const { ma_tac_gia, tieu_de, tom_tat = null, anh_bia, noi_dung = null, trang_thai = 'nhap' } = req.body;

    // validate data
    if (!tieu_de || String(tieu_de).trim() === "") {
      if (req.file) fs.unlinkSync(req.file.path)
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Title (tieu_de) is required."
      });
    }

    let anh_bia_url = null;

    if (req.files && req.files['anh_bia']) {
      try {
        const fileAnhBia = req.files['anh_bia'][0];
        const uploadResult = await uploadMedia(fileAnhBia.path);
        anh_bia_url = uploadResult.secure_url;

        if (fs.existsSync(fileAnhBia.path)) fs.unlinkSync(fileAnhBia.path);
      } catch (err) {
        console.error("Lỗi upload ảnh bìa:", err);
        cleanupFiles(req.files);
        await t.rollback();
        return res.status(500).json({ success: false, message: "Lỗi upload ảnh bìa" });
      }
    }


    const newPost = await BaiViet.create({
      ma_tac_gia,
      tieu_de,
      tom_tat,
      noi_dung,
      trang_thai,
      anh_bia: anh_bia_url
    },
      { transaction: t }
    );

    if (req.files && req.files['files']) {
      try {
        const uploadPromises = req.files.map(async (file) => {
          const upload_result = await uploadMedia(file.path);

          fs.unlinkSync(req.file.path);

          await DinhKemTaiLieu.create({
            ma_tai_lieu: newPost.ma_bai_viet,
            ten_tep: file.originalname,
            duong_dan: upload_result.secure_url,
            dung_luong: file.size,
            dinh_dang: file.mimetype
          }, { transaction: t });
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.log("Cloudinary error: ", error);
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        await t.rollback();
        return res.status(500).json({
          success: false,
          message: "Failed to upload file"
        });
      }
    }

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
export const getPostByInstructorId = async (req, res) => {
  try {
    const { ma_tac_gia } = req.params;
    let {
      page = 1,
      limit = 10,
      trang_thai,
      q,
      sort_by = 'ngay_tao',
      sort_dir = 'desc' } = req.query;

    page = parseInt(page) > 0 ? parseInt(page) : 1;
    limit = parseInt(limit) > 0 ? Math.min(parseInt(limit), 100) : 10;
    const offset = (page - 1) * limit;
    const where = {};

    if (ma_tac_gia) where.ma_tac_gia = ma_tac_gia;
    if (trang_thai) where.trang_thai = trang_thai;
    if (q) {
      where.tieu_de = {
        [Op.like]: `%${q}%`
      };
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
      message: `Founded ${rows.length} posts`,
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
    if (!post_id) return res.status(400).json({
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

/**
 * Update post
 */
export const updatePost = async (req, res) => {
  const t = await sequelize.transaction();

  console.log("--- DEBUG UPDATE POST ---");
  console.log("Body:", req.body);   // Xem text có qua không
  console.log("Files:", req.files);
  
  const cleanupFiles = (filesObject) => {
    if (!filesObject) return;
    Object.values(filesObject).flat().forEach(file => {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    });
  };

  try {
    const id = req.params.id;
    if (!id) {
      cleanupFiles(req.files); 
      await t.rollback();
      return res.status(400).json({ success: false, message: "Post id is required in URL." });
    }

    const post = await BaiViet.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!post) {
      cleanupFiles(req.files);
      await t.rollback();
      return res.status(404).json({ success: false, message: `Post with id ${id} not found.` });
    }

    
    const updatableFields = ["ma_tac_gia", "tieu_de", "tom_tat", "noi_dung", "trang_thai"];
    const payload = {};
    updatableFields.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        payload[f] = req.body[f];
      }
    });

    
    if (payload.tieu_de && String(payload.tieu_de).trim() === "") {
      cleanupFiles(req.files);
      await t.rollback();
      return res.status(400).json({ success: false, message: "Title (tieu_de) cannot be empty." });
    }
   
    if (req.files && req.files['anh_bia']) {
      try {
        const fileAnhBia = req.files['anh_bia'][0];        
        const uploadResult = await uploadMedia(fileAnhBia.path);
        
        payload.anh_bia = uploadResult.secure_url;
        
        if (fs.existsSync(fileAnhBia.path)) fs.unlinkSync(fileAnhBia.path);
      } catch (err) {
        console.error("Lỗi upload ảnh bìa khi update:", err);
        cleanupFiles(req.files);
        await t.rollback();
        return res.status(500).json({ success: false, message: "Lỗi upload ảnh bìa (Cloudinary)." });
      }
    }
    
    if (Object.keys(payload).length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "No updatable fields provided." });
    }

    await post.update(payload, { transaction: t });

    await t.commit();
    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      data: post,
    });

  } catch (err) {
    // Nếu lỗi hệ thống -> dọn dẹp file và rollback
    cleanupFiles(req.files);
    await t.rollback();
    console.error("updatePost error:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the post.",
      errors: [{ message: err.message }],
    });
  }
}

/**
 * Delete post by ID
 */
export const deletePost = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id = req.params.id;
    if (!id) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Post id is required in URL." });
    }

    const post = await BaiViet.findByPk(id, { transaction: t, lock: t.LOCK.UPDATE });
    if (!post) {
      await t.rollback();
      return res.status(404).json({ success: false, message: `Post with id ${id} not found.` });
    }

    await post.destroy({ transaction: t });

    await t.commit();
    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
      data: { ma_bai_viet: id },
    });
  } catch (err) {
    await t.rollback();
    console.error("deletePost error:", err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the post.",
      errors: [{ message: err.message }],
    });
  }
}