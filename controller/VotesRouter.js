const express = require('express');
const Router = express.Router()
const Question = require('../models/QuestionModel');
const Answer = require('../models/AnswerModel');
const { authenticate } = require('../utils/Auth')



// vote for a question model
Router.post('/question/:id', async(req, res) => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwNDliNzdkNDI2YmJiNDk4YzM5NTE0OSIsImlhdCI6MTYxNzAzNjMxMSwiZXhwIjoxNjE3MTIyNzExfQ.SLTMeHYA-iRZyNvwCfBBF3qzaw-V6FR9hm_9JokLrlY";

    const is_auth = await authenticate(token)
    if(is_auth.auth){
        const [qId, voteV] = req.params.id.split("_")
        let vote = {
            vote_by:is_auth.data.id,
            voteV:voteV
        }
        try{
            let data = Question.updateOne({$and:{}})
            res.send({vote})
        }catch(err){
            res.send({err})
        }
        
        
    }else{
        res.send("login credentials missing")
    }
    
})




module.exports = Router;