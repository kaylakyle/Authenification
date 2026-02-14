import userModel from "../models/usermodels.js";
 
export const getUserData = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if(!user) {
             return res.status(500).json({ success: true, message: "User not found" });
        }
        res.json ({
            success : true,
            userData : {
                name : user.name,
                isAccountVerified : user.isAccountVerified
            }
        });
    } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Error fetching user data" });
    }
};

            



