//API endpoints with controller functions for user registration, login, and logout.
import express from 'express';
import {register,login,logout} from '../controllers/authcontroller.js';

const authRouter = express.Router ();
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

export default authRouter;