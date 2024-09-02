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
exports.edit_comment = exports.get_comments = exports.get_comments_count = exports.add_comment = void 0;
const commentModel_1 = require("../../models/commentModel");
const mongoose_1 = __importDefault(require("mongoose"));
const add_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { postId, comment } = req.body;
        yield commentModel_1.Comment.create({
            userId, postId, comment
        });
        res.status(200).json({ status: 'success', message: "comment added successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "comment not added" });
    }
});
exports.add_comment = add_comment;
const get_comments_count = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const comments = yield commentModel_1.Comment.find({ postId });
        res.status(200).json({ status: 'success', message: 'Comments count fetched', commentsCount: comments.length });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Comments count fetching failed' });
    }
});
exports.get_comments_count = get_comments_count;
const get_comments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const postIdObject = new mongoose_1.default.Types.ObjectId(postId);
        const allcomments = yield commentModel_1.Comment.aggregate([
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
        res.status(200).json({ status: 'success', message: 'comments fetched', allcomments });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ message: "failed fetching all comments" });
    }
});
exports.get_comments = get_comments;
const edit_comment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { editedComment, commentId } = req.body;
        yield commentModel_1.Comment.findByIdAndUpdate(commentId, {
            $set: { comment: editedComment },
        });
        res.status(200).json({ status: 'success', message: "comment edited" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: "comment editing failed" });
    }
});
exports.edit_comment = edit_comment;
