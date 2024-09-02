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
exports.followUnfollow = exports.get_profile_details = void 0;
const userModel_1 = require("../../models/userModel");
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel_1 = require("../../models/chatModel");
const get_profile_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let profileId = "";
        if (req.headers["x-profile-id"] &&
            typeof req.headers["x-profile-id"] === "string") {
            profileId = req.headers["x-profile-id"];
        }
        const profileDetails = yield userModel_1.User.aggregate([
            {
                $match: { _id: new mongoose_1.default.Types.ObjectId(profileId) },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following",
                    foreignField: "_id",
                    as: "followingList",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followers",
                    foreignField: "_id",
                    as: "followersList",
                },
            },
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country",
                },
            },
            {
                $unwind: "$country",
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    photo: 1,
                    followersList: 1,
                    followingList: 1,
                    followersCount: { $size: "$followers" },
                    followingsCount: { $size: "$following" },
                    "country.country": 1,
                    "country.flag": 1,
                },
            },
        ]);
        res
            .status(200)
            .json({
            status: "success",
            message: "Profile details fetched successfully",
            profileDetails: profileDetails[0],
        });
    }
    catch (error) {
        res.status(400).json({ message: "Profile details fetching failed" });
    }
});
exports.get_profile_details = get_profile_details;
const followUnfollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profileId } = req.body;
        const userId = req.userId;
        const isAlreadyFollowing = yield userModel_1.User.find({
            _id: userId,
            following: { $in: [profileId] },
        });
        const isFollowingBack = yield userModel_1.User.find({
            _id: userId,
            followers: { $in: [profileId] },
        });
        if (isAlreadyFollowing.length > 0) {
            yield userModel_1.User.updateOne({ _id: userId }, { $pull: { following: profileId } });
            yield userModel_1.User.updateOne({ _id: profileId }, { $pull: { followers: userId } });
            // await Notification.deleteOne({
            //   user_id: profileId,
            //   sender_id: userId,
            //   type: "Follow",
            // });
            // res.status(200).json({ following: false, message: "unfollow updated" });
            res
                .status(200)
                .json({ status: "success", message: "UnFollow successfull" });
        }
        else {
            yield userModel_1.User.updateOne({ _id: userId }, { $addToSet: { following: profileId } });
            yield userModel_1.User.updateOne({ _id: profileId }, { $addToSet: { followers: userId } });
            // const newnotification = new Notification({
            //   user_id: profileId,
            //   sender_id: userId,
            //   type: "Follow",
            //   unread: true,
            // });
            // await newnotification.save();
            if (isFollowingBack.length > 0) {
                const chat = yield chatModel_1.Chat.findOne({
                    $and: [
                        { users: { $elemMatch: { $eq: userId } } },
                        { users: { $elemMatch: { $eq: profileId } } },
                    ],
                });
                if (!chat) {
                    const newchat = new chatModel_1.Chat({
                        users: [userId, profileId],
                    });
                    newchat.save();
                }
            }
            // res.status(200).json({ following: true, newnotification });
            res
                .status(200)
                .json({ status: "success", message: "follow successfull" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "follow unfollow failed" });
    }
});
exports.followUnfollow = followUnfollow;
// export const edit_profile = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId;
//     const { photo,name, email, country, language, password } = req.body;
//     const uploadResponse = await cloudinary.uploader.upload(photo, {
//       upload_preset: "linguaBlend",
//     });
//     if (photo) {
//       await User.updateOne({ _id: userId }, { $set: { photo:uploadResponse } });
//     }
//     if (name) {
//       await User.updateOne({ _id: userId }, { $set: { name } });
//     }
//     if (email) {
//       await User.updateOne({ _id: userId }, { $set: { email } });
//     }
//     if (language) {
//       await User.updateOne({ _id: userId }, { $set: { language } });
//     }
//     if (country) {
//       await User.updateOne({ _id: userId }, { $set: { country } });
//     }
//     if (password) {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(password, salt);
//       await User.updateOne(
//         { _id: userId },
//         { $set: { password: hashedPassword } }
//       );
//     }
//     const updatedInfo = await User.findById(
//       { _id: userId },
//       { _id: 1, name: 1, email: 1, photo: 1, isProfileFinished: 1 }
//     );
//     res.status(200).json({ updatedInfo, message: "edited profile" });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "edit profile failed" });
//   }
// };
// export const report_user = async (req: Request, res: Response) => {
//   try {
//     const { userId, reportReason } = req.body;
//     const reporterId = req.userId;
//     const newreport = new Report({
//       category: "user",
//       reporter_id: reporterId,
//       user_id: userId,
//       report_reason: reportReason,
//     });
//     newreport.save();
//     res.status(200).json({ message: "report submitted" });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "report failed" });
//   }
// };
// export const get_user_block_status = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId;
//     const blockstatus = await User.findById(userId, { isBlocked: 1 });
//     res.status(200).json({ blockStatus: blockstatus?.isBlocked });
//   } catch (error) {
//     console.log("fetching failed");
//     res.status(400).json({ message: "fetching user block status failed" });
//   }
// };
// export const get_followings = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId;
//     const allfollowings = await User.findById(userId, {
//       following: 1,
//     }).populate("following");
//     res.status(200).json(allfollowings?.following);
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "followings fetching failed" });
//   }
// };
// export const searchUsers = async (req: Request, res: Response) => {
//   try {
//     const searchInput = req.query.search;
//     const regex = new RegExp(searchInput as string, "i");
//     const users = await User.find({
//       name: { $regex: regex },
//       isAdmin: false,
//       isProfileFinished: true,
//       isBlocked: false,
//       _id: { $ne: req.userId },
//     });
//     res.status(200).send(users);
//   } catch (error) {
//     console.log(error);
//     res.status(400);
//   }
// };
// export const getSuggestions = async (req: Request, res: Response) => {
//   try {
//     const userId = req.userId;
//     const allsuggestions = await User.find({
//       _id: { $ne: req.userId },
//       isAdmin: false,
//       isBlocked: false,
//       isVerified: true,
//       followers: { $nin: [userId] },
//     }).populate("language_id");
//     res.status(200).json({ allsuggestions });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ message: "suggestions fetching failed" });
//   }
// };
