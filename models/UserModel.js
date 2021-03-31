const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        min: 6,
        max: 20,
        required:true
    },
    email:{
        type:String,
        unique:true,
        min: 8,
        max: 255,
        required:true
    },
    password:{
        type: String,
        required:true,
        max:1024
    },
    isActive:{
        type:Boolean,
        default: true
    },
    profile_img_url:{
        type:String,
        default:"https://res.cloudinary.com/djsrzxm3j/image/upload/v1616935984/QuoraLt/default_profile_qltwic.png"
    },
    DOB:{
        type: Date,
        required: true
    },
    role:{
        type:String,
        default: 'User'
    },
    joined_date:{
        type:Date,
        default:Date.now()
    },
    following:{
        type:Array,
        default:[]
    },
    followers:{
        type:Array,
        default:[]
    }
})

module.exports = mongoose.model('Users', UserSchema)