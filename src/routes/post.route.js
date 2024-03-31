const express=require('express')

const PostController=require( '../controller/post.controller.js')
const auth=require('../middleware/auth');

const router=express.Router();

//create object of controller class
const postController=new PostController();
// get all posts
router.get('/', postController.getAllPosts);
//get post by tag
router.get('/tags', postController.getPostbyTag);
//get post by any value
router.get('/search',postController.getPostbyVlaue);
//add post
router.post('/create', postController.createPost);
//delet post
router.delete('/:id', postController.removePost);
//update post
router.put('/:postId', postController.updatePost);

module.exports= router;