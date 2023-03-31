const express = require ('express');
var router = express.Router();
const {Profile} = require('../model/profile');
var objId =  require('mongoose').Types.ObjectId;


router.get('/',(req,res)=>{
    Profile.find((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error in getting team members:' +JSON.stringify(err,undefined,2));
        }
    })
})

router.post('/',(req,res)=>{
    var profile = new Profile({ 
        profile : req.body.profile
    })
    profile.save((err,docs)=>{
        if(!err){
        res.send(docs);
        }
        else{
            console.log('error is member post:' + JSON.stringify(err, undefined,2))
        }
    })
})

router.get('/:id',(req,res)=>{
    if(!objId.isValid(req.params.id)){
        res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
    }
    else{
        Profile.findById(req.params.id,(err,docs)=>{
            if(!err){
                res.send(docs);
            }
            else{
                console.log('cannot find member:' + JSON.stringify(err,undefined,2));
            }
        })
    }
})

router.put('/update/:id',(req,res)=>{
    if(!objId.isValid(req.params.id)){
        res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
    }
    let profile ={ 
        profile : req.body.profile
    }
    Profile.findByIdAndUpdate(req.params.id, {$set:profile}, {new:true,useFindAndModify: false}, (err,doc)=>{
        if(!err){
            res.send(doc)
        }
        else{
            console.log('error is updating data:' + JSON.stringify(err,undefined,2));
        }
    })
})

router.delete('/delete/:id',(req,res)=>{
    Profile.findByIdAndRemove(req.params.id, (err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('error in deleting member:' + JSON.stringify(err,undefined,2));
        }
    })
})

module.exports = router;