import {z} from "zod"
const usernameValidation = z.string().
    min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at least 20 characters long" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username can only simple characters"})

    export const signUpSchema = z.object({
        username: usernameValidation,
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(8, { message: "Password must be at least "})
    })