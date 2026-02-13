import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import 'dotenv/config';
import authRouter from "./routes/authRoutes.js";


//connect to mongodb
import connectDB from "./config/mongodb.js";
connectDB();


//call app
const app = express();

//start server
const PORT = process.env.PORT || 4000;

//MIDDLEWARES
app.use(express.json());
app.use(cors({credentials: true}));
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//routes
app.get("/", (req, res) => {
    res.send("Welcome to the MERN Auth API....API is running...");
});
app.use("/api/auth", authRouter);