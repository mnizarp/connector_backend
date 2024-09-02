import { Request, Response } from "express";
import { Comment } from "../../models/commentModel";
import mongoose from "mongoose";

export const add_comment = async (req: Request, res: Response) => {
  try {
    const userId=req.userId
    const { postId, comment } = req.body;
    await Comment.create({
        userId,postId,comment
    })
    res.status(200).json({ status:'success', message: "comment added successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "comment not added" });
  }
};

export const get_comments_count=async(req:Request,res:Response)=>{
  try{
    const {postId}=req.params
    const comments=await Comment.find({postId})
    res.status(200).json({status:'success',message:'Comments count fetched',commentsCount:comments.length})
  }catch(error){
    console.log(error)
    res.status(400).json({message:'Comments count fetching failed'})
  }
}

export const get_comments = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const postIdObject = new mongoose.Types.ObjectId(postId);
    const allcomments = await Comment.aggregate([
      {
        $match: { postId: postIdObject },
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
          comment: 1,
          createdAt: 1,
          "user.name": 1,
          "user._id": 1,
          "user.photo": 1,
        },
      },

      {
        $sort: { createdAt: -1 },
      },
    ]);
    res.status(200).json({status:'success',message:'comments fetched', allcomments });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "failed fetching all comments" });
  }
};

export const edit_comment = async (req: Request, res: Response) => {
  try {
    const { editedComment, commentId } = req.body;
    await Comment.findByIdAndUpdate(commentId, {
      $set: { comment: editedComment },
    });
    res.status(200).json({status:'success', message: "comment edited" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "comment editing failed" });
  }
};

