import { EmailTemplate } from "@/components/EmailTamplets";
import { resend } from "@/lib/resend";
import { ApiResponse } from '@/types/apiResponse';


export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Annonymous Verification Code',
            react: EmailTemplate({ firstName: 'John',opt:verifyCode }),
          });
        return{success: true,
            message: "Verification Code Sent",}
            
    } catch (error) {
        console.log(error)
        return{success:false,message:"Verification email send failed"}
    }
}
