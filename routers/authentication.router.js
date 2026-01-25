import express from "express";
import usersController from '../controllers/authentication.controller.js';
import authenticationController  from '../controllers/authentication.controller.js'
import verifyToken from '../middelwares/verifyToken.js';
import validateDto from '../middelwares/validateDto.js';
import { createUserValidation, loginUserValidation } from '../validations/user.validation.js';
const { createUser , loginUser ,getUser , logoutUser ,
    validateEmail , forgotPassword , resetPassword } = usersController;
const {googleStart,googleCallback,authMe,googleLogin}= authenticationController

const router = express.Router();

router.post('/register',validateDto(createUserValidation), createUser);
router.post('/login',validateDto(loginUserValidation), loginUser );
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-email', validateEmail);
// router.get('/me',authMe)
router.post('/google', googleLogin);


export default router;