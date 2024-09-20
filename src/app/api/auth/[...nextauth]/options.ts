import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs"
import { User, userModel } from "@/models/user";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jhon@jdh" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any,):Promise<any> {

                try {
                    await dbConnect()
                    const user = await userModel.findOne({ 
                        $or :[{username:credentials.identifier},{email:credentials.identifier}] })
                        if (!user) {
                            throw new Error("user doesnot exsist")
                        }
                        if (!user.isVerified) {
                            throw new Error("Please Verify First")
                        }
                        const isValid = await bcrypt.compare(credentials.password, user.password)

                        if(!isValid){
                            throw new Error("Invalid Credentails")
                        }
                        return user
                        
    
                } catch (error) {
                    console.error("Error during authorization:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                token._id = user._id?.toString();
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages
            }
            
            return token
          },
        async session({ session,  token }) {
            if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages 
            }
            return session
          }
         
    },
    pages:{
        signIn: '/sign-in',
    },
    session:{
        strategy: 'jwt',
    },
    secret:process.env.NEXTAUTH_SECRET
}
