
import dbConnect from "@/lib/db";
import { messageModel, userModel } from "@/models/user";
export async function POST(req:Request){
    try {
        await dbConnect()
        const {username, verificationCode} = await req.json();
        const user  = await userModel.findOne({username})
        console.log(user)
        if(!user){
            return Response.json({success:false,message:"User Doesnot Exsist"})
        }
        if(user.verificationCode !== verificationCode){
            return Response.json({success:false,message:"Invalid Code"})
        }
        
        if(new Date(user.verificationCodeExpiry) < new Date()){
            return Response.json({success:false,message:"Verification Code Expired"})
        }
            

        user.isVerified =true
        // user.verificationCode = ""
        await user.save()
        console.log(user)
        return Response.json({success:true,message:"Verification Successfull",user})


    } catch (error) {
        console.log("Error occured while verifying user",error)
        return Response.json({success :false, message:"Verification failed"},{status:500})
    }

}