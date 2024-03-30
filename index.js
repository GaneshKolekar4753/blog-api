import express from 'express';
import route from "./src/routes/index.route.js"
const port=8000;


const app=express();

app.use('/api',route);
// app.use('/',(req,res)=>{
//     res.send("welcome to app")
// });
app.listen(port,(err)=>{
    if(err){
        console.log("Issue in launching server:",err)
    }
    console.log("server is up on port:"+port)
});
