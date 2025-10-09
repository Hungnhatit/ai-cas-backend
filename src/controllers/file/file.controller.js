import { uploadMedia } from "../../helpers/cloudinary.js";

/**
 * Upload media to cloudinary
 */
export const uploadMediaCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file upload'
      })
    }
    const result = await uploadMedia(req.file.path);

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
}

export const bulkUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const uploadPromises = req.files.map((fileItem) =>
      uploadMedia(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: "Files uploaded successfully",
      data: results,
    });
  } catch (event) {
    res.status(500).json({
      success: false,
      message: "Error in bulk uploading files",
      error: error.message,
    });
  }
}

/**
 * Delete media
 */
export const deleteMedia = async (req, res) => {
  try {
    const { file_id } = req.params;

    if (!file_id) {
      return res.status(400).json({
        success: false,
        message: 'Asset file_id is required'
      });
    }

    await deleteMedia(file_id);
    res.status(200).json({
      success: true,
      message: 'File deleted successfully from Cloudinary'
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Error when deleting media file',
      error: error.message
    })
  }
}


