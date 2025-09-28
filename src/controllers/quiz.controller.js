import { pool } from "../config/database.js";
import QuizAttempt from "../model/quiz/quiz-attempt.model.js";
import QuizQuestion from "../model/quiz/quiz-question.model.js";
import Quiz from "../model/quiz/quiz.model.js";

/**
 * Get quiz question
 */
export const getQuestions = async (req, res) => {
  try {
    const [rows] = await pool.promise().query("SELECT * FROM questions");
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
  const instructor_id = req.user.user_id;
  console.log(req)
  try {
    const {
      title,
      course,
      description,
      duration,
      totalPoints,
      dueDate,
      status,
      attempts,
      questions = [],
    } = req.body;


    // 1. Tạo quiz
    const quiz = await Quiz.create(
      {
        title,
        course,
        description,
        duration,
        totalPoints,
        dueDate,
        status,
        attempts,
        instructor_id: instructor_id
      },
      { transaction }
    );

    // 2. Tạo questions (nếu có)
    if (questions.length > 0) {
      const formattedQuestions = questions.map((q) => ({
        quiz_id: quiz.quiz_id,
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        points: q.points,
      }));

      await QuizQuestion.bulkCreate(formattedQuestions, { transaction });
    }

    await transaction.commit();

    const quizWithQuestions = await Quiz.findByPk(quiz.quiz_id, {
      include: [{ model: QuizQuestion, as: "quiz_questions" }],
    });

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: quizWithQuestions,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

/**
 * Publish quiz
 */
export const publishQuiz = async (req, res) => {
  const transaction = await Quiz.sequelize.transaction();
  const { quiz_id } = req.params;
  const instructor_id = req.user.user_id

  try {
    const { title, course, description, duration, totalPoints, dueDate, attempts, questions = [], } = req.body;

    const quiz = await Quiz.findOne({
      where: { quiz_id, instructor_id },
      transaction
    });

    if (!quiz) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Quiz not found' });
    }

    if (quiz.status !== "draft") {
      await transaction.rollback();
      return res.status(400).json({ error: "Only draft quizzes can be published" });
    }

    await quiz.update({
      title, course, description, duration, totalPoints, dueDate, attempts, status: "active",
    }, { transaction });

    // 3. Xử lý questions (nếu có gửi kèm)
    if (questions.length > 0) {
      // Xóa question cũ
      await QuizQuestion.destroy({ where: { quiz_id: quiz.quiz_id }, transaction });

      // Tạo lại question mới
      const formattedQuestions = questions.map((q) => ({
        quiz_id: quiz.quiz_id,
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        points: q.points,
      }));

      await QuizQuestion.bulkCreate(formattedQuestions, { transaction });
    }

    await transaction.commit();

    // 4. Lấy quiz kèm questions sau khi publish
    const publishedQuiz = await Quiz.findByPk(quiz.quiz_id, {
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
    const { quiz_id } = req.params;

    const quiz = await Quiz.findByPk(quiz_id, {
      include: [
        { model: QuizQuestion, as: 'quiz_questions' },
        { model: QuizAttempt, as: 'attempts_list' }
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
    const instructor_id = req.user.user_id;

    const quizzes = await Quiz.findAll({
      where: { instructor_id },
      include: [
        { model: QuizQuestion, as: 'quiz_questions' }
      ],
      order: [['createdAt', 'DESC']] // get the newest quizzes
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
    const { quiz_id, student_id } = req.params;
    const quizzes = await QuizAttempt.findAll({
      where: {
        quiz_id: quiz_id,
        student_id: student_id
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
  const { quiz_id } = req.params;
  const instructor_id = req.user.user_id;

  try {
    const { title, course, description, duration, totalPoints, dueDate, attempts, status, questions = [] } = req.body;

    // check quiz existing
    const quiz = await Quiz.findOne({
      where: { quiz_id, instructor_id },
      transaction
    });

    if (!quiz) {
      await transaction.rollback();
      return res.status(404).json({ error: "Quiz not found" });
    }

    await quiz.update({ title, course, description, duration, totalPoints, dueDate, attempts, status }, { transaction });

    if (questions.length > 0) {
      // Xóa question cũ
      await QuizQuestion.destroy({ where: { quiz_id: quiz.quiz_id }, transaction });

      // Tạo lại question mới
      const formattedQuestions = questions.map((q) => ({
        quiz_id: quiz.quiz_id,
        question: q.question,
        type: q.type,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        points: q.points,
      }));

      await QuizQuestion.bulkCreate(formattedQuestions, { transaction });
    }

    await transaction.commit();

    // 4. Lấy quiz sau khi update
    const updatedQuiz = await Quiz.findByPk(quiz.quiz_id, {
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
  const { quiz_id } = req.params;
  const forceDelete = req.query.force === 'true';

  try {
    const quiz = await Quiz.findByPk(quiz_id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    if (!forceDelete) {
      quiz.status = 'archived';
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
    const { quiz_id } = req.params;

    const quiz = await Quiz.findOne({ where: { quiz_id } });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.status !== "archived") {
      return res.status(400).json({
        success: false,
        message: "Quiz is not archived, cannot restore",
      });
    }

    await quiz.update({ status: "draft" });

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