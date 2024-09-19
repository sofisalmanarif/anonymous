import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/db";
import { userModel } from "@/models/user";
import { ApiResponse } from "@/types/apiResponse";

export async function POST(request: Request) {
    try {
        await dbConnect()
        const { username, email, password } = await request.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiryDate = new Date(Date.now() + 3600000)
    
        const existingUserVerifiedByUsername = await userModel.findOne({ username, isVerified: true })
        if (existingUserVerifiedByUsername) {
            return Response.json({ success: false, message: "Username taken" }, { status: 500 })
        }
        const existingUserByEmail = await userModel.findOne({ email })
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({ success: false, message: "Email already in use" }, { status: 500 })
            }
            else {
                existingUserByEmail.password = hashedPassword,
                    existingUserByEmail.verificationCode = verifyCode,
                    existingUserByEmail.verificationCodeExpiry = expiryDate
                await existingUserByEmail.save()
            }
        }
        else {
            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                messages: [],
                verificationCode: verifyCode,
                isVerified: false,
                verificationCodeExpiry: expiryDate,
                isAcceptionMessages: true,
    
            })
            await newUser.save()
    
    
        }
        // send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        if (!emailResponse.success) {
            return Response.json({ success: false, message: emailResponse.message }, {
                status: 500
            })
    
        }
        Response.json({ success: true, message: "User Registered sucessfully please check email" }, { status: 201 })
    
    
    } catch (error) {

        console.log("Error while sign up", error)

        return Response.json({ success: false, message: "signout Failed" }, { status: 500 })

    }

}

