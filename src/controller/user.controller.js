class Usercontroller {
    //register user 
    async register(req, res) {
      try {
        res.status(200).send("user registered");
      } catch (error) {
        res.status(400).send("Invalid Data");
      }
    }
  
    //login user
    async login(req, res) {
        try {
          res.status(200).send("user loggedin");
        } catch (error) {
          res.status(400).send("Invalid Data");
        }
      }
  
  }
  
module.exports= Usercontroller;