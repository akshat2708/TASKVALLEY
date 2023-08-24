
const mongodb=require('mongodb');
const path=require('path');
const express=require('express');
const cookie=require('cookie-parser');
const mongoose=require('mongoose');
const {ejs} = require('ejs');
const cookieParser = require('cookie-parser');
const jwt=require('jsonwebtoken');
const app=express();

mongoose.connect("mongodb://127.0.0.1:27017",{dbName:"taskvalley"})
.then(()=>console.log("database connected"))
.catch(()=>console.log("error"));

app.use(express.static(path.join(path.resolve(),"public")));
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.set("view engine","ejs");
const isauth=(req,res,next)=>{
    const{token}=req.cookies;
    if(token){
        const decode=jwt.verify(token,"asdfghdyyttjytjuriuru7jiry");
        console.log(decode);
        next();
    }
    else{
        return res.redirect("login.html");
    }
}

const user=[];
const sc=new mongoose.Schema({
    name:String,
    email:String,
    phno:String,
    password:String


})
const cont=mongoose.model("task",sc);

app.get("/",isauth,(req,res)=>{
     res.render("logout");
})


app.get("/parser",(req,res)=>{
    const {token}=req.cookies;
    if(token){
        res.redirect("/logout");
    }
    else{
        res.redirect("/");
    }

     
});

app.post("/logout",(req,res)=>{
    res.cookie(null,null ,{httpOnly:true,expires:new Date(Date.now()) });
    res.redirect("/")
    
});
app.post("/logins",async(req,res)=>{
    const{name,email}=req.body;

   
    let us=await cont.findOne({email})
    if(!us){
        return res.redirect("reg.html")
     }
    const ismatch=await cont.findOne({name})
    
    if(!ismatch)return res.redirect("login.html");
    const user= await cont.create({name,email});
    const token=jwt.sign({_id:user._id},"asdfghdyyttjytjuriuru7jiry");
    const decode=jwt.verify(token,"asdfghdyyttjytjuriuru7jiry");
  
    
    res.cookie(name,token,{httpOnly:true,expires:new Date(Date.now()+60*1000) });
   
    res.render("logout",{name:req.body.name}) 
    
});

app.post("/reg",async(req,res)=>{
    const{name,email,phno,password}=req.body;
    const reguser= await cont.create({name,email,phno,password});
    const token=jwt.sign({_id:user._id},"asdfghdyyttjytjuriuru7jiry");
     const decode=jwt.verify(token,"asdfghdyyttjytjuriuru7jiry");
    
    res.cookie(name,token,{httpOnly:true,expires:new Date(Date.now()+60*1000) });
   res.render("sub",{temp:req.body.name});



})

app.listen(5000,()=>{
    console.log("on live");
})