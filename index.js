const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const db = require("./src/models");
const route=require("./src/routes/index.route")
const port=8000;




const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//routes
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
