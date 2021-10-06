const mongoose=require('mongoose');

let users_schema=new mongoose.Schema({
    name: {
        type: String,
        required: true
    } ,
    class: {
        type: String,
        required: true
    } ,
    total_time: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('users',users_schema);