/**
 * Start attempt controller
 */
import QuizAttempt from "../model/quiz/quiz-attempt.model.js";
import QuizQuestion from "../model/quiz/quiz-question.model.js";
import Quiz from "../model/quiz/quiz.model.js";

/**
 * Start quiz attempt
 * mo_ta: start quiz attempt, set status to in-progress
 */
export const startQuizAttempt = async (req, res) => {
  try {
    const { ma_kiem_tra, ma_hoc_vien } = req.body;
    if (!ma_kiem_tra || !ma_hoc_vien) {
      return res.status(400).json({ message: "ma_kiem_tra và ma_hoc_vien là bắt buộc" });
    }

    const attempt = await QuizAttempt.create({
      ma_kiem_tra: ma_kiem_tra,
      ma_hoc_vien: ma_hoc_vien,
      thoi_gian_bat_dau: new Date(),
      thoi_gian_ket_thuc: null,
      trang_thai: 'in-progress'
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
    const { ma_lan_lam_kt } = req.params;
    const { cau_tra_loi } = req.body; // full object from FE   

    const attempt = await QuizAttempt.findByPk(ma_lan_lam_kt);
    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    await attempt.update({
      cau_tra_loi
    });

    res.status(200).json({ message: "Answers saved", cau_tra_loi });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res.status(500).json({ message: "Failed to submit cau_tra_loi" });
  }
};

/**
 * Submit attempt
 */
// export const submitQuizAttempt = async (req, res) => {
//   try {
//     const { ma_lan_lam_kt } = req.params;
//     const attempt = await QuizAttempt.findByPk(ma_lan_lam_kt);

//     if (!ma_lan_lam_kt) {
//       return res.status(400).json({
//         message: false,
//         message: 'ma_lan_lam_kt is required'
//       });
//     }

//     if (!attempt) {
//       return res.status(404).json({ message: "Attempt not found" });
//     }

//     if (attempt.trang_thai ==='submitted') {
//       return res.status(400).json({ message: 'Attempt has beens submitted before!' });
//     }

//     const quiz = await Quiz.findByPk(attempt.ma_kiem_tra, {
//       include: [{ model: QuizQuestion, as: "quiz_questions" }],
//     });

//     if (!quiz) {
//       return res.status(404).json({ message: 'Quiz not found' });
//     }

//     let diem = 0;
//     const rawAnswers = attempt.cau_tra_loi; // "{\"17\":0}"
//     const userAnswers = JSON.parse(rawAnswers); // { "17": 0 }


//     // scoring
//     if (quiz && quiz.quiz_questions) {
//       quiz.quiz_questions.forEach((q) => {
//         const userAnswer = (JSON.parse(userAnswers))?.[q.quizQuestion_id];
//         if (userAnswer.toString() !== undefined && userAnswer.toString() === q.correctAnswer) {
//           diem += q.points;
//         }
//       });
//     }

//     attempt.diem = diem;
//     attempt.thoi_gian_ket_thuc = new Date();
//     attempt.trang_thai ='submitted';

//     await attempt.save();

//     return res.json({
//       success: true,
//       message: 'Quiz has been submitted',
//       diem,
//       attempt,
//     });
//   } catch (error) {
//     console.error("Error submitting attempt:", error);
//     res.status(500).json({ message: "Failed to submit attempt" });
//   }
// };

export const submitQuizAttempt = async (req, res) => {
  try {
    const { ma_lan_lam_kt } = req.params;
    const attempt = await QuizAttempt.findByPk(ma_lan_lam_kt);

    if (!ma_lan_lam_kt) {
      return res.status(400).json({ message: "ma_lan_lam_kt is required" });
    }

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    if (attempt.trang_thai === "da_nop") {
      return res.status(400).json({ message: "Attempt has been submitted before!" });
    }

    const quiz = await Quiz.findByPk(attempt.ma_kiem_tra, {
      include: [{ model: QuizQuestion, as: "quiz_questions" }],
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let diem = 0;

    // parse cau_tra_loi from DB (string -> object)
    let userAnswers = JSON.parse(attempt.cau_tra_loi);

    // scoring
    quiz.quiz_questions.forEach((q) => {
      const userAnswer = userAnswers?.[q.quizQuestion_id];
      if (
        userAnswer !== undefined &&
        userAnswer.toString() === q.correctAnswer.toString()
      ) {
        diem += q.points;
      }
    });

    attempt.diem = diem;
    attempt.thoi_gian_ket_thuc = new Date();
    attempt.trang_thai = diem > 0 ? "completed" : "submitted";

    await attempt.save();

    return res.json({
      success: true,
      message: "Quiz has been submitted",
      diem,
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
    const { ma_kiem_tra, ma_hoc_vien } = req.query;

    if (!ma_kiem_tra || !ma_hoc_vien) {
      return res.status(400).json({ message: "ma_kiem_tra và ma_hoc_vien là bắt buộc" });
    }

    const attempts = await QuizAttempt.findAll({
      where: {
        ma_kiem_tra: Number(ma_kiem_tra),
        ma_hoc_vien: Number(ma_hoc_vien),
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
    const { ma_hoc_vien } = req.params;

    if (!ma_hoc_vien) {
      return res.status(400).json({ message: "ma_hoc_vien is required" });
    }

    const attempts = await QuizAttempt.findAll({
      where: {
        ma_hoc_vien: ma_hoc_vien,
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
    const { ma_lan_lam_kt } = req.params;

    if (!ma_lan_lam_kt) {
      return res.status(400).json({ message: "ma_lan_lam_kt is required" });
    }

    const attempt = await QuizAttempt.findByPk(ma_lan_lam_kt, {
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

