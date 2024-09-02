import express from 'express'
import { protect } from '../middlewares/authMiddleware'
import { followUnfollow, get_profile_details } from '../controllers/userControllers/userControllers'

const userRouter=express.Router()

userRouter.get('/getProfileDetails',protect,get_profile_details) 
userRouter.patch('/followUnfollow',protect,followUnfollow)
// userRouter.patch('/editprofile',protect,edit_profile)
// userRouter.post('/reportuser',protect,report_user)
// userRouter.get('/getuserblockstatus',protect,get_user_block_status)
// userRouter.get('/searchusers',protect,searchUsers)
// userRouter.get('/getallfollowings',protect,get_followings)
// userRouter.get('/getsuggestions',protect,getSuggestions)


export default userRouter