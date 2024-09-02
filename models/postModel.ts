import mongoose from "mongoose";

const postSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    postImage:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        required:true
    },
    comments:{
        type:Array,
    },
    likes:{
        type:Array,
    },  
    isHide:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

export const Post=mongoose.model('posts',postSchema)