import { pool } from "../config/database.js";
import Course from "../model/course.model.js";


export const addNewCourse = async (req, res) => {
  try {
    const data = req.body;

    const newCourse = await Course.create(data);

    return res.status(201).json({
      success: true,      
      message: 'Course has been created successfully!',
      data: newCourse
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed when creating new course!'
    });
  }
}

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Get course by ID successfully!',
      data: course
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed when getting course by ID!'
    });
  }
};

export const updateCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const updatedCourse = await course.update(courseData); // update dữ liệu

    return res.status(200).json({
      success: true,
      message: 'Course has been updated successfully!',
      data: updatedCourse
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed when updating course by ID!'
    });
  }
};

export const deleteCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.destroy();

    return res.status(200).json({
      success: true,
      message: 'Course has been deleted successfully!'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed when deleting course by ID!'
    });
  }
};
