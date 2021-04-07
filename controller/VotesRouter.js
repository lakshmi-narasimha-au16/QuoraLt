const express = require('express');
const Router = express.Router()
const Question = require('../models/QuestionModel');
const Answer = require('../models/AnswerModel');
const Qvote = require('../models/QvoteModel');
const { authenticate } = require('../utils/Auth')



// vote for a question model
Router.post('/question/:id', async(req, res) => {
    const token = req.headers.cookie.split('x-access-token=')[1]
    // console.log(req.headers)
    const is_auth = await authenticate(token)
    if(is_auth.auth){
        const [qId, voteV] = req.params.id.split("_")
        let votes = {
            vote_by:is_auth.data.id,
            voteV:voteV==="true"? true:false
        }
        let voteId = new Qvote(votes)
        try{
            Question.findById(qId,async (err,resp)=>{
                if (err) throw err
                let voted = await resp.votes.filter((vote)=>vote.vote_by==votes.vote_by)
                
                if(voted.length==0){
                    resp.votes.push(voteId)
                    if(votes.voteV==true){
                        resp.upvotes++;
                    }else{
                        resp.downvotes++
                    }
                    await resp.save()
                    res.send({resp})
                }else{
                    if(voted[0].voteV !== votes.voteV){
                        
                        // voted.voteV = votes.voteV
                        resp.votes = resp.votes.filter((vote)=>{
                            return vote.vote_by!==votes.vote_by
                        })
                        resp.votes.push(voteId)
                        if(votes.voteV== true){
                            resp.downvotes--
                            resp.upvotes++;
                        }else{
                            resp.upvotes--
                            resp.downvotes++
                        }
                        await resp.save()
                        res.send({resp})
                    }else{
                        res.send({resp})
                    }
                    
                }
            })
            
        }catch(err){
            res.send({err})
        }
        
    }else{
        res.send("login credentials missing")
    }
    
})




module.exports = Router;