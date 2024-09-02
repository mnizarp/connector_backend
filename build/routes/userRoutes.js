"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userControllers_1 = require("../controllers/userControllers/userControllers");
const userRouter = express_1.default.Router();
userRouter.get('/getProfileDetails', authMiddleware_1.protect, userControllers_1.get_profile_details);
userRouter.patch('/followUnfollow', authMiddleware_1.protect, userControllers_1.followUnfollow);
// userRouter.patch('/editprofile',protect,edit_profile)
// userRouter.post('/reportuser',protect,report_user)
// userRouter.get('/getuserblockstatus',protect,get_user_block_status)
// userRouter.get('/searchusers',protect,searchUsers)
// userRouter.get('/getallfollowings',protect,get_followings)
// userRouter.get('/getsuggestions',protect,getSuggestions)
exports.default = userRouter;
