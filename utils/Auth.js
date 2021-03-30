const jwt = require('jsonwebtoken');
require('dotenv/config')


const authenticate = (token)=>{
    let is_auth;
    try{
      is_auth = jwt.verify(token, process.env.JWTSECRET,(err,data)=>{
  
        if (err) throw err;
        return {auth:true,data};
      })
    }
    catch(err){
      is_auth = {auth:false, error:err}
    }
    return is_auth; 
  } 

module.exports = {authenticate}