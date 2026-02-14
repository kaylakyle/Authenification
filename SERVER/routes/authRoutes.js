//API endpoints with controller functions for user registration, login, and logout.
import express from 'express';
import {register,login,logout, sendVerifyOtp, verifyEmail, isAuthenticated, SendResetOtp, resetPassword} from '../controllers/authcontroller.js';
import  userAuth from '../middleware/userauth.js';

const authRouter = express.Router ();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/is-Auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', SendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;