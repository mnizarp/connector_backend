"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const commentControllers_1 = require("../controllers/userControllers/commentControllers");
const commentRouter = express_1.default.Router();
commentRouter.post('/addComment', authMiddleware_1.protect, commentControllers_1.add_comment);
commentRouter.patch('/editComment', authMiddleware_1.protect, commentControllers_1.edit_comment);
commentRouter.get('/getComments/:postId', authMiddleware_1.protect, commentControllers_1.get_comments);
commentRouter.get('/getCommentsCount/:postId', authMiddleware_1.protect, commentControllers_1.get_comments_count);
exports.default = commentRouter;
