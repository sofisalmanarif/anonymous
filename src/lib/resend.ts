import { EmailTemplate } from '@/components/EmailTamplets';
import { Resend } from 'resend';


export const resend = new Resend(process.env.RESEND_API_KEY);




