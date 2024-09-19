import { EmailTemplate } from "@/components/EmailTamplets";
import { resend } from "@/lib/resend";
import { ApiResponse } from '@/types/apiResponse';


export async function sendVerificationEmail(email:string,userName:string,verifyCode:string):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Annonymous',
            react: EmailTemplate({ firstName: 'John' }),
          });
        return{success: true,
            message: "string",}
            
    } catch (error) {
        return{success:false,message:"Verification email send failed"}
    }
}
