import express from 'express'
import { protect } from '../middlewares/authMiddleware'
import { getNotifications } from '../controllers/userControllers/notificationControllers'

const notificationRouter=express.Router()
notificationRouter.get('/getNotifications',protect,getNotifications)
// authRouter.get('/getunreadnotifications',protect,get_unread_notifications)
// authRouter.patch('/clearunreadnotifications',protect,clear_unread_notifications)

export default notificationRouter