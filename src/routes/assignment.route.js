import express from 'express';
import { getAssignmentById, createAssignment, getAssignmentByInstructorId, getAssignmentsForStudent } from '../controllers/assignment/assignment.controller.js';
import { authenticate } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/create', createAssignment);
router.get('/instructor/:ma_giang_vien', authenticate, getAssignmentByInstructorId);

router.get('/student/:student_id', getAssignmentsForStudent);

router.get('/:assignment_id', getAssignmentById);

// Assignment routes
// router.post("/assignments", createAssignment);
// router.get("/assignments/:id", getAssignmentById);
// router.get("/instructors/:id/assignments", getAssignmentsByInstructor);
// router.put("/assignments/:id", updateAssignment);
// router.delete("/assignments/:id", deleteAssignment);

export default router;