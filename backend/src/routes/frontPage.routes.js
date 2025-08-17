import { Router } from "express";
import { createFrontPageContent } from "../controllers/frontPage.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { roleAccessController } from "../middlewares/roleAccess.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"; // Make sure this points to your multer config
import { getFrontPageContent } from "../controllers/frontPage.controller.js";
import {updateFrontPageContent} from "../controllers/frontPage.controller.js";

// Set up multer fields for image & video uploads
const frontPageUpload = upload.fields([
  { name: "imageUrl", maxCount: 1 },
  { name: "videoUrl", maxCount: 1 },
]);

const frontPageRouter = Router();

frontPageRouter
  .route("/front-page")
  .post(
    verifyJWT,
    roleAccessController,
    frontPageUpload,             // <-- File upload middleware for image & video
    createFrontPageContent
  );

  frontPageRouter
  .route("/getFront-pageData")
  .get(
    verifyJWT,
    roleAccessController,
    getFrontPageContent
  );

  frontPageRouter
  .route("/updateFront-pageData/:id")
  .patch(
    verifyJWT,
    roleAccessController,
    frontPageUpload,             // <-- File upload middleware for image & video
    updateFrontPageContent
  );

  




export default frontPageRouter;
