'use client'
"use client"

import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import axios from 'axios'
import{
Form,
FormControl,
FormDescription,
FormField,
FormItem,
FormLabel,
FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


const formSchema = z.object({
    signUpSchema: signUpSchema
})
const page = () => {

    const [isSubmitttingForm, setIsSubmittingForm] = useState<boolean>(false)

   
    const {toast} = useToast()
    const router = useRouter()

    // zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
          email: "",
          password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof signInSchema>) {

        console.log(values)
        setIsSubmittingForm(true)
        const response = await signIn("credentials",{
          email:values.email,
          password:values.password,
          redirect:false
        })
        if (response?.error){
          toast({
            title:"Sign Failed",
            description:"Invalid Credietials",
            variant:"destructive"
          })

        }
        if(response?.url){
          toast({
            title:"Sign Successfull",
            description:"Welcome",
            
          })
          router.replace("/dashboard")
        }
        console.log(response)
        

    }


    return (
        <div className="w-full min-h-screen flex items-center justify-center">
           <div className="w-[30rem] p-10 border-2 rounded-md border-zinc-600 ">
            <h1 className="text-4xl font-bold mb-10 text-center">Sign In</h1>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
          



         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Password" {...field} />
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
       <div className="flex items-center justify-center">
        <Button  type="submit">Submit</Button>
        </div>
        <p className="text-center text-xs">New member! <Link href={"/sign-up"} className="text-blue-500">Sign up</Link> </p>
      </form>
      </Form>

          </div>
        </div>
    )
}

export default page