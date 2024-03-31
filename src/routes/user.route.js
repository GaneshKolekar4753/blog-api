const express = require("express");
const { body } = require("express-validator");
const Usercontroller = require("../controller/user.controller.js");
const auth = require("../middleware/auth");

const router = express.Router();

//create object of controller class
const userController = new Usercontroller();

//user regidster route
router.post(
  "/create",
  [
    body("username","username length should be more than 4 ").isLength({ min: 4 }),
    body("password","please enter string password of <5 length").isLength({ min: 5 }),
  ],
  userController.register
);
//user login route
router.post("/login", userController.login);
//get all users
router.get("/users", auth, userController.getUsers);
//get own profile
router.get("/", auth, userController.getOwnProfile);

module.exports = router;
