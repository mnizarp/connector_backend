"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.like_unlike = exports.getProfilePosts = exports.getFeedPosts = exports.create_post = void 0;
const postModel_1 = require("../../models/postModel");
// import { Report } from "../../models/reportModel";
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
// import { Notification } from "../../models/notificationModel";
// import { Saved } from "../../models/savedModel";
const create_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req === null || req === void 0 ? void 0 : req.userId;
        if (!req.file || !req.body.caption) {
            return res
                .status(401)
                .json({ message: "Post Image and caption required" });
        }
        cloudinary_1.default.uploader
            .upload_stream({
            upload_preset: "linguaBlend",
        }, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (error) {
                return res.status(502).json({ message: "Upload failed", error });
            }
            const url = result === null || result === void 0 ? void 0 : result.secure_url;
            try {
                yield postModel_1.Post.create({
                    userId,
                    caption: (_a = req.body) === null || _a === void 0 ? void 0 : _a.caption,
                    postImage: url,
                });
                res
                    .status(200)
                    .json({ status: "success", message: "post added successfully" });
            }
            catch (error) {
                console.error("Database update failed:", error);
                res.status(500).json({ message: "Post not added", error });
            }
        }))
            .end(req.file.buffer);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "post adding failed" });
    }
});
exports.create_post = create_post;
const getFeedPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = '';
        if (req.userId && typeof req.userId === 'string') {
            userId = req.userId;
        }
        const feedPosts = yield postModel_1.Post.aggregate([
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
    }
    catch (error) {
        res.status(400).json({ message: "Fetching failed" });
    }
});
exports.getFeedPosts = getFeedPosts;
const getProfilePosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profileId = req.headers['x-profile-id'];
        const profilePosts = yield postModel_1.Post.find({ userId: profileId, isDeleted: false, isHide: false }).sort({ createdAt: -1 });
        res.status(200).json({ status: "success", message: 'Profile posts fetched successfully', profilePosts });
    }
    catch (error) {
        res.status(400).json({ message: "Profile post fetching failed" });
    }
});
exports.getProfilePosts = getProfilePosts;
const like_unlike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.body;
        const user = req.userId;
        const post = yield postModel_1.Post.findOne({ _id: postId });
        const isAlreadyLiked = yield postModel_1.Post.find({
            _id: postId,
            likes: { $in: [user] },
        });
        if (isAlreadyLiked.length > 0) {
            yield postModel_1.Post.updateOne({ _id: postId }, { $pull: { likes: user } });
            // await Notification.deleteOne({
            //   user_id: post?.user_id,
            //   sender_id: user,
            //   type: "Like",
            // });
            // res.status(200).json({ liked: false, message: "unliked the post" });
            res.status(200).json({ message: "Unliked the post" });
        }
        else {
            yield postModel_1.Post.updateOne({ _id: postId }, { $addToSet: { likes: user } });
            // let newnotification;
            // if(post?.user_id.toString() !== user ){
            //  newnotification = new Notification({
            //   user_id: post?.user_id,
            //   sender_id: user,
            //   type: "Like",
            //   unread: true,
            // });
            // await newnotification.save();
            res.status(200).json({ message: 'Liked' });
        }
        // res.status(200).json({ liked: true, newnotification });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: 'like failed' });
    }
});
exports.like_unlike = like_unlike;
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
