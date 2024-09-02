"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const postControllers_1 = require("../controllers/userControllers/postControllers");
const postRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
postRouter.post('/addPost', authMiddleware_1.protect, upload.single('image'), postControllers_1.create_post);
postRouter.get('/getFeedPosts', authMiddleware_1.protect, postControllers_1.getFeedPosts);
postRouter.get('/getProfilePosts', authMiddleware_1.protect, postControllers_1.getProfilePosts);
// postRouter.get('/getposts',protect,get_posts)
postRouter.patch('/likeUnlike', authMiddleware_1.protect, postControllers_1.like_unlike);
// postRouter.patch('/deletepost',protect,delete_post)
// postRouter.patch('/editpost',protect,edit_post)
// postRouter.post('/reportpost',protect,report_post)
// postRouter.post('/savepost',protect,savePost)
// postRouter.post('/unsavepost',protect,unsavePost)
// postRouter.post('/checksaved',protect,checkSaved)
// postRouter.get('/getsavedposts',protect,get_saved_posts)
exports.default = postRouter;
