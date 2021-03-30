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
    question:{
        type: String,
        required: true
    },
    votes:{
        type:Array,
        default:[]
    },
    upvotes:{
        type:Number,
    },
    downvotes:{
        type:Number,
    },
    
    comments:{
        type:Array,
        default:[]
    }
})


module.exports = mongoose.model('Questions', QuestionSchema)