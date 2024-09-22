import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    content: string,
    createdAt: Date,
}

export interface User extends Document {
    username: string,
    email: string,
    password: string,
    messages: Message[],
    verificationCode :string,
    isVerified: boolean,
    verificationCodeExpiry: Date,
    isAcceptionMessages :boolean,



}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: true,
        unique:true,
        trim:true,
    },
    email: {
        type: String,
        required: true,
        unique:true,

    },
    password: {
        type: String,
        required: true,

    },
    verificationCode: {
        type: String,
        required: true,

    },
    verificationCodeExpiry: {
        type: Date,
        required: true,

    },
    isAcceptionMessages: {
        type: Boolean,
        required: true,
        default:true

    },
    isVerified:{
        type:Boolean,
        default:false

    },
    messages:[messageSchema]

})


const userModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",userSchema)
const messageModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",userSchema)
export {userModel,messageModel}  ;  //export the model to use it in other files
// export default messageModel

// export default userModel