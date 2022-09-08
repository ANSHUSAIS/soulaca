const express = require ('express');
var router = express.Router();
var {Video} = require('../model/video');

var docId = require('mongoose').Types.ObjectId ;
router.get('/' ,  (req,res)=>{
    Video.find((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error in retriving data:' + JSON.stringify(err,undefined,2));
        }
    })
})

router.post('/', (req,res)=>{
    var content = new Video ({
        videoLink : req.body.videoLink
       
    })
    content.save((err,doc)=>{
        if(!err){
            res.send(doc);
        }
        else{
            console.log('error in data send :' + JSON.stringify(err,undefined,2));
        }
    })
})

router.get('/:id', (req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
    }
    else{
        Video.findById(req.params.id, (err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log('No records found with id:' + JSON.stringify(err,undefined,2));
            }
        })
    }
})

router.put('/:id', (req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        var content = {
            videoLink : req.body.videoLink,
        }
        Video.findByIdAndUpdate(req.params.id, {$set:content}, {new:true}, (err,doc)=>{
            if(!err){
                res.send(doc)
            }
            else{
                console.log('error is updating data:' + JSON.stringify(err,undefined,2));
            }
        })
    }
})

router.delete('/:id', (req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        Video.findByIdAndRemove(req.params.id, (err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log('error in deleting data :' + JSON.stringify(err, undefined,2) );
            }
        })
    }
})
module.exports = router