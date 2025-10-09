export const createAttachment = (req, res) => {

}

export const deleteAttachment = async (req, res) => {
  try {
    const { course_id, attachment_id } = req.params;

    // check if attachment belongs to course
    const [rows] = await pool
      .promise()
      .query(
        "SELECT * FROM attachments WHERE attachment_id = ? AND course_id = ?",
        [attachment_id, course_id]
      );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Attachment not found for this course" });
    }
  
    await pool
      .promise()
      .query(
        "DELETE FROM attachments WHERE attachment_id = ? AND course_id = ?",
        [attachment_id, course_id]
      );


    return res.json({ message: "Attachment deleted successfully" });
  } catch (error) {
    console.error("Delete attachment error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}