const express = require('express');
const { Category } = require('../model/categories');
var router = express.Router();
var objId =  require('mongoose').Types.ObjectId;
var {Subcategory} = require ('../model/subcategory');

router.get('/', async (req, res, next)=>{
    try{
        const pageSize = +req.query.pageSize;
        const currentPage = +req.query.currentPage;
        let subcategories = [];
        var query = {};
    
        if(pageSize && currentPage){
            query.limit = pageSize;
            query.skip = pageSize * (currentPage - 1);
    
            subcategories  = await Subcategory.find({}, {}, query).sort({_id: 'desc'});
        }else{
            subcategories = await Subcategory.find({}).sort({_id: 'desc'});
        }
        res.json(subcategories);
    }catch(err){
        res.json(err.message);
    }
});

router.get('/:id', (req,res)=>{
    if(!objId.isValid(req.params.id)){
        res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
    }
    else{
        Subcategory.findById(req.params.id, (err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log('No records found with id:' + JSON.stringify(err,undefined,2));
            }
        })
    }
})

router.get('/byCategory/:id', (req,res)=>{
    if(!objId.isValid(req.params.id)){
        res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
    }
    else{
        Subcategory.find({category : req.params.id}, (err,doc)=>{
            if(!err){
                res.send(doc);
            }
            else{
                console.log('No records found with id:' + JSON.stringify(err,undefined,2));
            }
        })
    }
})

router.post('/', (req,res)=>{
    var content = new Subcategory ({
        subcategoryname : req.body.subcategoryname,
        category : req.body.category,
        categoryname : req.body.categoryname,
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


router.put('/:id', (req,res)=>{
    if(!objId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        var content = {
            subcategoryname : req.body.subcategoryname,
            category : req.body.category,
            categoryname : req.body.categoryname,
        };

        Subcategory.findByIdAndUpdate(req.params.id, {$set:content}, {new:true, useFindAndModify: false}, (err,doc)=>{
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
        Subcategory.findByIdAndRemove(req.params.id, (err,doc)=>{
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
