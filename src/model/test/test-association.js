import Instructor from "../instructor/instructor.model.js";
import Student from "../student/student.model.js";

import TestAssignment from "./test-assignment.model.js";
import TestAttempt from "./test-attemtp.model.js";
import TestQuestion from "./test-question.model.js";
import TestSection from "./test-section.model.js";
import Test from "./test.model.js";

const TestAssociation = () => {
  // Test 1 - N TestSection
  Test.hasMany(TestSection, {
    foreignKey: "ma_kiem_tra",
    as: "sections",
    onDelete: "CASCADE",
  });
  TestSection.belongsTo(Test, { foreignKey: "ma_kiem_tra", as: "test" });

  // Section 1 - N TestQuestion
  // TestSection.hasMany(TestQuestion, {
  //   foreignKey: "section_id",
  //   as: "questions",
  //   onDelete: "CASCADE",
  // });
  // TestQuestion.belongsTo(TestSection, { foreignKey: "section_id", as: "section" });

  // Test - Assignments
  Test.hasMany(TestAssignment, {
    foreignKey: "ma_kiem_tra",
    as: "assignments",
    onDelete: "CASCADE",
  });
  TestAssignment.belongsTo(Test, { foreignKey: "ma_kiem_tra", as: "test" });

  // Student - TestAssignment
  Student.hasMany(TestAssignment, {
    foreignKey: "student_id",
    as: "testAssignments",
    onDelete: "CASCADE",
  });
  TestAssignment.belongsTo(Student, { foreignKey: "student_id", as: "student" });

  // Instructor - TestAssignment (assigned_by)
  Instructor.hasMany(TestAssignment, {
    foreignKey: "assigned_by",
    as: "givenTestAssignments",
    onDelete: "CASCADE",
  });
  TestAssignment.belongsTo(Instructor, { foreignKey: "assigned_by", as: "assignedBy" });

  // Test - Attempts
  Test.hasMany(TestAttempt, { foreignKey: "ma_kiem_tra", as: "attempts", onDelete: "CASCADE" });
  TestAttempt.belongsTo(Test, { foreignKey: "ma_kiem_tra", as: "test" });

  // Student - TestAttempt
  Student.hasMany(TestAttempt, { foreignKey: "student_id", as: "testAttempts", onDelete: "CASCADE" });
  TestAttempt.belongsTo(Student, { foreignKey: "student_id", as: "student" });

  // Optionally: If you want quick access to instructor on Test
  Instructor.hasMany(Test, { foreignKey: "ma_giang_vien", as: "createdTests", onDelete: "CASCADE" });
  Test.belongsTo(Instructor, { foreignKey: "ma_giang_vien", as: "instructor" });

}

export default TestAssociation