import Attachment from "./attachment.model.js";
import Category from "./category.model.js";
import Course from "./course.model.js";
import Purchase from "./purchase.model.js";
import Chapter from "./quiz/chapter.model.js";
import MuxData from "./quiz/mux.model.js";
import UserProgress from "./quiz/user-progress.model.js";
import User from "./auth/user.model.js";
import Test from "./quiz/test.model.js";
import Result from "./quiz/result.model.js";
import Question from './quiz/question.model.js';
import Answer from './quiz/answer.model.js';
import Option from './quiz/option.model.js';
import Quiz from "./quiz/quiz.model.js";
import QuizQuestion from "./quiz/quiz-question.model.js";
import QuizAttempt from "./quiz/quiz-attempt.model.js";

/**
 * USERS
 */
User.hasMany(Course, { foreignKey: "user_id", as: "courses" });
Course.belongsTo(User, { foreignKey: "user_id", as: "instructor" });

User.hasMany(Purchase, { foreignKey: "user_id", as: "purchases" });
Purchase.belongsTo(User, { foreignKey: "user_id", as: "buyer" });

User.hasMany(UserProgress, { foreignKey: "user_id", as: "progress" });
UserProgress.belongsTo(User, { foreignKey: "user_id", as: "user" });

User.hasMany(Result, { foreignKey: "user_id", as: "results" });
Result.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User.hasOne(StripeCustomer, { foreignKey: "user_id", as: "stripeCustomer" });
// StripeCustomer.belongsTo(User, { foreignKey: "user_id", as: "user" });

/**
 * CATEGORIES
 */
Category.hasMany(Course, { foreignKey: "category_id", as: "courses" });
Course.belongsTo(Category, { foreignKey: "category_id", as: "category" });

/**
 * COURSES
 */
// COURSES
Course.hasMany(Chapter, { foreignKey: "course_id", as: "chapters" });
Chapter.belongsTo(Course, { foreignKey: "course_id", as: "parentCourse" });

Course.hasMany(Purchase, { foreignKey: "course_id", as: "purchases" });
Purchase.belongsTo(Course, { foreignKey: "course_id", as: "purchasedCourse" });

Course.hasMany(Attachment, { foreignKey: "course_id", as: "attachments" });
Attachment.belongsTo(Course, { foreignKey: "course_id", as: "attachedCourse" });


/**
 * CHAPTERS
 */
Chapter.hasMany(UserProgress, { foreignKey: "chapter_id", as: "userProgress" });
UserProgress.belongsTo(Chapter, { foreignKey: "chapter_id", as: "chapter" });

Chapter.hasOne(MuxData, { foreignKey: "chapter_id", as: "muxData" });
MuxData.belongsTo(Chapter, { foreignKey: "chapter_id", as: "chapter" });

/**
 * TESTS
 */
Test.hasMany(Question, { foreignKey: "test_id", as: "questions" });
Question.belongsTo(Test, { foreignKey: "test_id", as: "test" });

Test.hasMany(Result, { foreignKey: "test_id", as: "results" });
Result.belongsTo(Test, { foreignKey: "test_id", as: "test" });

/**
 * QUESTIONS
 */
Question.hasMany(Option, { foreignKey: "question_id", as: "options" });
Option.belongsTo(Question, { foreignKey: "question_id", as: "question" });

Question.hasMany(Answer, { foreignKey: "question_id", as: "answers" });
Answer.belongsTo(Question, { foreignKey: "question_id", as: "question" });

/**
 * RESULTS
 */
Result.hasMany(Answer, { foreignKey: "result_id", as: "answers" });
Answer.belongsTo(Result, { foreignKey: "result_id", as: "result" });


/**
 * QUIZZES
 */
Quiz.hasMany(QuizQuestion, { foreignKey: "quiz_id", as: 'quiz_questions', onDelete: 'CASCADE' });
QuizQuestion.belongsTo(Quiz, { foreignKey: "quiz_id"});

/**
 * Attempt
 */
Quiz.hasMany(QuizAttempt, { foreignKey: "quiz_id", as: 'attempts_list', onDelete: 'CASCADE' });
QuizAttempt.belongsTo(Quiz, { foreignKey: "quiz_id" , as: 'quiz'});

export {
  User,
  Category,
  Course,
  Chapter,
  Purchase,
  UserProgress,
  Attachment,
  MuxData,
  // StripeCustomer,
  Test,
  Question,
  Option,
  Result,
  Answer,
};
