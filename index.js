const express= require("express");
const mongoose= require("mongoose");
const bodyParser= require("body-parser");
const dotenv=require("dotenv");
 
const app= express();
dotenv.config();

const port= process.env.PORT || 3000;

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log(err);
})

//Registration Schema
const registrationSchema = new mongoose.Schema({
    Name : String,
    email: String,
    password: String

});

//Model for registration Schema
const Registration = mongoose.model("Registration", registrationSchema);
//ek fxn hota hai jo Schema hota hai uska model bana deta hai,jisme data add kr skte hai
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})

app.post("/register", async(req,res)=>{
    try{
        const{name,email,password}=req.body;  

        const existingUser = await Registration.findOne({email: email});
        if(!existingUser){
        const registrationData = new Registration({
            name,
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    }
    else{      
        res.redirect("/error");
    }
}
    catch(error){
        console.log(error);
        res.redirect("/error");
    }

})
app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})
app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})

app.listen(port,()=>{
    console.log(`runing on port ${port}`);
})