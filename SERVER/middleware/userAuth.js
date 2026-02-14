import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized Login: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.userId) {
            req.user = { userId: decoded.userId }; // attach to req
            return next();
        } else {
            return res.status(401).json({ success: false, message: "Unauthorized Login: Invalid token" });
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: "Unauthorized Login: " + error.message });
    }
};

export default userAuth;
