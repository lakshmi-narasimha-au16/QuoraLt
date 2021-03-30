const mongoose = require('mongoose');

// VOTES will have userid and value bolean for question 

const QVoteSchema = mongoose.Schema({
    // voter id
    vote_by:{
        type:String,
        required: true
    },
    vote_Qid:{
        type:String,
        required: true
    },
    vote_Aid:{
        type:String,
        required: true
    },
    vote:{
        type:boolean,
        required: true
    }
})

module.exports = mongoose.model('votes', VoteSchema)
