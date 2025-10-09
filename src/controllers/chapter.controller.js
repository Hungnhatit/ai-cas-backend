import Course from "../model/course.model.js";
import Chapter from "../model/quiz/chapter.model.js";
import Mux from "@mux/mux-node/index.mjs";
import dotenv from 'dotenv';
import MuxData from "../model/quiz/mux.model.js";
import { sequelize } from "../config/database.js";

dotenv.config();

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

const { video } = mux;
const { Video } = mux;

/**
 * Create a new chapter
 */
export const createChapter = async (req, res) => {
  try {
    const { id } = req.params; // course_id
    const { title, mo_ta, video_url, isPublished, isFree } = req.body;
    const userId = req.user?.id; // giả sử bạn gắn user vào req khi login

    // 1. Kiểm tra course có tồn tại không
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 2. Kiểm tra quyền sở hữu course
    if (course.ma_nguoi_dung !== userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 3. Lấy chương cuối cùng để set position
    const lastChapter = await Chapter.findOne({
      where: { course_id: id },
      order: [["position", "DESC"]],
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // 4. Tạo chương mới
    const chapter = await Chapter.create({
      title,
      mo_ta,
      video_url,
      isPublished: isPublished ?? false,
      isFree: isFree ?? false,
      position: newPosition,
      course_id: id,
    });

    return res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({
      success: false,
      message: "Error when creating new chapter",
      error: error.message,
    });
  }
};

/**
 * Get specific chapters of a course
 */
export const getChapter = async (req, res) => {
  try {
    const { course_id, chapter_id } = req.params;

    const chapter = await Chapter.findOne({
      where: {
        course_id,
        chapter_id,
      },
      include: [
        {
          model: Course,
          attributes: ["course_id", "title"],
        },
      ],
    });

    if (!chapter) {
      return res
        .status(404)
        .json({ success: false, message: "Chapter not found in this course" });
    }

    return res.json({ success: true, data: chapter });
  } catch (error) {
    console.error("Error getChapter:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get all chapters of a course
 */
export const getChapters = async (req, res) => {
  try {
    const { id } = req.params; // course_id
    const chapters = await Chapter.findAll({
      where: { course_id: id },
      order: [["position", "ASC"]],
    });

    res.json({
      success: true,
      data: chapters,
    });
  } catch (error) {
    console.error("Error getChapters:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single chapter by id
 */
export const getChapterById = async (req, res) => {
  try {
    const { chapter_id } = req.params;
    const chapter = await Chapter.findByPk(chapter_id, {
      include: [
        { model: MuxData, as: "muxData", attributes: ["asset_id", "playback_id"], }
      ]
    });

    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found" });
    }

    res.json({ success: true, data: chapter });
  } catch (error) {
    console.error("Error getChapterById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update chapter
 */
export const updateChapter = async (req, res) => {
  const { course_id, chapter_id } = req.params;
  const { title, mo_ta, position, videoUrl, isPublished } = req.body;

  try {
    const chapter = await Chapter.findOne({
      where: {
        chapter_id,
        course_id,
      },
    });

    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found in this course" });
    }

    // update fields
    chapter.title = title ?? chapter.title;
    chapter.mo_ta = mo_ta ?? chapter.mo_ta;
    chapter.position = position ?? chapter.position;
    chapter.video_url = videoUrl ?? chapter.video_url;
    chapter.isPublished = isPublished ?? chapter.isPublished;

    if (chapter.video_url) {
      const existingMuxData = await MuxData.findOne({
        where: { chapter_id },
      });

      if (existingMuxData) {
        // xóa asset cũ trên Mux
        await video.assets.delete(existingMuxData.asset_id);

        // xóa record cũ trong DB
        await MuxData.destroy({
          where: { muxdata_id: existingMuxData.muxdata_id },
        });
      }

      // tạo asset mới
      const asset = await video.assets.create({
        input: chapter.video_url,
        playback_policy: ["public"],
      });

      // lưu record mới
      await MuxData.create({
        chapter_id,
        asset_id: asset.id,
        playback_id: asset.playback_ids?.[0]?.id,
      });
    }

    await chapter.save();

    res.json({ message: "Chapter updated successfully", data: chapter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating chapter", error });
  }
};

// PUT /api/course/:course_id/chapter/reorder
export const reorderChapters = async (req, res) => {
  try {
    const { course_id } = req.params;
    const { list } = req.body;
    // list = [{ id: 1, position: 0 }, { id: 2, position: 1 }, ...]

    if (!Array.isArray(list)) {
      return res.status(400).json({ success: false, message: "Invalid data format" });
    }

    // transaction đảm bảo atomic
    await Chapter.sequelize.transaction(async (t) => {
      for (const item of list) {
        await Chapter.update(
          { position: item.position },
          { where: { chapter_id: item.id, course_id }, transaction: t }
        );
      }
    });

    res.json({ success: true, message: "Chapters reordered successfully" });
  } catch (error) {
    console.error("Error reorderChapters:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * Delete chapter
 */
export const deleteChapter = async (req, res) => {
  try {
    const { course_id, chapter_id } = req.params;

    // tìm chapter thuộc course
    const chapter = await Chapter.findOne({
      where: {
        chapter_id,
        course_id,
      },
    });

    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found in this course" });
    }

    // tìm MuxData kèm asset
    const muxData = await MuxData.findOne({
      where: { chapter_id },
    });

    if (muxData) {
      // xoá asset trên Mux
      await video.assets.delete(muxData.asset_id).catch((err) => {
        console.warn("Mux asset delete failed:", err.message);
      });

      // xoá record trong DB
      await MuxData.destroy({ where: { muxdata_id: muxData.muxdata_id } });
    }

    // xoá chapter
    await chapter.destroy();

    res.json({ success: true, message: "Chapter deleted successfully" });
  } catch (error) {
    console.error("Error deleteChapter:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const publishChapter = async (req, res) => {
  try {
    const { course_id, chapter_id } = req.params;
    const userId = req.user?.id;

    // kiểm tra course có tồn tại và thuộc user hiện tại
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.ma_nguoi_dung !== userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // tìm chapter thuộc course
    const chapter = await Chapter.findOne({
      where: {
        chapter_id,
        course_id,
      },
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found in this course",
      });
    }

    // tìm muxData theo chapter
    const muxData = await MuxData.findOne({
      where: { chapter_id },
    });

    // kiểm tra đủ dữ liệu trước khi publish
    if (!muxData || !chapter.title || !chapter.mo_ta || !chapter.video_url) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields to publish chapter",
      });
    }

    // cập nhật publish status
    chapter.isPublished = true;
    await chapter.save();

    res.json({
      success: true,
      message: "Chapter published successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Error when updating chapter publish status:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const unPublishChapter = async (req, res) => {
  const { course_id, chapter_id } = req.params;
  const userId = req.user?.id;

  try {
    // if (!userId) {
    //   return res.status(401).json({ success: false, message: "Unauthorized" });
    // }

    // kiểm tra course có tồn tại
    const course = await Course.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // kiểm tra quyền sở hữu
    if (course.ma_nguoi_dung !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // kiểm tra chapter thuộc course
    const chapter = await Chapter.findOne({
      where: { chapter_id, course_id },
    });
    if (!chapter) {
      return res.status(404).json({ success: false, message: "Chapter not found in this course" });
    }

    // Transaction để avoid race conditions
    await sequelize.transaction(async (t) => {
      // cập nhật chapter -> unpublish
      await chapter.update({ isPublished: false }, { transaction: t });

      // đếm số chapter vẫn đang publish trong course
      const publishedCount = await Chapter.count({
        where: { course_id, isPublished: true },
        transaction: t,
      });

      // nếu không còn chapter nào được publish, cập nhật course.isPublished = false
      if (publishedCount === 0 && course.isPublished) {
        await Course.update(
          { isPublished: false },
          { where: { course_id }, transaction: t }
        );
      }
    });

    return res.json({ success: true, message: "Chapter unpublished successfully" });
  } catch (error) {
    console.error("Error when updating chapter publish status:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublishedChapters = async (req, res) => {
  try {
    const { course_id } = req.params;

    const publishedChapters = await Chapter.findAll({
      where: {
        course_id: course_id,
        isPublished: true,
      },
      order: [["created_at", "ASC"]],
    });

    if (!publishedChapters || publishedChapters.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published chapters found for this course",
      });
    }

    return res.status(200).json({
      success: true,
      data: publishedChapters,
    });
  } catch (error) {
    console.error("Error fetching published chapters:", error);
    res.status(500).json({
      success: false,
      message: "Failed when fetching published chapters",
      error: error.message,
    });
  }
};
