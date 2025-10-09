import Mux from "@mux/mux-node/index.mjs";
import { pool, sequelize } from '../config/database.js'
import Attachment from '../model/attachment.model.js';
import Course from '../model/course.model.js';
import Chapter from '../model/quiz/chapter.model.js';
import dotenv from 'dotenv';
import MuxData from "../model/quiz/mux.model.js";
import Category from "../model/category.model.js";
import Purchase from "../model/purchase.model.js";
import UserProgress from "../model/quiz/user-progress.model.js";

dotenv.config();

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});
const { video } = mux;

export const getCourses = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.promise().query("SELECT * FROM courses");

    return res.status(200).json({
      success: true,
      data: rows

    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        { model: Attachment, as: "attachments" },
        { model: Chapter, as: 'chapter' },
      ]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const getCoursesByUserId = async (req, res) => {
  try {
    const { ma_nguoi_dung } = req.params;

    if (!ma_nguoi_dung || isNaN(parseInt(ma_nguoi_dung))) {
      return res.status(400).json({
        success: false,
        message: "Invalid ma_nguoi_dung",
      });
    }

    const courses = await Course.findAll({
      where: { ma_nguoi_dung },
      include: [
        {
          model: Chapter,
          as: "chapter",
          include: [
            {
              model: MuxData,
              as: "muxData",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    console.error("Error in getCoursesByUserId:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getCourseDetail = async (req, res) => {
  try {
    const { course_id } = req.params;
    const ma_nguoi_dung = req.user?.id || req.query.ma_nguoi_dung;
    // bạn có thể lấy ma_nguoi_dung từ middleware auth hoặc query string

    if (!course_id) {
      return res.status(400).json({ message: "course_id is required" });
    }

    const course = await Course.findOne({
      where: { course_id: course_id },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "category_name"]
        },
        {
          model: Chapter,
          as: "chapters",
          where: { isPublished: true },
          required: false,
          include: [
            {
              model: UserProgress,
              as: "userProgress",
              where: ma_nguoi_dung ? { ma_nguoi_dung } : undefined,
              required: false
            }
          ],
          order: [["position", "ASC"]],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.json(course);
  } catch (error) {
    console.error("Error getCourseDetail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const createCourse = async (req, res) => {
  try {
    const data = req.body;

    const newCourse = await Course.create(data);

    if (newCourse) {
      return res.status(201).json({
        success: true,
        message: 'Course has been created successfully',
        data: newCourse
      })
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error when creating new course'
    })
  }
}

export const publishCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const userId = req.user?.id;

    // if (!userId) {
    //   return res.status(401).json({ success: false, message: "Unauthorized" });
    // }

    // Tìm course kèm chapters + muxData
    const course = await Course.findByPk(course_id, {
      include: [
        {
          model: Chapter,
          as: "chapter",
          include: [
            {
              model: MuxData,
              as: "muxData",
            },
          ],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.ma_nguoi_dung !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to publish this course",
      });
    }

    // Check điều kiện bắt buộc
    const hasPublishedChapter = course?.chapters?.some((chapter) => chapter.isPublished);

    // if (!course.title || !course.mo_ta || !course.imageUrl || !course.category_id || !hasPublishedChapter) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Missing required fields (title, mo_ta, imageUrl, category_id, or published chapter)",
    //   });
    // }

    // Publish course
    await course.update({ isPublished: true });

    return res.status(200).json({
      success: true,
      message: "Course has been published successfully!",
      data: course,
    });
  } catch (error) {
    console.error("Error when publishing course:", error);
    res.status(500).json({
      success: false,
      message: "Error when publishing course",
      error: error.message,
    });
  }
};

export const unPublishCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const course = await Course.findByPk(course_id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.ma_nguoi_dung !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to unpublish this course",
      });
    }

    // Unpublish course
    await course.update({ isPublished: false });

    return res.status(200).json({
      success: true,
      message: "Course has been unpublished successfully!",
      data: course,
    });
  } catch (error) {
    console.error("Error when unpublishing course:", error);
    res.status(500).json({
      success: false,
      message: "Error when unpublishing course",
      error: error.message,
    });
  }
};

export const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, title, mo_ta, imageUrl, price } = req.body;

    // tìm course
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    const updatedCourse = await course.update({
      category_id,
      title,
      mo_ta,
      imageUrl,
      price,
    });

    return res.status(200).json({
      success: true,
      message: 'Course updated successfully!',
      data: updatedCourse
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'Course not found with the provided ID for update!'
    })
  }
}

export const createAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const newAttachment = await Attachment.create(data);
    console.log(newAttachment);

    if (newAttachment) {
      return res.status(201).json({
        success: true,
        message: 'Attachment has been created successfully',
        data: newAttachment
      })
    }

  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: 'Can not create an attachment!'
    })
  }
}

