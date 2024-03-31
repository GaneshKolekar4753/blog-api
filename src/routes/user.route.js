const express=require('express')

const Usercontroller=require( '../controller/user.controller.js')
const auth=require('../middleware/auth');

const router=express.Router();

//create object of controller class
const userController=new Usercontroller();

//user regidster route
router.post('/create',userController.register);
//user login route
router.post('/login',userController.login);
//get all users
router.get('/',auth,userController.getUsers);

module.exports= router;