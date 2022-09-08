const mongoose = require ('mongoose');
var Job = mongoose.model('Job', {
    title:{type: String},
    posting_date : {type : String},
    experience : {type: String},
    job_details : {type: String}
})

module.exports = {Job}