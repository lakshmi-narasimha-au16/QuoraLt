const mongoose = require('mongoose');

// Answer will have following fields
// answer, answerer, answer_for, answered timestamp, votes, comments 


const AnswerSchema = mongoose.Schema({
    answer_by:{
        type:String, 
        required:true
    },
    answer_for:{
        type:String, 
        required: true
    },
    answered_time:{
        type: Date,
        default: Date.now()
    },
    answer:{
        type: String,
        required:true
    },
    votes:{
        type:Array,
        default:[]
    },
    comments:{
        type:Array,
        default:[]
    }


})


module.exports = mongoose.model('Answers', AnswerSchema)
