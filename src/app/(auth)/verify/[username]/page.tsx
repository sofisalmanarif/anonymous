"use client"

import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useParams, useRouter } from "next/navigation"
import axios from 'axios'
import {
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
import { verificationCodeSchema } from "@/schemas/verificationCodeSchema"



const page = () => {
    const [isSubmitttingForm, setIsSubmittingForm] = useState<boolean>(false)

    const { toast } = useToast()
    const router = useRouter()
    const params = useParams<{ username: string }>()

    // zod implementation
    const form = useForm<z.infer<typeof verificationCodeSchema>>({
        resolver: zodResolver(verificationCodeSchema),
        defaultValues: {
            verificationCode: "",
        },
    })

    async function onSubmit(values: z.infer<typeof verificationCodeSchema>) {

        console.log(values)
        setIsSubmittingForm(true)
        try {
            const { data } = await axios.post("/api/verify", { ...values, username: params.username })
            setIsSubmittingForm(false)
            toast({
                title: "Success",
                description: data.message
            })
            router.replace(`/sign-in`)


        } catch (error) {
            console.error(error)
            toast({
                variant: "destructive",
                title: "success",
                description: "Sign Up failed"

            })
            setIsSubmittingForm(false)

        }


    }

    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="w-[30rem] p-10 border-2 rounded-md border-zinc-600 ">
                <h1 className="text-4xl font-bold mb-10 text-center">Enter 6 digit verification Code</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">


                        <FormField
                            control={form.control}
                            name="verificationCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification code</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="XXXXXX" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-center">
                            <Button  type="submit">Verify</Button>
                        </div>
                    </form>
                </Form>

            </div>
        </div>
    )
}

export default page