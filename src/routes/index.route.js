import express from 'express'
import userRoute from './user.route.js';
// import blogRoute from './blog.route.js';
// import commentRoute from './comment.route.js'
const router=express.Router();

router.use('/user',userRoute);
// router.use('/blog',blogRoute);
// router.use('/comment',commentRoute);

export default router;