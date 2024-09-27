'use client'
import MessageCard from '@/components/MessageCard'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/models/user'
import { acceptMessageSchema } from '@/schemas/isAcceptingmessages'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'


const page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const deleteHandler = (messageId: string) => {
    setMessages(messages.filter(message => message._id !== messageId))
    console.log("first")
  }
  const { data } = useSession()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const { register, watch, setValue } = form

  const acceptMessages = watch("acceptMessages")

  const fetchIsAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const {data} = await axios.get<ApiResponse>("/api/accept-message")
      console.log(data)
      setValue("acceptMessages",data.isAcceptiongMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.message ||"Someting Went Wrong",
        variant:'destructive'
      })
    }finally{
      setIsSwitchLoading(false)
    }
}, [setValue])

  
useEffect(() => {
  fetchIsAcceptingMessages
}, [])

  return (
    <div className='px-20 py-10 flex gap-10 flex-wrap'>
      <MessageCard message="hay" deleteHandler={() => deleteHandler('2')} />

    </div>
  )
}

export default page