const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../models/index");
const secretKey = "GaneshSecret";

class Usercontroller {
  //register user
  async register(req, res) {
    const { username, password, role } = req.body;
    try {
      let user = await db.User.findOne({
        where: {
          username: username,
        },
      });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      //generate salt
      const salt = await bcrypt.genSalt(10);
      //generate hashcode
      const hashcode = await bcrypt.hash(password, salt);
      const newuser = await db.User.create({
        username: username,
        password: hashcode,
        role: role,
      });

      if (newuser) {
        console.log("newuser created successfully");
        res.status(200).send({ data: newuser });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }

  //login user
  async login(req, res) {
    const { username, password } = req.body;
    try {
      let user = await db.User.findOne({
        where: {
          username: username,
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User does not exist" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: "Invalid login" }] });
      }
      //user is valid
      const payload = {
        username: username,
        role: user.role,
      };

      jwt.sign(
        payload,
        secretKey,
        (err, token) => {
          if (err) {
            throw err;
          }
          res.status(200).json({
            success: true,
            token: token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }

  async getUsers (req, res) {
    try {
        const users = await db.User.findAll()
        res.status(201).json({ "status": "ok", "message": "Get User", users })
    } catch (error) {
        return res.status(401).json({ "status": "error", "message": error })
    }
}
}

module.exports = Usercontroller;
