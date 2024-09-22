import dbConnect from "@/lib/db";
import { messageModel, userModel } from "@/models/user";
import { Message } from "@/models/user";

export async function POST(req:Request){
    await  dbConnect()
    try {
        const {content, username } =await req.json();
        const user = await userModel.findOne({username});
        if(!content){
            return Response.json({success:false,message:"Write a message"},{status:500})
        }
        if(!user){
            return Response.json({success:false,message:"User not found"},{status:500})
        }
        if(!user.isAcceptionMessages){
            return Response.json({success:false,message:"User not accept messages"},{status:500})
        }
        const newMessage = {content,createdAt:new Date()} 
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json({success:true,message:"Message Send Successfully"},{status:200})

    } catch (error) {
        console.log("Can't send Message",error)
        return Response.json({success:false,message:"Error Occrured While sending Message"},{status:500})
    }
}