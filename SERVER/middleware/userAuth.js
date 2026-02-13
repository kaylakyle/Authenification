import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    const {token} = req.cookies;

    if(!token) {
        return res.status(401).json({ success: false, message: "Unauthorized Login: No token provided" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
       
        // find id
        if (tokenDecode.id) {
            res.body.userId = tokenDecode.id;
        }else {
            res.json({ success: false, message: "Unauthorized Login: Invalid token" });
        }
        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

    export default userAuth;    