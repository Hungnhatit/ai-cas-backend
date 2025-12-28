import { analyticsService } from "../../services/analytics.service.js";

/**
 * Analytics for Overview
 * Description: get instructor overview analytics
 */
export const instructorOverview = async (req, res) => {
  try {
    const { instructor_id } = req.params;
    const overview = await analyticsService.getInstructorOverview(instructor_id);

    return res.status(200).json({
      success: true,
      message: 'Instructor overview analytics retrieved successfully.',
      data: overview
    });
  } catch (error) {
    console.error('[Instructor Overview Analytics Error]', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve instructor overview analytics.',
      error: error.message
    });
  }
}

/**
 * Analytics for tests
 * Description: get analytics for each test of instructor
 */
export const instructorTests = async (req, res) => {
  try {
    const instructor_id = req.user.id;

    const testsAnalytics =
      await analyticsService.getInstructorTestAnalytics(instructor_id);

    return res.status(200).json({
      success: true,
      message: 'Instructor test analytics retrieved successfully.',
      data: testsAnalytics
    });
  } catch (error) {
    console.error('[Instructor Test Analytics Error]', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve instructor test analytics.',
      error: error.message
    });
  }
}

/**
 * Description: get instructor analytics trends (by date)
 */
export const getInstructorTrends = async (req, res) => {
  try {
    const instructor_id = req.user.id;

    const trends = await analyticsService.getInstructorTrends(instructor_id);

    return res.status(200).json({
      success: true,
      message: 'Instructor analytics trends retrieved successfully.',
      data: trends
    });
  } catch (error) {
    console.error('[Instructor Trends Analytics Error]', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve instructor analytics trends.',
      error: error.message
    });
  }
}