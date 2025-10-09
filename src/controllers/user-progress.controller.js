import UserProgress from "../model/quiz/user-progress.model.js";
import Course from '../model/course.model.js';
import Chapter from '../model/quiz/chapter.model.js';
import Category from "../model/category.model.js";
import Purchase from "../model/purchase.model.js";

// Lấy danh sách courses kèm progress
export const getCourses = async (req, res) => {
  try {
    const { ma_nguoi_dung, title, category_id } = req.query;

    const courses = await Course.findAll({
      where: {
        isPublished: true,
        ...(title && { title: { [Op.like]: `%${title}%` } }),
        ...(category_id && { category_id }),
      },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["category_id", "category_name"],
        },
        {
          model: Chapter,
          as: "chapter",
          where: { isPublished: true },
          required: false, // tránh bị loại bỏ course nếu không có chapter
          attributes: ["chapter_id"],
        },
        {
          model: Purchase,
          as: "purchases",
          where: { ma_nguoi_dung: 1 },
          required: false, // tránh bị loại bỏ course nếu user chưa mua
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // thêm progress cho từng course
    const courseWithProgress = await Promise.all(
      courses.map(async (course) => {
        const c = course.toJSON();

        if (!c.purchases || c.purchases.length === 0) {
          return { ...c, progress: null };
        }

        const progressPercentage = await getProgress(
          Number(ma_nguoi_dung),
          c.course_id
        );

        return { ...c, progress: progressPercentage };
      })
    );

    return res.json({ courses: courseWithProgress });
  } catch (error) {
    console.error("[GET_COURSES_ERROR]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getCompletedProgress = async (req, res) => {
  try {
    const { ma_nguoi_dung } = req.params;

    if (!ma_nguoi_dung) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const completedCount = await UserProgress.count({
      where: {
        ma_nguoi_dung: ma_nguoi_dung,
        isCompleted: true,
      },
    });

    return res.status(200).json({
      success: true,
      progress: completedCount,
    });
  } catch (error) {
    console.error("Error in getCompletedProgress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user progress",
      error: error.message,
    });
  }
};

export const getProgress = async (userId, courseId) => {
  try {
    // chapters đã publish
    const publishedChapters = await Chapter.findMany({
      where: {
        course_id: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    // chapters user đã hoàn thành
    const completedChapters = await UserProgress.count({
      where: {
        ma_nguoi_dung: userId,
        course_id: courseId,
        isCompleted: true,
      },
    });

    const total = publishedChapters.length;
    if (total === 0) return 0;

    return (completedChapters / total) * 100;
  } catch (error) {
    console.error("[GET_PROGRESS_ERROR]", error);
    return 0;
  }
};