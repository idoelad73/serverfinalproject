import express from 'express';
import userController from '../controllers/user.controller.js';
import verifyToken from '../middelwares/verifyToken.js';
const { updateUserProfile , updateUserPassword,getUserDetails ,getAllUsers,updateUserContact} = userController;

const router = express.Router();


router.patch("/profile/update",verifyToken, updateUserProfile);
router.put("/profile/update-password",verifyToken, updateUserPassword);
router.get("/user-details/:id",getUserDetails);
router.get("/all",getAllUsers);
router.patch("/update-contact",updateUserContact)



export default router;

