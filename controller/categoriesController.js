const express = require('express');
var router = express.Router();
var objId =  require('mongoose').Types.ObjectId;
var {Category} = require ('../model/categories');

router.get('/', (req,res)=>{
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage
    var query = {}
    if(pageSize && currentPage){
        query.skip = pageSize * (currentPage - 1)
        query.limit = pageSize
        Category.find({},{},query, function(err,data) {
            if(!err){
                res.send(data)
            }
            else{
                console.log("Error:" + JSON.stringify(err,undefined,2));
            }
        })
    }
    else{
    Category.find((err,doc)=>{
        if(!err){
            res.send(doc)
        }
        else{
            console.log('Error in getting categories:' + JSON.stringify(err,undefined,2));
        }
    })
}
})

router.post('/', (req,res)=>{
    var content = new Category ({
        categoryname : req.body.categoryname
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
    if(!objId.isValid(req.params.id)){
        res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
    }
    else{
        Category.findById(req.params.id, (err,doc)=>{
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
    if(!objId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        var content = {
            categoryname : req.body.categoryname
        }
        Category.findByIdAndUpdate(req.params.id, {$set:content}, {new:true, useFindAndModify: false}, (err,doc)=>{
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
    if(!objId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        Category.findByIdAndRemove(req.params.id, (err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log('error in deleting data :' + JSON.stringify(err, undefined,2) );
            }
        })
    }
})

module.exports = router;