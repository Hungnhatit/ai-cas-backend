/**
 * Start attempt controller
 */
import QuizAttempt from "../model/quiz/quiz-attempt.model.js";
import QuizQuestion from "../model/quiz/quiz-question.model.js";
import Quiz from "../model/quiz/quiz.model.js";

/**
 * Start quiz attempt
 * Description: start quiz attempt, set status to in-progress
 */
export const startQuizAttempt = async (req, res) => {
  try {
    const { quiz_id, student_id } = req.body;
    if (!quiz_id || !student_id) {
      return res.status(400).json({ message: "quiz_id và student_id là bắt buộc" });
    }

    const attempt = await QuizAttempt.create({
      quiz_id: quiz_id,
      student_id: student_id,
      start_time: new Date(),
      end_time: null,
      status: 'in-progress'
    });

    res.status(201).json({
      success: true,
      attempt
    })

  } catch (error) {
    console.error("Error starting quiz attempt:", error);
    res.status(500).json({ message: "Failed to start quiz attempt" });
  }
}

/**
 * Submit answer, when student change the answer, this controller will update the option to the database
 */
export const submitQuizAnswer = async (req, res) => {
  try {
    const { quizAttempt_id } = req.params;
    const { answers } = req.body; // full object from FE   

    const attempt = await QuizAttempt.findByPk(quizAttempt_id);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    await attempt.update({
      answers
    });

    res.status(200).json({ message: "Answers saved", answers });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ message: "Failed to submit answers" });
  }
};

/**
 * Submit attempt
 */
// export const submitQuizAttempt = async (req, res) => {
//   try {
//     const { quizAttempt_id } = req.params;
//     const attempt = await QuizAttempt.findByPk(quizAttempt_id);

//     if (!quizAttempt_id) {
//       return res.status(400).json({
//         message: false,
//         message: 'quizAttempt_id is required'
//       });
//     }

//     if (!attempt) {
//       return res.status(404).json({ message: "Attempt not found" });
//     }

//     if (attempt.status === 'submitted') {
//       return res.status(400).json({ message: 'Attempt has beens submitted before!' });
//     }

//     const quiz = await Quiz.findByPk(attempt.quiz_id, {
//       include: [{ model: QuizQuestion, as: "quiz_questions" }],
//     });

//     if (!quiz) {
//       return res.status(404).json({ message: 'Quiz not found' });
//     }

//     let score = 0;
//     const rawAnswers = attempt.answers; // "{\"17\":0}"
//     const userAnswers = JSON.parse(rawAnswers); // { "17": 0 }


//     // scoring
//     if (quiz && quiz.quiz_questions) {
//       quiz.quiz_questions.forEach((q) => {
//         const userAnswer = (JSON.parse(userAnswers))?.[q.quizQuestion_id];
//         if (userAnswer.toString() !== undefined && userAnswer.toString() === q.correctAnswer) {
//           score += q.points;
//         }
//       });
//     }

//     attempt.score = score;
//     attempt.end_time = new Date();
//     attempt.status = 'submitted';

//     await attempt.save();

//     return res.json({
//       success: true,
//       message: 'Quiz has been submitted',
//       score,
//       attempt,
//     });
//   } catch (error) {
//     console.error("Error submitting attempt:", error);
//     res.status(500).json({ message: "Failed to submit attempt" });
//   }
// };

export const submitQuizAttempt = async (req, res) => {
  try {
    const { quizAttempt_id } = req.params;
    const attempt = await QuizAttempt.findByPk(quizAttempt_id);

    if (!quizAttempt_id) {
      return res.status(400).json({ message: "quizAttempt_id is required" });
    }

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    if (attempt.status === "submitted") {
      return res.status(400).json({ message: "Attempt has been submitted before!" });
    }

    const quiz = await Quiz.findByPk(attempt.quiz_id, {
      include: [{ model: QuizQuestion, as: "quiz_questions" }],
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;

    // parse answers from DB (string -> object)
    let userAnswers = JSON.parse(attempt.answers);

    // scoring
    quiz.quiz_questions.forEach((q) => {
      const userAnswer = userAnswers?.[q.quizQuestion_id];
      if (
        userAnswer !== undefined &&
        userAnswer.toString() === q.correctAnswer.toString()
      ) {
        score += q.points;
      }
    });

    attempt.score = score;
    attempt.end_time = new Date();
    attempt.status = "submitted";

    await attempt.save();

    return res.json({
      success: true,
      message: "Quiz has been submitted",
      score,
      attempt,
    });

  } catch (error) {
    console.error("Error submitting attempt:", error);
    res.status(500).json({ message: "Failed to submit attempt" });
  }
};


/**
 * Get attempts
 */
export const getQuizAttempts = async (req, res) => {
  try {
    const { quiz_id, student_id } = req.query;

    if (!quiz_id || !student_id) {
      return res.status(400).json({ message: "quiz_id và student_id là bắt buộc" });
    }

    const attempts = await QuizAttempt.findAll({
      where: {
        quiz_id: Number(quiz_id),
        student_id: Number(student_id),
      },
    });

    return res.json(attempts);
  } catch (error) {
    console.error("Error in getQuizAttempt:", error);
    return res.status(500).json({ message: "Lỗi server khi lấy attempt" });
  }
};

/**
 * Get quiz attempt by student id
 */
export const getQuizAttempt = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({ message: "student_id is required" });
    }

    const attempts = await QuizAttempt.findAll({
      where: {
        student_id: student_id,
      },
    });

    return res.json(attempts);
  } catch (error) {
    console.error("Error in getQuizAttempt:", error);
    return res.status(500).json({ message: "Lỗi server khi lấy attempt" });
  }
}

/**
 * Get quiz attempt by ID
 */
export const getQuizAttemptById = async (req, res) => {
  try {
    const { quizAttempt_id } = req.params;

    if (!quizAttempt_id) {
      return res.status(400).json({ message: "quizAttempt_id is required" });
    }

    const attempt = await QuizAttempt.findByPk(quizAttempt_id, {
      include: [
        {
          model: Quiz,
          as: "quiz",
          include: [
            {
              model: QuizQuestion,
              as: "quiz_questions",
              attributes: ["quizQuestion_id", "question", "options", "correctAnswer", "points"],
            },
          ],
        },
      ],
    });

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    res.json({
      success: true,
      attempt,
    });
  } catch (error) {
    console.error("Error in getQuizAttemptById:", error);
    res.status(500).json({ message: "Lỗi server khi lấy attempt theo ID" });
  }
};

