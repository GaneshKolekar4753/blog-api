const express=require('express')

const Tagcontroller=require( '../controller/tag.controller.js')


const router=express.Router();

//create object of controller class
const tagController=new Tagcontroller();

//add tag from post
router.post('/:postId/tags/:tagName',tagController.addTag);
//update tag from post
router.put('/:postId/tags/:tagId',tagController.updateTag);
//delet tag from post
router.delete('/:postId/tags/:tagId',tagController.deleteTag);
//get tags from post
router.get('/:postId',tagController.getTags);

module.exports= router;