import { User } from "./user.models.js"
import bcrypt from "bcrypt"
export const seedAdmin = async () => {
    const exstingAdmin = await User.findOne({ role: "admin"});
    if(exstingAdmin){
        console.log("Admin already exist")
        return;
    }
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    const UserData = {
        username:"admin",
        password: hashedPassword,
        role: "admin",
        online:false
    }
    
    await User.create(UserData)
    console.log(`Admin seeded username: ${UserData.username}`)
}