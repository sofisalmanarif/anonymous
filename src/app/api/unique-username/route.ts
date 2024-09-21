import  dbConnect from "@/lib/db";
import { userModel } from "@/models/user";
export async function POST(req:Request){
    try {
        const { username } = await req.json();
        const user = await userModel.findOne({username,isVerified :true },)

        if(user){
            return Response.json({success :false, message:"Username is unvailable"},{status:400})
        }
        return Response.json({success :true, message:"username is available"},{status:200})

        
    } catch (error) {
        console.log("Error occured while checking  username",error)
        return Response.json({success :false, message:"someting Went Wrong"},{status:500})
    }
}