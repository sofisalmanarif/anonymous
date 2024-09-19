import { Message } from "@/models/user";

export type ApiResponse ={
    success:boolean,
    message:string,
    isAcceptiongMessages?:boolean,
    messages?:Array<Message>

}