import mongoose from "mongoose";

const notificationSchema=new mongoose.Schema({
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        },
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        },
        type:{
            type:String,
        },
        unread:{
            type:Boolean
        }
     },{
        timestamps:true
     }
)

export const Notification=mongoose.model('notifications',notificationSchema)