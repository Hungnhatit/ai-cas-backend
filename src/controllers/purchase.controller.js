import Purchase from "../model/purchase.model.js";
import User from "../model/user.model.js";

export const getPurchaseById = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      where: { course_id: course_id },
      include: [
        { model: User , as: 'purchase', attributes: ['']}
      ]
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error when fetching purchase by ID: ${error}`
    })
  }
}