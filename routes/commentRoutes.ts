import express from 'express'
import { protect } from '../middlewares/authMiddleware'
import { add_comment, edit_comment, get_comments, get_comments_count } from '../controllers/userControllers/commentControllers'

const commentRouter=express.Router()

commentRouter.post('/addComment',protect,add_comment)
commentRouter.patch('/editComment',protect,edit_comment)
commentRouter.get('/getComments/:postId',protect,get_comments)
commentRouter.get('/getCommentsCount/:postId',protect,get_comments_count)

export default commentRouter