import { User } from "../Models/user.models.js"

export async function assingAgent  (req, res){
    const { userId, agentId} = req.body
    if(!userId || !agentId)
        return res.status(405).json({ messege: "Invalid Input"})

    try {
        const agent = await User.findById(agentId)
        const user = await User.findById(userId);

        if(!agent)
            return res.status(400).json({ error: "Agent not found online"})
        if(!user)
            return res.status(404).json({error: "No user find"})
        user.assignedAgent = agent._id

        await user.save();
        res.json({ message: "Agent assinged sucesfullu"})
    }
    catch(er){
        console.error(`Error: ${er}`)
    }
}  

