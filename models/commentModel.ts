import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},
{
   timestamps:true 
})

export const Comment=mongoose.model('comments',commentSchema)