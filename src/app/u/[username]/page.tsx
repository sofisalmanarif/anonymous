"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
// import { useToast } from '@/hooks/use-toast'
import { Message } from '@/models/user'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useToast } from "@/hooks/use-toast"

const page = () => {
  const { username } = useParams()
  console.log(username)
  const {toast} = useToast()
  const [isSubmitttingMessage, setIsSubmittingMessage] = useState<boolean>()


  const sendMessage = async () => {

  }
  // zod implementation
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",

    },
  })

  async function onSubmit(values: z.infer<typeof messageSchema>) {

    console.log(values)
    setIsSubmittingMessage(true)
    try {
      const { data } = await axios.post("/api/send-message", {username,content:values.message})
      setIsSubmittingMessage(false)
      toast({
        title: "Success",
        description: data.message
      })


    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "error",
        description: "Failed to send message"

      })
      setIsSubmittingMessage(false)

    }


  }
  return (
    <div className='container mx-auto  mt-10'>

      <h2 className='font-extrabold text-xl'>{`Send Anonymous message to ${username}`}</h2>
      <div className='flex gap-10 bg-slate-900 px-2 py-2 rounded-md'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem >
                  <FormControl
                  >
                    <Input placeholder="Write Annonymous message" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            
              <Button type="submit">Submit</Button>
            

          </form>
        </Form>
      </div>
    </div>
  )
}

export default page