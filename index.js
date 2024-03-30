import express from 'express';

const port=8000;


const app=express();

app.use('/',(req,res)=>{
    res.send("welcome in app")
})

app.listen(port,(err)=>{
    if(err){
        console.log("Issue in launching server:",err)
    }
    console.log("server is up on port:"+port)
});
