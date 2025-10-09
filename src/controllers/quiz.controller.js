import { pool } from "../config/database.js";
import QuizAssignment from "../model/quiz/quiz-assignment.model.js";
import QuizAttempt from "../model/quiz/quiz-attempt.model.js";
import QuizQuestion from "../model/quiz/quiz-question.model.js";
import Quiz from "../model/quiz/quiz.model.js";
import Student from "../model/student/student.model.js";

/**
 * Get quiz question
 */
export const getQuestions = async (req, res) => {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM cau_hoi_trac_nghiem");
    return res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
}

/**
 * Create a new quiz
 */
export const createQuiz = async (req, res) => {
  const transaction = await Quiz.sequelize.transaction();
  const ma_giang_vien = req.user.ma_nguoi_dung;
  console.log(req)
  try {
    const {
      tieu_de,
      khoa_hoc,
      mo_ta,
      thoi_luong,
      tong_diem,
      han_nop,
      trang_thai,
      so_lan_lam,
      cau_hoi = [],
    } = req.body;


    // 1. Tạo quiz
    const quiz = await Quiz.create(
      {
        tieu_de,
        khoa_hoc,
        mo_ta,
        thoi_luong,
        tong_diem,
        han_nop,
        trang_thai,
        so_lan_lam,
        ma_giang_vien: ma_giang_vien
      },
      { transaction }
    );

    // 2. Tạo questions (nếu có)
    if (cau_hoi.length > 0) {
      const formattedQuestions = cau_hoi.map((q) => ({
        ma_kiem_tra: quiz.ma_kiem_tra,
        cau_hoi: q.cau_hoi,
        loai: q.loai,
        lua_chon: q.lua_chon || [],
        dap_an_dung: q.dap_an_dung,
        points: q.points,
      }));

      await QuizQuestion.bulkCreate(formattedQuestions, { transaction });
    }

    await transaction.commit();

    const quizWithQuestions = await Quiz.findByPk(quiz.ma_kiem_tra, {
      include: [{ model: QuizQuestion, as: "quiz_questions" }],
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: quizWithQuestions,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: `Failed to create quiz: ${error}` });
  }
};

/**
 * Publish quiz
 */
export const publishQuiz = async (req, res) => {
  const transaction = await Quiz.sequelize.transaction();
  const { ma_kiem_tra } = req.params;
  const ma_giang_vien = req.user.ma_nguoi_dung

  try {
    const { tieu_de, khoa_hoc, mo_ta, thoi_luong, totalPoints, dueDate, so_lan_lam, questions = [], } = req.body;

    const quiz = await Quiz.findOne({
      where: { ma_kiem_tra, ma_giang_vien },
      transaction
    });

    if (!quiz) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (quiz.trang_thai !== "draft") {
      await transaction.rollback();
      return res.status(400).json({ error: "Only draft quizzes can be published" });
    }

    await quiz.update({
      tieu_de, khoa_hoc, mo_ta, thoi_luong, totalPoints, dueDate, so_lan_lam, trang_thai: "active",
    }, { transaction });

    // 3. Xử lý questions (nếu có gửi kèm)
    if (questions.length > 0) {
      // Xóa question cũ
      await QuizQuestion.destroy({ where: { ma_kiem_tra: quiz.ma_kiem_tra }, transaction });

      // Tạo lại question mới
      const formattedQuestions = questions.map((q) => ({
        ma_kiem_tra: quiz.ma_kiem_tra,
        cau_hoi: q.cau_hoi,
        loai: q.loai,
        lua_chon: q.lua_chon || [],
        dap_an_dung: q.dap_an_dung,
        points: q.points,
      }));

      await QuizQuestion.bulkCreate(formattedQuestions, { transaction });
    }

    await transaction.commit();

    // 4. Lấy quiz kèm questions sau khi publish
    const publishedQuiz = await Quiz.findByPk(quiz.ma_kiem_tra, {
      include: [{ model: QuizQuestion, as: "quiz_questions" }],
    });

    res.status(200).json({
      message: "Quiz published successfully",
      quiz: publishedQuiz,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error publishing quiz:", error);
    res.status(500).json({ error: "Failed to publish quiz" });
  }
}

/**
 * Get quiz by ID
 */
export const getQuizById = async (req, res) => {
  try {
    const { ma_kiem_tra } = req.params;

    const quiz = await Quiz.findByPk(ma_kiem_tra, {
      include: [
        { model: QuizQuestion, as: 'quiz_questions' },
        { model: QuizAttempt, as: 'so_lan_lam_list' }
      ],
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'No message found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Fetch quiz successfully!',
      data: quiz
    })

  } catch (error) {
    res.status(404).json({
      success: false,
      message: `Error fetching quiz: ${error}`
    })
  }
}

/**
 * Get quiz by instructor ID
 */
export const getQuizByInstructorId = async (req, res) => {
  try {
    const ma_giang_vien = req.user.ma_nguoi_dung;

    const quizzes = await Quiz.findAll({
      where: { ma_giang_vien },
      include: [
        { model: QuizQuestion, as: 'cau_hoi_trac_nghiem' }
      ],
      order: [['ngay_tao', 'DESC']] // get the newest quizzes
    });

    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No quizzes found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Quizzes retrieves successfully!',
      quizzes
    })
  } catch (error) {
    console.log(error);
    res.status(404).json({
      success: false,
      message: `Error when fetching quiz: ${error}`
    })
  }
}

/**
 * Get student quiz result
 */
