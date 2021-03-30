const Router = require('express')();
const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const Joi = require('@hapi/joi');        // for requests validation
const Jwt =  require('jsonwebtoken');
require('dotenv/config');


// validator Schema
const registerSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email:Joi.string().min(6).required().email(),
    password:Joi.string().min(6).required(),
    dob:Joi.string().required().isoDate()
})

const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required()
})



// register users
Router.post('/register', async(req,res)=>{
    // validate req.body
    const {error} = registerSchema.validate(req.body)
    
    if(error) return res.status(400).send(error)
    
    const hashed_password = await bcrypt.hashSync(req.body.password, 9);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashed_password,
        DOB: req.body.dob
    })
    try{
        await user.save()
        res.status(200).send("registered successfully")
    }catch(err){
        res.status(400).send("Bad request")
    }
    
})


// Authenticate/login Users
Router.post('/login',async(req, res)=>{
    const {error} = loginSchema.validate(req.body)
    if(error) return res.status(400).send(error)
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    try{
        let data = await User.findOne({email:user.email})
        
        if(data ){
            const isValidPswd = await bcrypt.compareSync(user.password, data.password);
            if(isValidPswd){
                const token = Jwt.sign({id:data._id}, process.env.JWTSECRET, {expiresIn:'1d'})
                res.cookie('x-access-token', token, {httpOnly:true, secure:false, maxAge:86400})
                res.status(200).send({token})
            }

        }else{
            res.status(200).send("User not found")
        }
    }catch(err){
        res.status(500).send(err)
    }
    
})

// get user by id
Router.get('/users/:id', async(req, res) =>{
    let id = req.params.id
    try{
        let data = await User.findById(id)
        data.password =undefined,
        data.role = undefined,
        res.send(data);
    }catch(err){
        res.send(err)
    }
})


// get profiles of list of users with ids
Router.get('/users/profiles', async(req, res)=>{
    const ids = req.body.ids
    try{
        let usersdata = await User.find({_id:{$in:ids}});
        let data = usersdata.map(item=>{
            item.password= undefined;
            item.role = undefined;
            return item
        })
        res.send(data)
    }catch(err){
        res.send(err)
    }
    
})


// Get all users
Router.get('/users', async(req,res)=>{
    if(req.headers['x-access-token']){
        const token = req.headers['x-access-token'];
            const start = req.query.start?Number(req.query.start):0
            Jwt.verify(token, process.env.JWTSECRET, async(err, data)=>{
                if (err) return res.send('invalid token');
                try{
                    let user = await User.findById(data.id)
                    if(user.role=="Admin"){
                        const  users = await User.find({},{skip:start},{limit:10}).exec();
                        res.status(200).send(users)
                    }else{
                        res.status(200).send("You're not authorized to get usersdata")
                    }
                    
                }catch(err){
                    res.json({err, error:"invalid userId"})
                }
            })    
    }
    else{
        res.status(403).json("Bad request. You're not authorized")
    }
    
})

// get user profile
Router.get('/profile', (req,res)=>{
    if(req.headers.cookie){
        try{
            let token = req.headers.cookie.split("x-access-token=")[1]
            Jwt.verify(token, process.env.JWTSECRET, async(err, data)=>{
                if (err) return res.send("invalid token")
                var user = await User.findById(data.id)
                user.password=undefined;
                res.status(200).json(user);
            })
        }catch{
            res.status(403).send('token required')
        }
        
    }
    else{
        res.status(403).send("Authentication required")
    }
    
})

// Update user
Router.put('/update/profile', async(req, res)=>{
    if(req.headers.cookie){
        try{
            let token = req.headers.cookie.split("x-access-token=")[1]
            Jwt.verify(token, process.env.JWTSECRET, async(err, data)=>{
                if (err) return res.send("invalid token")
                let user = await User.findById(data.id)
                const updatedUser = {
                    name: req.body.name ? req.body.name : user.name,
                    email: req.body.email? req.body.email : user.email,
                    DOB: req.body.dob ? req.body.dob: user.DOB
                }
                try{
                    await User.updateOne({_id:data.id}, updatedUser, {runValidators:true},async (error, data)=>{
                        if (error) return error
                        res.status(200).send({status:"success"})
                        } )
                }
                catch(err){
                    res.send(err)
                }
                  
            })
        }
        catch{
            res.status(403).send("You're not authorized")

        }
    }
    else{
        res.status(403).send("Authentication required")
    }
})

// Deactivate user

// Delete user






module.exports = Router;