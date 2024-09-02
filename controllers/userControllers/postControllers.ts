import { Request, Response, response } from "express";
import { Post } from "../../models/postModel";
import { Comment } from "../../models/commentModel";
import mongoose from "mongoose";
// import { Report } from "../../models/reportModel";
import cloudinary from "../../utils/cloudinary";
// import { Notification } from "../../models/notificationModel";
// import { Saved } from "../../models/savedModel";

export const create_post = async (req: Request, res: Response) => {
  try {
    const userId = req?.userId;
    if (!req.file || !req.body.caption) {
      return res
        .status(401)
        .json({ message: "Post Image and caption required" });
    }
    cloudinary.uploader
      .upload_stream(
        {
          upload_preset: "linguaBlend",
        },
        async (error, result) => {
          if (error) {
            return res.status(502).json({ message: "Upload failed", error });
          }
          const url = result?.secure_url;
          try {
            await Post.create({
              userId,
              caption: req.body?.caption,
              postImage: url,
            });
            res
              .status(200)
              .json({ status: "success", message: "post added successfully" });
          } catch (error) {
            console.error("Database update failed:", error);
            res.status(500).json({ message: "Post not added", error });
          }
        }
      )
      .end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "post adding failed" });
  }
};

export const getFeedPosts = async (req: Request, res: Response) => {
  try {
    let userId=''; 
    if(req.userId && typeof req.userId ==='string') {
      userId=req.userId
    }
    const feedPosts = await Post.aggregate([
      {
        $match: { isHide: false, isDeleted: false },
        // $match: { isHide: false, isDeleted: false, userId: { $ne: new mongoose.Types.ObjectId(userId) } },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          postImage: 1,
          caption: 1,
          likes: 1,
          "user.name": 1,
          "user._id": 1,
          "user.photo": 1,
          createdAt: 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    res
      .status(200)
      .json({
        status: "success",
        message: "Fetched all feed posts",
        feedPosts,
      });
  } catch (error) {
    res.status(400).json({ message: "Fetching failed" });
  }
};

export const getProfilePosts=async(req:Request,res:Response)=>{
  try {
    const profileId = req.headers['x-profile-id'];
    const profilePosts=await Post.find({userId:profileId,isDeleted:false,isHide:false}).sort({createdAt:-1});
    res.status(200).json({status:"success",message:'Profile posts fetched successfully',profilePosts})
  } catch (error) {
    res.status(400).json({message:"Profile post fetching failed"})
  }
}

export const like_unlike = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const user = req.userId;
    const post = await Post.findOne({ _id: postId });
    const isAlreadyLiked = await Post.find({
      _id: postId,
      likes: { $in: [user] },
    });
    if (isAlreadyLiked.length > 0) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: user } });
      // await Notification.deleteOne({
      //   user_id: post?.user_id,
      //   sender_id: user,
      //   type: "Like",
      // });
      // res.status(200).json({ liked: false, message: "unliked the post" });
      res.status(200).json({message: "Unliked the post" });
    } else {
      await Post.updateOne({ _id: postId }, { $addToSet: { likes: user } });
      // let newnotification;
      // if(post?.user_id.toString() !== user ){
      //  newnotification = new Notification({
      //   user_id: post?.user_id,
      //   sender_id: user,
      //   type: "Like",
      //   unread: true,
      // });
      // await newnotification.save();
      res.status(200).json({ message:'Liked' });
    }
      // res.status(200).json({ liked: true, newnotification });
     

  } catch (error) {
    console.error(error);
    res.status(400).json({message:'like failed'})
  }
};

// export const delete_post = async (req: Request, res: Response) => {
//   try {
//     const { postId } = req.body;
//     await Post.findByIdAndUpdate({ _id: postId }, { isDeleted: true });
//     res.status(200).json({ message: "post deleted" });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "post deletion failed" });
//   }
// };

// export const edit_post = async (req: Request, res: Response) => {
//   try {
//     const { postId, newCaption } = req.body;
//     await Post.findByIdAndUpdate(
//       { _id: postId },
//       { $set: { caption: newCaption } }
//     );
//     res.status(200).json({ message: "caption updated" });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "caption not updated" });
//   }
// };

// export const report_post = async (req: Request, res: Response) => {
//   try {
//     const { postId, reportReason } = req.body;
//     const reporterId = req.userId;
//     const newreport = new Report({
//       category: "post",
//       reporter_id: reporterId,
//       post_id: postId,
//       report_reason: reportReason,
//     });
//     newreport.save();
//     res.status(200).json({ message: "report submitted" });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "report failed" });
//   }
// };


// export const savePost=async(req:Request,res:Response)=>{
//   try {
//     const userId=req.userId
//     const {postId}=req.body
//     const newsavedpost= new Saved({
//       post_id:postId,
//       user_id:userId
//     })
//     await newsavedpost.save()
//     res.status(200).json({message:'post saved successfully'})
//   } catch (error) {
//     console.log(error)
//     res.status(400).json({message:'post saving failed'})
//   }
// }

// export const unsavePost=async(req:Request,res:Response)=>{
//   try{
//     const userId=req.userId
//     const {postId}=req.body
//     await Saved.deleteOne({user_id:userId,post_id:postId})
//     res.status(200).json({message:'post unsaved successfully'})
//   }catch(error){
//     console.log(error)
//     res.status(400).json({message:'post unsaving failed'})
//   }
// }

// export const checkSaved=async(req:Request,res:Response)=>{
//   try{
//     const userId=req.userId
//     const {postId}=req.body
//    const isSaved= await Saved.findOne({user_id:userId,post_id:postId})
//     if (isSaved) {
//       res.status(200).json({message:'post saved checking successfull',saved:true})

//     }else{
//       res.status(200).json({message:'post saved checking successfull',saved:false})

//     }
//   }catch(error){
//     console.log(error)
//     res.status(400).json({message:'post saved checking failed'})
//   }
// }

// export const get_saved_posts=async(req:Request,res:Response)=>{
//   try {
//     const userId=req.userId?.toString()

//     const userIdObject = new mongoose.Types.ObjectId(userId);

//     const savedpostids=await Saved.aggregate([
//       {
//         $match:{user_id:userIdObject}
//       },
//       {
//         $group:{
//           _id:null,
//            postIds:{$push:"$post_id"}
//         }
//       },
//       {
//         $project:{
//           postIds:1
//         }
//       }
//     ])
//        if(savedpostids[0]){
//     const allsavedposts = await Post.aggregate([
//       {
//         $match: { isDeleted: false, isHide: false, _id:{$in:[...savedpostids[0].postIds]} },
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user_id",
//           foreignField: "_id",
//           as: "user",
//         },
//       },
//       {
//         $unwind: "$user",
//       },

//       {
//         $project: {
//           _id: 1,
//           post_image: 1,
//           likes: 1,
//           caption: 1,
//           "user.name": 1,
//           "user._id": 1,
//           "user.photo": 1,
//           createdAt: 1,
//         },
//       },
//       {
//         $sort: { createdAt: -1 },
//       },
//     ]);
//     res.status(200).json(allsavedposts)
//   }
//   res.status(200)
//   } catch (error) {
//     console.log(error)
//     res.status(400).json({message:'fetching saved posts failed'})
//   }
// }