export const getStudentQuizResult = async (req, res) => {
  try {
    const { ma_kiem_tra, ma_hoc_vien } = req.params;
    const quizzes = await QuizAttempt.findAll({
      where: {
        ma_kiem_tra: ma_kiem_tra,
        ma_hoc_vien: ma_hoc_vien
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(quizzes)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed when fetching quizzes result for student'
    })
  }
}

/**
 * Update quiz & relate question
 */
export const updateQuiz = async (req, res) => {
  const transaction = await Quiz.sequelize.transaction();
  const { ma_kiem_tra } = req.params;
  const ma_giang_vien = req.user.ma_nguoi_dung;

  try {
    const { tieu_de, khoa_hoc, mo_ta, thoi_luong, totalPoints, dueDate, so_lan_lam, trang_thai, questions = [] } = req.body;

    // check quiz existing
    const quiz = await Quiz.findOne({
      where: { ma_kiem_tra, ma_giang_vien },
      transaction
    });

    if (!quiz) {
      await transaction.rollback();
      return res.status(404).json({ error: "Quiz not found" });
    }

    await quiz.update({ tieu_de, khoa_hoc, mo_ta, thoi_luong, totalPoints, dueDate, so_lan_lam, trang_thai }, { transaction });

    if (questions.length > 0) {
      // Xóa question cũ
      await QuizQuestion.destroy({ where: { ma_kiem_tra: quiz.ma_kiem_tra }, transaction });

      // Tạo lại question mới
      const formattedQuestions = questions.map((q) => ({
        ma_kiem_tra: quiz.ma_kiem_tra,
        cau_hoi: q.cau_hoi,
        loai: q.loai,
        lua_chon: q.lua_chon || [],
        dap_an_dung: q.dap_an_dung,
        points: q.points,
      }));

      await QuizQuestion.bulkCreate(formattedQuestions, { transaction });
    }

    await transaction.commit();

    // 4. Lấy quiz sau khi update
    const updatedQuiz = await Quiz.findByPk(quiz.ma_kiem_tra, {
      include: [{ model: QuizQuestion, as: "quiz_questions" }],
    });

    res.status(200).json({
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {

  }
}

/**
 * Delete quiz: soft delete and force delete
 */
export const deleteQuiz = async (req, res) => {
  const { ma_kiem_tra } = req.params;
  const forceDelete = req.query.force === 'true';

  try {
    const quiz = await Quiz.findByPk(ma_kiem_tra);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (!forceDelete) {
      quiz.trang_thai = 'archived';
      await quiz.save();

      return res.status(200).json({
        success: true,
        message: 'Quiz archived successfully (soft delete)'
      });
    }

    await quiz.destroy();
    return res.status(200).json({
      success: true,
      message: 'Quiz and related data have been deleted successfully!'
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Failed to delete quiz: ${error}`
    });
  }
}

/**
 * Restore quiz
 */
export const restoreQuiz = async (req, res) => {
  try {
    const { ma_kiem_tra } = req.params;

    const quiz = await Quiz.findOne({ where: { ma_kiem_tra } });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.trang_thai !== "archived") {
      return res.status(400).json({
        success: false,
        message: "Quiz is not archived, cannot restore",
      });
    }

    await quiz.update({ trang_thai: "draft" });

    return res.status(200).json({
      success: true,
      message: "Quiz restored successfully",
      data: quiz
    })
  } catch (error) {
    console.error("Error restoring quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to restore quiz",
      error: error.message,
    });
  }
}

/**
 * Set quiz che_do_xem
 */
export const setQuizche_do_xem = async (req, res) => {
  const { ma_kiem_tra } = req.params;
  const { ma_giang_vien } = req.user.ma_nguoi_dung;
  const { che_do_xem } = req.body;

  try {
    if (!['public', 'private', 'assigned'].include(che_do_xem)) {
      return res.status(400).json({
        error: 'Invalid che_do_xem value!'
      });
    }

    const quiz = await Quiz.findOne({
      where: { ma_kiem_tra, ma_giang_vien }
    });
    if (!quiz) {
      return res.status(404).json({
        message: 'Quiz not found'
      });
    }

    await quiz.update(che_do_xem);

    return res.status(200).json({
      succe: true,
      message: `Quiz che_do_xem updated to ${che_do_xem}`,
      data: quiz
    });
  } catch (error) {
    console.error(`Error setting quiz che_do_xem: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to update quiz che_do_xem',
      error: error.message
    });
  }
}


/**
 * Assign quiz to one or more students
 */
export const assignQuiz = async (req, res) => {
  const { ma_kiem_tra } = req.params;
  const ma_giang_vien = req.user.ma_nguoi_dung;
  const { ma_hoc_viens } = req.body;

  if (!Array.isArray(ma_hoc_viens) || ma_hoc_viens.length === 0) {
    return res.status(400).json({
      error: 'ma_hoc_viens must be a non-empty array'
    });
  }

  const transaction = await Quiz.sequelize.transaction();

  try {
    const quiz = await Quiz.findOne({
      where: { ma_kiem_tra, ma_giang_vien }
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const students = await Student.findAll({
      where: { ma_hoc_vien: ma_hoc_viens }
    });

    console.log(ma_hoc_viens)

    await QuizAssignment.destroy({
      where: { ma_kiem_tra, ma_hoc_vien: ma_hoc_viens },
      transaction
    });

    const assignments = ma_hoc_viens.map((ma_hoc_vien) => ({
      ma_kiem_tra,
      ma_hoc_vien,
      assigned_by: ma_giang_vien,
      assigned_at: new Date()
    }));

    await QuizAssignment.bulkCreate(assignments, { transaction });

    if (quiz.che_do_xem !== 'assigned') {
      await quiz.update({ che_do_xem: 'assigned' }, { transaction });
    }

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Quiz assign successfully',
      data: assignments
    });
  } catch (error) {
    await transaction.rollback();
    console.log(`Error assigning quiz: ${error}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to assign quiz',
      error: error.message
    });
  }
}