const express = require('express');
const router = express.Router();
var {Candidates} = require('../model/candidate');
const multer = require('multer');
var docId= require('mongoose').Types.ObjectId;
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const patho = require("path");
let path;
const mime = require('mime');
const mime_type ={
    "application/msword" : "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" : 'docx',
    "text/plain" : 'txt',
    "application/pdf" : 'pdf',
    "application/rtf" : 'rtf'
}
aws.config.update({
    secretAccessKey: 'Q4z4BzMVtCc0LByylbnzHCIY9l12tZ6XD91KkHmC',
    accessKeyId: 'AKIAJDVWBHRCBWZZ27IQ',
    region: 'ap-south-1'
});

var s3 = new aws.S3();
var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'swicn-mean-app',
        key: function (req, file, cb) {
           
    var newFileName = Date.now() + "-" + file.originalname + '.pdf';
    var fullPath = 'uploads/resume/'+ newFileName;
    cb(null, fullPath);
    path = fullPath;
        }
    })
});
// const storage = multer.diskStorage(
//     {
//         destination : (req, file, cb)=>{
//             cb(null, "../backend/resume")
//         },
//         filename :(req,file,cb)=>{
//             const name= file.originalname.toLocaleLowerCase().split(' ').join('-');
//             const ext = mime_type[file.mimetype]
//             cb(null , name + '-' + Date.now() + '.' + ext)
//         }
//     }
// )

router.get('',(req, res)=>{
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.currentPage
    var query = {}
    if(pageSize && currentPage){
        query.skip = pageSize * (currentPage - 1)
  query.limit = pageSize
        Candidates.find({},{},query, function(err,data) {
            if(!err){
                res.send(data)
            }
            else{
                console.log("Error:" + JSON.stringify(err,undefined,2));
            }
        })
       
    }
    else{
    Candidates.find((err,docs)=>{
        if(!err){
            res.send(docs);
        }
        else{
            console.log('Error is fetching candidates:' +  JSON.stringify(err,undefined,2));
        }
    }).sort({date : 'desc'})
}
})

router.post('', upload.single("resume"), (req,res)=>{
    if (req.file) {

        // const url = req.protocol + "://" + req.get("host");
        const url = "https://swicn-mean-app.s3.ap-south-1.amazonaws.com/";
        // var path =  url + "/resume/" + req.file.filename;
        var candidate = new Candidates({
            name  : req.body.name,
            email  : req.body.email,
            phoneno:req.body.phoneno,
            intrest : req.body.intrest,
           resumePath: url + path  ,
            date : req.body.date
        })
        candidate.save((err,docs)=>{
            if(!err){
                res.send(docs)
                //email coding
                const sgMail = require('@sendgrid/mail');
          const SENDGRID_API_KEY = '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'
          sgMail.setApiKey(SENDGRID_API_KEY);
    
            
          const msg = {
            to: 'sophie.x@swi-cn.com',
            from: 'no-reply.admin@swicn.com',
            subject: 'Candidate Application',
            text: 'You Have Got A New Candidate Request',
            html: `<div style="text-align:left"><h1>Candidate Resume</h1><br>
            <ul style="list-style-type:none">
            <li><h3>Name : ${req.body.name}</h3></li>
            <li><h3>Email : ${req.body.email}</h3></li>
            <li><h3>Contact No. : ${req.body.phoneno}</h3></li>
            <li><h3>Applied For : ${req.body.intrest}</h3></li>
            <li><h3 style="text-decoration:underline"> <a style="color:blue" href="${path}">click here to download resume</a></h3></li><br><br>
            </ul>
         
            </div>`,
          };
          sgMail.send(msg);
          const msg1 = {
            to: req.body.email,
            from: 'no-reply.admin@swicn.com',
            subject: 'Greetings from swicn.com',
            text: 'We have received your resume',
            html: `Dear ${req.body.name},<br>
            <p> Thank you for your interest.
            Your CV has been forwarded to the concerned team. We will get back to you shortly.</p>
           
            <p>Regards, <br>
            SWI HR Team</p>
            `,
    
          };
          sgMail.send(msg1);
            }
            else{
                console.log('Error in saving blog :' +JSON.stringify(err, undefined,2));
            }
        })
      }
  

})

router.delete('/:id',(req,res)=>{
    if(!docId.isValid(req.params.id)){
        res.status(400).send(`The requested id is invalid : ${req.params.id}`);
    }
    else{
        Candidates.findByIdAndRemove(req.params.id, (err,doc)=>{
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