export const deleteCourseById = async (req, res) => {
  try {
    const { course_id } = req.params;

    // Lấy course kèm chapters và muxData
    const course = await Course.findByPk(course_id, {
      include: [
        {
          model: Chapter,
          as: "chapters",
          include: [
            {
              model: MuxData,
              as: "muxData",
            },
          ],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Xoá asset Mux nếu có
    for (const chapter of course.chapters) {
      if (chapter.muxData?.asset_id) {
        try {
          await video.assets.delete(chapter.muxData.asset_id);
        } catch (err) {
          console.warn("Failed to delete Mux asset:", err.message);
        }
      }

      // Xoá muxData record trong DB
      if (chapter.muxData) {
        await chapter.muxData.destroy();
      }

      // Xoá chapter
      await chapter.destroy();
    }

    // Xoá course
    await course.destroy();

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCoursesWithProgress = async (req, res) => {
  try {
    const { ma_nguoi_dung, title, category_id } = req.query;

    console.log(ma_nguoi_dung, category_id)

    // Build điều kiện WHERE động
    let whereClause = `WHERE c.isPublished = true`;
    if (title) {
      whereClause += ` AND c.title LIKE :title`;
    }
    if (category_id) {
      whereClause += ` AND c.category_id = :category_id`;
    }

    // Query thô lấy courses + category + purchases + chapters
    const courses = await sequelize.query(
      `
      SELECT 
        c.course_id,
        c.title,
        c.mo_ta,
        c.imageUrl,
        c.price,
        c.isPublished,
        c.category_id,
        cat.category_name as category_name,
        p.purchase_id as purchase_id,
        p.ma_nguoi_dung as purchase_ma_nguoi_dung,
        ch.chapter_id,
        ch.isPublished as chapter_isPublished
      FROM courses c
      LEFT JOIN categories cat ON cat.category_id = c.category_id
      LEFT JOIN purchase p ON p.course_id = c.course_id AND p.ma_nguoi_dung = :ma_nguoi_dung
      LEFT JOIN chapter ch ON ch.course_id = c.course_id AND ch.isPublished = true
      ${whereClause}
      ORDER BY c.created_at DESC
      `,
      {
        replacements: {
          ma_nguoi_dung: 1,
          title: `%${title}%`,
          category_id,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Gom dữ liệu (group by course)
    const courseMap = {};
    courses.forEach((row) => {
      if (!courseMap[row.course_id]) {
        courseMap[row.course_id] = {
          course_id: row.course_id,
          title: row.title,
          mo_ta: row.mo_ta,
          imageUrl: row.imageUrl,
          price: row.price,
          isPublished: row.isPublished,
          category: {
            category_id: row.category_id,
            name: row.category_name,
          },
          purchases: row.purchase_id
            ? [{ id: row.purchase_id, ma_nguoi_dung: row.purchase_ma_nguoi_dung }]
            : [],
          chapters: [],
        };
      }

      if (row.chapter_id) {
        courseMap[row.course_id].chapters.push({
          chapter_id: row.chapter_id,
          isPublished: row.chapter_isPublished,
        });
      }
    });

    const finalCourses = Object.values(courseMap);

    // Tính progress cho từng course
    const courseWithProgress = await Promise.all(
      finalCourses.map(async (course) => {
        if (!course.purchases || course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          };
        }

        // Đếm số chapter đã completed
        const [completedResult] = await sequelize.query(
          `
          SELECT COUNT(*) as completedCount
          FROM user_progress up
          WHERE up.ma_nguoi_dung = :ma_nguoi_dung
          AND up.isCompleted = true
          AND up.chapter_id IN (:chapterIds)
          `,
          {
            replacements: {
              ma_nguoi_dung,
              chapterIds: course.chapters.map((c) => c.chapter_id),
            },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        const completedCount = completedResult?.completedCount || 0;
        const totalPublished = course.chapters.length;

        const progress =
          totalPublished > 0 ? (completedCount / totalPublished) * 100 : 0;

        return {
          ...course,
          progress,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: courseWithProgress,
    });
  } catch (error) {
    console.error("Error in getCoursesWithCate (raw query):", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};