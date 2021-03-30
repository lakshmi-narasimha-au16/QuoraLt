const express = require('express');
const Router = express.Router();
const Answer = require('../models/AnswerModel')
const Question = require('../models/QuestionModel')
const jwt = require('jsonwebtoken');
const replaceAsync = require("string-replace-async");
require('dotenv');
const {cloudinary} = require('../utils/cloudinary');



// get images from html string
function getImages(string) {
    const imgRex = /<img.*?src="(.*?)"/g;
    const images = [];
    let img;
    while ((img = imgRex.exec(string))) {
      images.push(img[1]);
    }
    return images;
  }


// optimise images store in cloudinary and return urls of images
async function getImageUrls(imagesList){
  let imageUrls = imagesList.map( async (item,idx)=>{
    try{
      const uploadRes = await cloudinary.uploader.upload(item, {upload_preset:'quoralt_preset'})
      return uploadRes.url
    }
    catch(err){
      console.error(err)
    }
    
  })
  return imageUrls
}

// replace request string with image urls
const replaceImageUrlsFromReqestString = async(s, urls)=>{
  let i = 0;
  const imgRex = /<img.*?src="(.*?)"/g;
  let img;
  while ((img = imgRex.exec(s))) {
    while(i<urls.length){
        s = await replaceAsync(s, img[1], (match,name)=>{
          return urls[i]
        })
        i++
      }
  }
  return s;
}


// authenticate users
const authenticate = (cookie)=>{
  let is_auth;
  try{
    is_auth = jwt.verify(cookie, process.env.JWTSECRET,(err,data)=>{

      if (err) throw err;
      return {auth:true,data};
    })
  }
  catch(err){
    is_auth = {auth:false, error:err}
  }
  return is_auth; 
} 

// Route to post an answer
Router.post('/',async(req, res)=>{
  const { headers: { cookie } } = req
  let is_auth = await req.headers.cookie? authenticate(req.headers.cookie.split('x-access-token=')[1]):false; 
  if(is_auth.auth){
    let data = req.body.data
    let images = await getImages(data)
    var imageUrls =await getImageUrls(images)
    let optData = await replaceImageUrlsFromReqestString(data, imageUrls)
    res.send(optData)
  }
  else{
    res.send({error:"You're not authorised. Please login"})
  }
  
})

// get answers


// edit an answer




// delete an answer 


module.exports = Router;