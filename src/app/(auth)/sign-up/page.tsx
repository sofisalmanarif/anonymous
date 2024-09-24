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


const formSchema = z.object({
    signUpSchema: signUpSchema
})
const page = () => {
    const [username, setUsername] = useState<string>('')
    const [usernameMessage, setUsernameMessage] = useState<string>('')
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
    const [isSubmitttingForm, setIsSubmittingForm] = useState<boolean>(false)

    const debounced = useDebounceCallback(setUsername, 500)
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
           if(username){
            setIsCheckingUsername(true)
            console.log("api calling")
            const {data} = await axios.post("/api/unique-username",{username})
            setUsernameMessage(data.message)
            console.log(data)
            console.log(usernameMessage==="Username is available")
            setIsCheckingUsername(false)
           }
        } catch (error) {
            console.error("filed to fethch")
        }
  
    }
    useEffect(()=>{
        isUsernameUnique()
        console.log(username)
        console.log(usernameMessage)
    },[username])


    return (
        <div className="w-full min-h-screen flex items-center justify-center">
           <div className="w-[30rem] p-10 border-2 rounded-md border-zinc-600 ">
            <h1 className="text-4xl font-bold mb-10 text-center">Sign-up</h1>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{
                    field.onChange(e); // Call the form handler provided by react-hook-form
                    debounced(e.target.value);
                }}/>
              </FormControl>
              
              <FormMessage />
            </FormItem>
          )}
          />
          

<p className={`mt-10 text-xs ${usernameMessage=="Username is available" ? 'text-green-500' : 'text-red-500'}`}>
  {usernameMessage}
</p>
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
         <Button variant={"secondary"} type="submit">Submit</Button>
         </div>
         <p className="text-center text-xs">Already a member! <Link href={"/sign-in"} className="text-blue-500">Sign in</Link> </p>
      </form>
      </Form>

           </div>
        </div>
    )
}

export default page