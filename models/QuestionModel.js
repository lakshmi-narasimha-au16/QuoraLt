const mongoose = require('mongoose');


// question fields
// questioner, timestamp, comments, upvotes, downvotes, title, description, category,answers

const QuestionSchema = mongoose.Schema({
    questioner:{
        type:String, 
        required:true
    },
    questioned_time:{
        type: Date,
        default: Date.now()
    },
    answers:{
        type: Array,
        default:[]
    },
    category:{
        type: String,
        required:true
    },
    title:{
        type: String,
        required: true,
        maxLength: 2048
    },
    detail:{
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


module.exports = mongoose.model('Questions', QuestionSchema)