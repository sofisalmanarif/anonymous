import {z} from "zod"

export const messageSchema = z.object({
    message: z.string().min(2,{message:"content should be greater than  2 letters"})
    .max(500,{message:"content should be lessthan  500 letters"})
   
})