import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import frontPageModule from "../models/frontPage.model.js";
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const createFrontPageContent = asyncHandler(async (req, res) => {
  const { description, title } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  // Use the correct Multer field names: "image" and "video"
  const imageLocalPath = req.files?.imageUrl?.[0]?.path;
  const videoLocalPath = req.files?.videoUrl?.[0]?.path;

  console.log("Image Local Path:", imageLocalPath);
  console.log("Video Local Path:", videoLocalPath);

  if (!imageLocalPath || !imageLocalPath.trim()) {
    throw new ApiError(400, "Image file is required");
  }

  // Upload image and get only the secure_url
  const imageUploadResult = await uploadOnCloudinary(imageLocalPath);
  const imageUrlCloudinary = imageUploadResult?.secure_url || imageUploadResult?.url;
  if (!imageUrlCloudinary) {
    throw new ApiError(400, "Image upload failed");
  }

  let videoUrlCloudinary = null;
  if (videoLocalPath) {
    const videoUploadResult = await uploadOnCloudinary(videoLocalPath);
    videoUrlCloudinary = videoUploadResult?.secure_url || videoUploadResult?.url;
    if (!videoUrlCloudinary) {
      throw new ApiError(400, "Video upload failed");
    }
  }

  const frontPageContent = new frontPageModule({
    title,
    description,
    imageUrl: imageUrlCloudinary, // Only the url!
    videoUrl: videoUrlCloudinary, // Only the url!
  });

  await frontPageContent.save();

  return res.status(201).json(
    new ApiResponse(201, "Front page content created successfully", frontPageContent)
  );
});


const getFrontPageContent = asyncHandler(async (req, res) => {
  const frontPageContent = await frontPageModule.find().sort({ createdAt: -1 });

  if (!frontPageContent) {
    throw new ApiError(404, "Front page content not found");
  }

  return res.status(200).json(
    new ApiResponse(200, "Front page content retrieved successfully", frontPageContent)
  );
});


const updateFrontPageContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!id) {
    throw new ApiError(400, "Front page content ID is required");
  }

  const frontPageContent = await frontPageModule.findById(id);
  if (!frontPageContent) {
    throw new ApiError(404, "Front page content not found");
  }

  // Update text fields
  if (title) frontPageContent.title = title;
  if (description) frontPageContent.description = description;

  // Check and upload new image
  if (req.files?.image?.[0]?.path) {
    const imagePath = req.files.image[0].path;
    console.log("Uploading image from path:", imagePath);

    const uploadedImage = await uploadOnCloudinary(imagePath);
    console.log("Image upload result:", uploadedImage);

    if (uploadedImage?.secure_url) {
      frontPageContent.imageUrl = uploadedImage.secure_url;
    } else {
      throw new ApiError(400, "Image upload failed");
    }
  }

  // Check and upload new video
  if (req.files?.video?.[0]?.path) {
    const videoPath = req.files.video[0].path;
    console.log("Uploading video from path:", videoPath);

    const uploadedVideo = await uploadOnCloudinary(videoPath);
    console.log("Video upload result:", uploadedVideo);

    if (uploadedVideo?.secure_url) {
      frontPageContent.videoUrl = uploadedVideo.secure_url;
    } else {
      throw new ApiError(400, "Video upload failed");
    }
  }

  await frontPageContent.save();

  return res.status(200).json(
    new ApiResponse(200, "Front page content updated successfully", frontPageContent)
  );
});



export { createFrontPageContent, getFrontPageContent, updateFrontPageContent };
