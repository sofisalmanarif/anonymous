"use client"

import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceValue } from 'usehooks-ts'
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


const formSchema = z.object({
    signUpSchema: signUpSchema
})
const page = () => {
    const [username, setUsername] = useState<string>('')
    const [usernameMessage, setUsernameMessage] = useState<string>('')
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
    const [isSubmitttingForm, setIsSubmittingForm] = useState<boolean>(false)

    const debouncedUsername = useDebounceValue(username, 500)
    const {toast} = useToast()
    const router = useRouter()

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof signUpSchema>) {

        console.log(values)
        setIsSubmittingForm(true)
        try {
            const {data} = await axios.post("/api/sign-up",values)
            setIsSubmittingForm(false)
            toast({
                title: "Success",
                description : data.message
            })
            router.replace(`/verify/${username}`)


        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title:"success",
                description:"Sign Up failed"

            })
            setIsSubmittingForm(false)
            
        }
        

    }
    const isUsernameUnique = async ()=>{
        try {
            setIsCheckingUsername(true)
            console.log("api calling")
            const {data} = await axios.post("/api/unique-username",{debouncedUsername})
            setUsernameMessage(data.message)
            setIsCheckingUsername(false)
        } catch (error) {
            console.error("filed to fethch")
        }
  
    }
    useEffect(()=>{
        isUsernameUnique()
        console.log("loaded")
    },[debouncedUsername])


    return (
        <div className="w-full min-h-screen flex items-center justify-center">
           <div className="w-[25rem] px-16 ">
            <h1>Sign-up</h1>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                    field.onChange((e:React.ChangeEvent<HTMLInputElement>)=>setUsername(e.target.value))
                }}/>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
        />
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
       <div className="flex items-center justify-center"> <Button type="submit">Submit</Button></div>
      </form>
      </Form>

           </div>
        </div>
    )
}

export default page