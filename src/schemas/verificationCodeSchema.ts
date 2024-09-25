import {z} from "zod"

export const verificationCodeSchema = z.object({
    verificationCode: z.string().length(6,{message:"Verification should be 8 digit"})
   
})