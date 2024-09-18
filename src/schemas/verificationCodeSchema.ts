import {z} from "zod"

export const verificationCodeSchema = z.object({
    verificationCode: z.string().length(8,{message:"Verification should be 8 digit"})
   
})