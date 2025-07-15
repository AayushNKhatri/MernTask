import { User } from "../Models/user.models.js";

export async function login (req, res) {
    const {username, role} = req.body;
    if(!username || !role) {
        return res.status(400).json({messege:"Username and role are requried"})
    }

    let user = await User.findOne({ username });
    if(!user) {
        user = await User.create({ username, role});
    }

    req.session.user = {
        id:user._id,
        username:user.username,
        role:user.role,
    }

    res.status(200).json({messege:"Login sucessfull", user:req.session.user})
 }

export async function logout(req, res) {
    req.session.destory();
    res.json({messege:"logged out sucessfull"})
}