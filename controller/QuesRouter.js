const express = require('express');
const Router = express.Router();
const Question = require('../models/QuestionModel');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
require('dotenv');



// post a question
Router.post('/new', (req,res)=>{
    if(req.headers.cookie){
        const token = req.headers.cookie.split("x-access-token=")[1];
        jwt.verify(token, process.env.JWTSECRET, async(error, data)=>{
            try{
                if(error) return error;
                const userId = data.id;
                const question = new Question({
                    questioner: userId,
                    category:req.body.category,
                    question: req.body.question
                })
                try{
                    await question.save();
                    res.status(200).send({message:"question published successfully"});
                    
                }catch(err){
                    res.status(501).send({error:err._message})
                }

            }
            catch(error){
                res.status(403).send({error})
            }
        })
    }
    else{
        res.status(403).send({error:"You need to login first to post a question"})
    }
})

// get questions of respective user 
Router.get('/user',(req,res)=>{
    if(req.headers.cookie){
        const token = req.headers.cookie.split("x-access-token=")[1];
        jwt.verify(token, process.env.JWTSECRET, async(err, data)=>{
            try{
                if (err) return err;
                let userId = data.id;
                try{
                    await Question.find({questioner:userId}, (err, resp)=>{
                        if (err) return err;
                        res.status(200).send(resp)
                    })
                }
                catch(err){
                    res.send(err);

                }
            }
            catch(error){

            }
        })
    }
    else{
        res.status(403).send({error:"Login to view your questions"})
    }
    
})


// search questions
Router.get("/ques", async(req, res)=>{
    if(req.query){
        const q = new RegExp(req.query.search, 'i');
        const start = req.query.start?Number(req.query.start):0
        try{
            await Question.find({question:q},{skip:start},{limit:10},(err,data)=>{
            if(err) return err
            res.send(data)
        })}
        catch(error){
            res.send({error})
        }
    }
    else{
        res.status(403).send({error:"search query missing"})
    }
})

// get recent questions
Router.get("/", async(req, res)=>{
    
    try{
        let data = await Question.find({}).limit(10)
        res.send(data)
    }
    catch(error){
        res.send({error})
    }
    
})


// update question
Router.put('/update/:id', async(req,res)=>{
    if(req.headers.cookie){
        const token = req.headers.cookie.split('x-access-token=')[1]
        const QId = req.params.id;
        await jwt.verify(token, process.env.JWTSECRET,async(err, data)=>{
            if (err) return err;
            let userId = data.id;
            await Question.findById(QId, async(error,ques)=>{
                if (error) return error;
                if(ques.questioner==userId){
                    const updatedQues = {
                        category:req.body.category,
                        question: req.body.question
                    }
                    try{
                        await Question.updateOne({_id:QId},updatedQues,{runValidators:true},(er)=>{
                            if (er) return er;
                            res.status(200).send({success: `question updated successfully`})
                        })
                    }catch(error){
                        res.send({error:error.message})
                    }
                    
                }
                else{
                    res.send({error: "You're not authorised to edit this question"})
                }
            })
        })
    }
    else{
        res.send({error:"Login required"});
    }
})


// delete question
Router.delete('/delete/:id', async(req,res)=>{
    if(req.headers.cookie){
        const token = req.headers.cookie.split('x-access-token=')[1];
        jwt.verify(token, process.env.JWTSECRET, async(err,data)=>{
            if(err) return err;
            let userId = data.id;
            const Qid = req.params.id; 
            try{
                await Question.findById(Qid, async(err, ques)=>{
                    if(err) return err;
                    if(ques.questioner==userId){
                        await Question.deleteOne({_id:Qid},(err,msg)=>{
                            if(err) res.send({error: err.message});
                            res.send({success:"question deleted sucessfully"})
                        })
                    }
                    else{
                        res.send({error: "You're not authorised to delete this question"})
                    }
                })
            }
            catch(error){
                res.send({error})
            }
        })
    }
    else{
        res.send({message:"Login required"})
    }
})


module.exports = Router;
