const express =require("express");

const userRoute =require('./user.route.js');
// const postRoute =require("./post.route.js");
// const tagRoute =require("./tag.route.js");

const router=express.Router();

router.use('/user',userRoute);
// router.use('/blog',postRoute);
// router.use('/comment',tagRoute);

module.exports= router;