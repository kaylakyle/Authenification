import express from "express";
import { getUserData } from "../controllers/usercontrollers.js";
import  userAuth from '../middleware/userauth.js';

const userRoutes = express.Router();
userRoutes.get('/data', userAuth, getUserData);

export default userRoutes;

