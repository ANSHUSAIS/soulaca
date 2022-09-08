const express = require ('express');
var router = express.Router();
var {Content} = require('../model/content');
var {Promotion} = require('../model/promotion');
var docId = require('mongoose').Types.ObjectId ;
router.get('/' ,  (req,res)=>{
    Content.find((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error in retriving data:' + JSON.stringify(err,undefined,2));
        }
    })
    .populate({
        path: 'promotiontype',
        model: Promotion
   })
})

router.post('/', (req,res)=>{
    var content = new Content ({
        promotiontype : req.body.promotion,
        content : req.body.content
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
        Content.findById(req.params.id, (err,doc)=>{
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
        var contents = {
            promotiontype : req.body.promotion,
            content : req.body.content
        }
        Content.findByIdAndUpdate(req.params.id, {$set:contents}, {new:true}, (err,doc)=>{
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
        Content.findByIdAndRemove(req.params.id, (err,doc)=>{
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