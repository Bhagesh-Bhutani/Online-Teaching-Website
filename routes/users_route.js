const express=require('express');
const router=express.Router();
const Users=require('../models/users')

router.post('/',async (req,res)=>{
    console.log(req.body)
    let user=await Users.findOne({name:req.body.name});
    if(user===null){
        let newuser=new Users({
            name : req.body.name,
            class : req.body.class,
            total_time : req.body.total_time
        })

        try {
            let saved_user=await newuser.save();
            res.send("New user added");
        } catch(e){
            console.log(e);
        }
    } else {
        try {
            let updated_time=parseInt(user.total_time)+parseInt(req.body.total_time);
            updated_time=updated_time.toString();
            let up_user=await Users.updateOne({name:user.name},{total_time : updated_time});
            console.log(up_user);
            res.send("Updated user");
        } catch(e){
            console.log(e);
        }
    }
})

module.exports=router;