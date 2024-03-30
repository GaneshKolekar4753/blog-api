import express from 'express'

import Usercontroller from '../controller/user.controller.js'
const router=express.Router();

//create object of controller class
const userController=new Usercontroller();

//user regidster route
router.get('/create',userController.register);
//user login route
router.get('/login',userController.login);

export default router;