const express = require('express');
var router = express.Router();
var {
  Contacts
} = require('../model/contact');


var docId = require('mongoose').Types.ObjectId;
router.get('', (req, res) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage
  var query = {}
  if (pageSize && currentPage) {
    query.skip = pageSize * (currentPage - 1)
    query.limit = pageSize
    Contacts.find({}, {}, query, function (err, data) {
      if (!err) {
        res.send(data)
      } else {
        console.log("Error:" + JSON.stringify(err, undefined, 2));
      }
    })

  } else {
    Contacts.find((err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log('Error is fetching blogs:' + JSON.stringify(err, undefined, 2));
      }
    }).sort({
      date: 'desc'
    })
  }
})

router.get('/:id', (req, res) => {
  if (!docId.isValid(req.params.id)) {
    res.status(400).send(`The requested Id is invalid :  ${req.params.id}`);
  } else {
    Contacts.findById(req.params.id, (err, docs) => {
      if (!err) {
        res.send(docs);
      } else {
        console.log('Error in getting blog details: ' + JSON.stringify(err, undefined, 2));
      }
    })
  }
})


router.post('', (req, res) => {
  var contact = new Contacts({
    name: req.body.name,
    contactno: req.body.contactno,
    email: req.body.email,
    message: req.body.message,
    date: req.body.date
  })
  contact.save((err, docs) => {
    if (!err) {
      res.send(docs);
      const sgMail = require('@sendgrid/mail');
      const SENDGRID_API_KEY = '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'
      sgMail.setApiKey(SENDGRID_API_KEY);
      const msg = {
        to: 'sophie.x@swi-cn.com',
        from: 'no-reply.admin@soulaca.com',
        subject: 'New Enquiry',
        text: 'You Have Got A New Contact Enquiry',
        html: `<h1 style="text-align:center"> New meaasage from</h1><br>
        <ul style="list-style-type:none">
        <li><h3>Name : ${req.body.name}</h3></li>
        <li><h3>Email : ${req.body.email}</h3></li>
        <li><h3>Contact No. : ${req.body.contactno}</h3></li>
        <li><h3 style="text-decoration:underline">Message</h3></li><br><br>
        <div style="width:100%; height:80px;overflow-y:auto;padding:10px;border:1px dashed black">
        ${req.body.message}
        </div>
        </ul>`,
      };
      sgMail.send(msg);
      const msg1 = {
        to: req.body.email,
        from: 'no-reply.admin@soulaca.com',
        subject: 'Greetings from soulaca.com',
        text: 'We have received your query',
        html: `Dear ${req.body.name}, <br>
        <p> Thank you for visiting to us.
        Your query has been forwarded to the concerned team. We will get back to you shortly.</p>
        <p>Regards,<br>
        Soulaca Sales Team
        </p>
        `,
      };
      sgMail.send(msg1);
    } else {
      console.log('Error in saving blog :' + JSON.stringify(err, undefined, 2));
    }
  })
})


router.delete('/:id', (req, res) => {
  if (!docId.isValid(req.params.id)) {
    res.status(400).send(`The requested id is invalid : ${req.params.id}`);
  } else {
    Contacts.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log('error in deleting data :' + JSON.stringify(err, undefined, 2));
      }
    })
  }
})
module.exports = router
