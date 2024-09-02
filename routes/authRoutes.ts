import express from 'express'
import multer from 'multer'
import {  create_user,finishProfile,login_user, verifyOtp } from '../controllers/userControllers/authControllers'

const authRouter=express.Router()
import { protect } from '../middlewares/authMiddleware'

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

authRouter.post('/signup',create_user)
authRouter.post('/verifyOtp',verifyOtp)
authRouter.post('/login',login_user)
authRouter.patch('/finishProfile',protect, upload.single('photo'),finishProfile)

// authRouter.post('/signupwithgoogle',create_google_user) 
// authRouter.post('/resendotp',resendOtp)
// authRouter.post('/clearotp',clearOtp)
// authRouter.post('/logout',logout)
// authRouter.post('/contactadmin',contactAdmin)


export default authRouter