import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    content:{
        type:String,
        trim:true
    },
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'chats'
    },
    unread:{
        type:Boolean,
        default:true
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
},{
    timestamps:true
})

export const Message=mongoose.model('messages',messageSchema)