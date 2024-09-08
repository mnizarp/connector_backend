import express from 'express'
import { protect } from '../middlewares/authMiddleware'
import { clear_unread_messages, get_chat_unread_messages, get_chats, get_messages, get_unread_messages, sendMessage } from '../controllers/userControllers/chatControllers'
export const chatRouter=express()

chatRouter.post('/sendMessage',protect,sendMessage)
chatRouter.get('/getMessages/:secondUserId',protect,get_messages)
chatRouter.get('/getChats',protect,get_chats)

chatRouter.get('/getunreadmessages',protect,get_unread_messages)
chatRouter.post('/getchatunreadmessages',protect,get_chat_unread_messages)
chatRouter.patch('/clearUnreadMessages',protect,clear_unread_messages)