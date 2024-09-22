import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { userModel } from "@/models/user";
import {User} from "next-auth"
import dbConnect from "@/lib/db";
import { connect } from "http2";
export async function POST(req:Request){
    try {
        await dbConnect()
        const session = await getServerSession(authOptions);
        const {isAcceptingMessage} = await req.json()
        console.log(session)
        const user :User = session?.user as User
        if(! session || !session.user){
            return Response.json({success:false,message:"Unauthenticated"},{status:500})
        }
        const loggedInUser = await userModel.findByIdAndUpdate({_id:user._id},{isAcceptionMessages:isAcceptingMessage},{new:true})
        if(!loggedInUser){
            return Response.json({success:false,message:"User not found"},{status:404})
        }

        return Response.json({success:true,message:"Updated successfully"},{status:200})
    } catch (error) {
        console.log("Error while updating accepting messages status",error)
        return Response.json({success:false,message:"Someting Went Wrong"},{status:500})
    }
    
} 

export async function GET(req:Request){
    try {
        await dbConnect()
        const session = await getServerSession(authOptions);
        console.log(session)
        const user :User = session?.user as User
        if(! session || !session.user){
            return Response.json({success:false,message:"Unauthenticated"},{status:500})
        }
        const loggedInUser = await userModel.findOne({_id:user._id})
        if(!loggedInUser){
            return Response.json({success:false,message:"User not found"},{status:404})
        }
        const isUserAcceptingMessage = loggedInUser.isAcceptionMessages

        return Response.json({success:true,isUserAcceptingMessage:isUserAcceptingMessage},{status:200})
    } catch (error) {
        console.log("Error while chacking accepting messages status",error)
        return Response.json({success:false,message:"Can't get Status"},{status:500})
    }
    
} 
