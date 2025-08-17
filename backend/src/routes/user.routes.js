import {Router} from 'express';
import { registerUser } from '../controllers/user.controler.js';
import { loginUser } from '../controllers/user.controler.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { logoutUser } from '../controllers/user.controler.js';
import { refreshAccessToken } from '../controllers/user.controler.js';
import {updateAccountDetails} from '../controllers/user.controler.js';
import {changeCurrentPassword} from '../controllers/user.controler.js';
import {currentUser} from '../controllers/user.controler.js';
import { showAllUsers } from '../controllers/user.controler.js';
import {roleAccessController} from '../middlewares/roleAccess.middleware.js';
import { editUser } from '../controllers/user.controler.js';
// import { softDeleteUser } from '../controllers/user.controler.js';
import { deleteUser } from '../controllers/user.controler.js';
import { setActiveStatus } from '../controllers/user.controler.js';
import { upload } from '../middlewares/multer.middleware.js';
import {socialSignup} from '../controllers/user.controler.js';
import { socialLogin } from '../controllers/user.controler.js';
import {getUpcomingEvents} from '../controllers/user.controler.js';
import {getTodayEvents} from '../controllers/user.controler.js';
const router = Router();
router.route("/register").post(verifyJWT,roleAccessController, upload.fields([
    { name: 'avatar', maxCount: 1 },
    
]),registerUser);

router.route("/social-signup").post(verifyJWT,roleAccessController, upload.fields([
    { name: 'avatar', maxCount: 1 },
]), socialSignup);

// router.route("/login").post


router.route("/login").post(loginUser);

router.route("/social-login").post(socialLogin);
// secure routes

router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, currentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router.route("/showAllUsers").get(verifyJWT, roleAccessController, showAllUsers);


router.route("/edit/:userId").patch(verifyJWT, roleAccessController, editUser);
// router.route("/soft-delete/:userId").patch(verifyJWT, roleAccessController, softDeleteUser);
router.route("/delete/:userId").delete(verifyJWT, roleAccessController, deleteUser);
router.route("/set-active-status/:userId").patch(verifyJWT, roleAccessController, setActiveStatus);

router.route("/upcoming-events").get(getUpcomingEvents);

router.route("/today-events").get( getTodayEvents);



export default router;

// console.log("User routes loaded successfully....");