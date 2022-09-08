const express = require ('express');
var router = express.Router();
var objId = require('mongoose').Types.ObjectId;
var {Comments} = require('../model/comments');

router.get('',(req,res)=>{
Comments.find((err,docs)=>{
    if(!err){
        res.send(docs);
        
    }
    else{
        console.log("Errorin getting data :" + JSON.stringify(err,undefined,2));
    }
}).sort({date : 'desc'})
})

router.post('',(req,res)=>{
    var comment = new Comments ({
        blogid : req.body.blogid,
        name: req.body.name,
        email: req.body.email,
        contactno:req.body.contactno,
        message : req.body.message,
        date:req.body.date,
        status : req.body.status
    });
    comment.save((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log("Error in posting data:" + JSON.stringify(err,undefined,2));
        }
    })
})

router.put(
    "/:id",
   
    (req, res, next) => {
    
      const comment = {
        _id: req.body.id,
        blogid: req.body.blogid,
        name: req.body.name,
        email: req.body.email,
        contactno: req.body.contactno,
        message : req.body.message,
        date : req.body.date,
        status : req.body.status
      };
     
      console.log(req.params.id);
    Comments.findByIdAndUpdate(req.params.id, {$set:comment}, {new:true}, (err,doc)=>{
        if(!err){
            res.send(doc)
        }
        else{
            console.log('error is updating data:' + JSON.stringify(err,undefined,2));
        }
    })
    }
  );


router.delete('/:id', (req,res)=>{
    Comments.findByIdAndRemove(req.params.id, (err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('error in deleting banner:' + JSON.stringify(err,undefined,2));
        }
    })
})
module.exports = router;