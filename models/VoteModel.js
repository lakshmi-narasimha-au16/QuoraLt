const mongoose = require('mongoose');

// VOTES will have userid and value 1 for upvote 0 for down vote and vote for comment/answer/question and Id

const VoteSchema = mongoose.Schema({
    vote_by:{
        type:String,
        required: true
    },
    vote_for:{
        type:String,
        required: true
    },
    vote_for_id:{
        type:String,
        required: true
    },
    value:{
        type:Number,
        max:1,
        min:-1,
        default:0
    }
})

module.exports = mongoose.model('votes', VoteSchema)
