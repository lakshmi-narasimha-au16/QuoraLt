const mongoose = require('mongoose');

// comment will have a author, comment, comment_for , timestamp, upvotes, downvotes, replies


const CommentSchema = mongoose.Schema({
    commenter :{
        type:String,
        required: true
    },
    comment_for:{
        type: String,
        required: true
    },
    comment:{
        type: String,
        required:true
    },
    timestamp: {
        type:Date,
        defualt: Date.now()
    },
    votes:{
        type:Array,
        default:[]
    },
    replies:{
        type:Array,
        default:[]
    }
})

module.exports = mongoose.model('comments', CommentSchema)