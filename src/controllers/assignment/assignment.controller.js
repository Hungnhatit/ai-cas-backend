import { Op } from "sequelize";
import Assignment from "../../model/assignment/assignment.model.js";
import Course from "../../model/course.model.js";
import Instructor from "../../model/instructor/instructor.model.js";
import Student from "../../model/student/student.model.js";
import Submission from "../../model/assignment/assignment-submission.model.js";
import AssignmentSubmission from "../../model/assignment/assignment-submission.model.js";

/**
 * Create an assignment
 */
export const createAssignment = async (req, res) => {
  try {
    const { tieu_de, ma_khoa_hoc, ma_giang_vien, danh_sach_ma_hoc_vien, mo_ta, han_nop, dinh_kem } = req.body;

    console.log(tieu_de, ma_khoa_hoc, ma_giang_vien, danh_sach_ma_hoc_vien, mo_ta, han_nop, dinh_kem);

    if (!tieu_de || !ma_khoa_hoc || !ma_giang_vien || !danh_sach_ma_hoc_vien || !han_nop) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        data: {
          'tieu_de': tieu_de,
          'ma_khoa_hoc': ma_khoa_hoc,
          'ma_giang_vien': ma_giang_vien,
          'danh_sach_ma_hoc_vien': danh_sach_ma_hoc_vien,
          'han_nop': han_nop,
        }
      });
    }

    const [course, instructor, student] = await Promise.all([
      Course.findByPk(ma_khoa_hoc),
      Instructor.findByPk(ma_giang_vien),
      Student.findAll({
        where: { ma_hoc_vien: { [Op.in]: danh_sach_ma_hoc_vien } }
      })
    ]);

    if (!course) return res.status(404).json({ error: "Course not found" });
    if (!instructor) return res.status(404).json({ error: "Instructor not found" });
    if (!student) return res.status(404).json({ error: "Student not found" });
    

    const assignment = await Assignment.create({
      tieu_de,
      ma_khoa_hoc,
      ma_giang_vien,
      danh_sach_ma_hoc_vien: danh_sach_ma_hoc_vien,
      mo_ta,
      han_nop: han_nop,
      dinh_kem: dinh_kem || null,
      trang_thai: "cho_xu_ly", // default
    });

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    console.error("Error creating assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create assignment",
      error: error.message,
    });
  }
}

/**
 * Get assignment by instructor ID
 */
export const getAssignmentByInstructorId = async (req, res) => {
  try {
    const { ma_giang_vien } = req.params;

    if (!ma_giang_vien) {
      return res.status(400).json({
        success: false,
        message: 'Missing instructor ID'
      });
    }

    const assignments = await Assignment.findAll({
      where: { ma_giang_vien },
      order: [['ngay_tao', 'desc']]
    });

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No assignment found for this ma_giang_vien=${ma_giang_vien}`,
        data: []
      });
    }

    return res.status(200).json({
      success: true,
      message: `Found ${assignments.length} assignment(s) for ma_giang_vien = ${ma_giang_vien}`,
      count: assignments.length,
      data: assignments,
    })

  } catch (error) {
    console.error("Error fetching assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching assignments",
      error: error.message,
    });
  }
}

/**
 * Get assignment by ID
 */
export const getAssignmentById = async (req, res) => {
  try {
    const { ma_bai_tap } = req.params;
    const assignment = await Assignment.findByPk(ma_bai_tap, {
      include: [
        {
          model: Instructor,
          as: "instructor",
          attributes: ["ma_giang_vien", "ten", "email"]
        },
        {
          model: Submission,
          as: "submissions",
          include: [
            {
              model: Student,
              as: "student",
              attributes: ["student_id", "ten", "email"]
            }
          ]
        }
      ]
    }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: `Assignment with ID ${ma_bai_tap} not found`,
        data: null
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Assignment fetched successfully',
      data: assignment
    });
  } catch (error) {
    console.error("Error fetching assignment:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the assignment.",
      error: error.message
    });
  }
}


/**
 * Get all assignments assigned to a specific student
 */
export const getAssignmentsForStudent = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required',
        data: null
      });
    }

    const assignments = await Assignment.findAll({
      include: [
        { model: Instructor, as: 'giang_vien', attributes: ['ma_giang_vien', 'ten', 'email'] },
        {
          model: AssignmentSubmission, as: 'bai_nop', where: { ma_hoc_vien: student_id }, required: false, include: [
            { model: Student, as: 'hoc_vien', attributes: ['ma_hoc_vien', 'ten', 'email'] }
          ]
        }
      ],
      order: [['han_nop', 'asc']]
    });

    if (!assignments || assignments.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No assignments found for this student",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Assignments retrieved successfully",
      data: assignments,
    });

  } catch (error) {
    console.error("Error fetching assignments for student:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
      data: null,
    });
  }
}


