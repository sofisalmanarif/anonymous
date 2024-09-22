import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { userModel } from "@/models/user";
import { User } from "next-auth"
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await dbConnect()
    try {
        const session = await getServerSession(authOptions);

        console.log(session)
        const user: User = session?.user as User
        if (!session || !session.user) {
            return Response.json({ success: false, message: "Unauthenticated" }, { status: 500 })
        }
        const userId = new mongoose.Types.ObjectId(session?.user._id)
        const loggedInUser = await userModel.aggregate([{ $match: { _id: userId } },{ $unwind: "$messages" }, { $sort: { "messages.createdAt": -1 } }, { $group: { _id: "$_id", messages: { $push: "$messages" } } }])
        if (!loggedInUser || loggedInUser.length === 0) {
            return Response.json({ success: false, message: "User not found" }, { status: 404 })
        }

        return Response.json({ success: true, messages: loggedInUser[0].messages }, { status: 200 })
    } catch (error) {
        console.log("Error while getting user messages ", error)
        return Response.json({ success: false, message: "Someting Went Wrong" }, { status: 500 })
    }

}

