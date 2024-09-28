'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/models/user'
import { acceptMessageSchema } from '@/schemas/isAcceptingmessages'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

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

const handleSwitchChange = async () => {
  try {
    const response = await axios.post<ApiResponse>('/api/accept-message', {
      acceptMessages: !acceptMessages,
    });
    setValue('acceptMessages', !acceptMessages);
    toast({
      title: response.data.message,
      variant: 'default',
    });
  } catch (error) {
    const axiosError = error as AxiosError<ApiResponse>;
    toast({
      title: 'Error',
      description:
        axiosError.response?.data.message ??
        'Failed to update message settings',
      variant: 'destructive',
    });
  }
};
  const getAllMessages = async()=>{
    setIsLoading(true)
    try {
      const {data } =await axios.get<ApiResponse>("/api/get-messages")
      setMessages(data.messages || [])

    } catch (error) {
       const axiosError = error as AxiosError<ApiResponse>
      toast({
        title: "Error",
        description: axiosError.message ||"Someting Went Wrong",
        variant:'destructive'
      })
    }finally{
      setIsLoading(false)
    }
  }
useEffect(() => {
  fetchIsAcceptingMessages
  getAllMessages
}, [getAllMessages,fetchIsAcceptingMessages,setValue,messages])
const url="hdggeggghgdhghsgag"
  return (
    <div className='flex flex-col container mx-auto mt-10'>
      <h2 className='font-extrabold text-6xl'>User Dashboard</h2>
      <h4 className='font-semibold text-lg my-2'>Copy your unique Link</h4>
    <div className='flex gap-10 bg-slate-900 px-2 py-2 rounded-md'><Input type="email" className='outline-none border-none' value={url} placeholder="Email" disabled={true} />
      <Button>Copy</Button>
      </div>
      <div className="flex items-center space-x-2 mt-2">
      <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
    </div>
    <div className='container  py-10 flex gap-10 flex-wrap'>
      {
        messages.length >0 ?messages.map(message=>(<MessageCard message={message} deleteHandler={deleteHandler} />)) :<p> You dont have any messages right now</p>
      }

    </div>
    </div>
  )
}

export default page