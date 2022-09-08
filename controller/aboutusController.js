const express = require ('express');
var router = express.Router();
var {Aboutus} = require('../model/aboutus');

var docId = require('mongoose').Types.ObjectId ;
router.get('/' ,  (req,res)=>{
    Aboutus.find((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error in retriving data:' + JSON.stringify(err,undefined,2));
        }
    }).sort({title: 'desc'})
})

router.post('/', (req,res)=>{
    var content = new Aboutus ({
        title : req.body.title,
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
        Aboutus.findById(req.params.id, (err,doc)=>{
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
            title : req.body.title,
            content : req.body.content
        }
        Aboutus.findByIdAndUpdate(req.params.id, {$set:content}, {new:true}, (err,doc)=>{
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
        Aboutus.findByIdAndRemove(req.params.id, (err,doc)=>{
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