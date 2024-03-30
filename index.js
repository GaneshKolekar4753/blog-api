const express = require("express");
const cors = require("cors");

const db = require("./src/models");
const route=require("./src/routes/index.route")
const port=8000;


const app=express();

app.use('/api',route);
app.get('/',(req,res)=>{
    res.send("welcome to app")
});

db.sequelize.sync().then(() => {
app.listen(port,(err)=>{
    if(err){
        console.log("Issue in launching server:",err)
    }
    console.log("server is up on port:"+port)
});
});
