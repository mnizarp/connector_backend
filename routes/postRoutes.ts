import express from 'express'
import multer from 'multer'
import { protect } from '../middlewares/authMiddleware'
import {  create_post, getFeedPosts, getProfilePosts, like_unlike } from '../controllers/userControllers/postControllers'
const postRouter=express.Router()

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

postRouter.post('/addPost',protect,upload.single('image'),create_post)
postRouter.get('/getFeedPosts',protect,getFeedPosts)
postRouter.get('/getProfilePosts',protect,getProfilePosts)
// postRouter.get('/getposts',protect,get_posts)
postRouter.patch('/likeUnlike',protect,like_unlike)
// postRouter.patch('/deletepost',protect,delete_post)
// postRouter.patch('/editpost',protect,edit_post)
// postRouter.post('/reportpost',protect,report_post)
// postRouter.post('/savepost',protect,savePost)
// postRouter.post('/unsavepost',protect,unsavePost)
// postRouter.post('/checksaved',protect,checkSaved)
// postRouter.get('/getsavedposts',protect,get_saved_posts)

export default postRouter