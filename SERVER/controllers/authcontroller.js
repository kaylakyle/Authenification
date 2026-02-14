import bcrypt from "bcryptjs";
import userModel from "../models/usermodels.js";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

// Registration controller
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the missing details" });
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(String(password), 10);

        // Create user 
        const newUser = new userModel({ name, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT
        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
         // Prepare email options
         const mailOptions = {
            from: `"MERN Auth App" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "Welcome to Our App - MERN Authentication",
            text: `Welcome to our app: ${name}, Account created successfully! with email id: ${email}`,

        };

        // Send welcome email
        await transporter.sendMail(mailOptions);


        //final response
        return res.status(201).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        console.error(error);
        };

        return res.status(500).json({ success: false, message: "Error in registration" });
    };

// Login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email " });
        }

        const isMatch = await bcrypt.compare(String(password), user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid  password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ success: true, message: "Login successful", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error in login" });
    }
};

// Logout controller
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Send OTP for email verification
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.user; // comes from middleware
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "User Account is already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        await transporter.sendMail({
            from: `"MERN Auth App" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Account Verification OTP - MERN Authentication",
            text: `Hi ${user.name}, your verification OTP is: ${otp}`,
        });

        return res.json({ success: true, message: "Verification OTP sent to email" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error sending verification OTP" });
    }
};


// get OTP to verify user account
export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;          // only OTP comes from client
    const { userId } = req.user;       // userId comes from JWT middleware

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP has expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: "Error verifying email" });
  }
};

// user Authentification
export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// send password reset OTP
export const SendResetOtp = async (req, res) => {
    const {email} = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    try {
        const user = await userModel.findOne({email});

        if(!user) {
            return res.status(400).json({ success: false, message: "No User Found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60  * 1000;
        await user.save();

        await transporter.sendMail({
            from: `"MERN Auth App" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Password Reset OTP - MERN Authentication",
            text: `Hi ${user.name}, your password reset OTP is: ${otp},please use the OTP to reset password`,
        });

        return res.json({ success: true, message: "Reset OTP sent to email" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error sending reset OTP" });
    }
};

    //user verify otp and reset password
    export const resetPassword = async (req,res) => {
        const {email, otp, newPassword} = req.body;

        if (!email || !otp || !newPassword) {
          return res.status(500).json({ success: false, message: "Email, OTP and newPassword is required" });  
        }

        try {
            const user = await userModel.findOne({email});

            if(!user) {
                return res.status(500).json({ success: false, message: "No user found" });
            }

            if( user.resetOtp === "" || user.resetOtp !== otp) {
                return res.status(500).json({ success: false, message: "Error invalid OTP" });
            }
            if(user.resetOtpExpireAt < Date.now()) {
                return res.status(500).json({ success: false, message: "Error OTP has expired" });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            user.password = hashedPassword;
            user.resetOtp = "";
            user.resetOtpExpireAt = 0;

            return res.status(500).json({ success: true, message: "Password created successfully" });
        } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
    };
