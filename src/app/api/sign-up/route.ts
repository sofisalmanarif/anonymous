import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db";
import { userModel } from "@/models/user";
import { ApiResponse } from "@/types/apiResponse";

export async function POST(request:Request){
    await dbConnect()
    const {userName, email, password } = await request.json();

    
   try {
    
   } catch (error) {

    console.log("Error while sign up",error)

    return Response.json({success:false,message:"signout Failed"},{status:500})
    
   }

}

