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


const formSchema = z.object({
    signUpSchema: signUpSchema
})
const page = () => {
    const [username, setUsername] = useState<string>('')
    const [usernameMessage, setUsernameMessage] = useState<string>('')
    const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false)
    const [isSubmitttingForm, setIsSubmittingForm] = useState<boolean>(false)

    const debouncedUsername = useDebounceValue(username, 500)
    const toast = useToast()
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

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
    }
    const isUsernameUnique = async ()=>{
        setIsCheckingUsername(true)
        console.log("api calling")
        const {data} = await axios.post("/api/unique-username",{debouncedUsername})
        setUsernameMessage(data.message)
        setIsCheckingUsername(false)
  
    }
    useEffect(()=>{
        isUsernameUnique()
        console.log("loaded")
    },[debouncedUsername])


    return (
        <div>signup page</div>
    )
}

export default page