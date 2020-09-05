const {Todo , User} = require('../models')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client('898768895094-9co6bp6bghjrgnbqb9g9nllfctp7u4ec.apps.googleusercontent.com')

class UserController{

    static register(req , res , next){

        let dataUser = req.body

        User.create(dataUser)
            .then(data=>{
                res.status(201).json({id : data.id , email:data.email , message:`User ${data.email} Has Been Create`})
            })
            .catch(next)

    }

    static  login( req , res , next){

        let dataUser = req.body

        User.findOne({
            where:{
                email : dataUser.email
            }
        })
        .then(data=>{

            if(data){
                
                let checkPassword = bcryptjs.compareSync(dataUser.password , data.password)

                if(checkPassword){
                    
                    const access_token = jwt.sign( {id:data.id , email:data.email} , process.env.SECRET_KEY)
                    
                    res.status(200).json({access_token , id:data.id })
                }else{
                    throw {message : 'Email / Password is Wrong' , status : 401}
                }

            }else{
                throw {message : 'Email / Password is Wrong' , status : 401}
            }
        })
        .catch(next)
    }

    static loginGoogle(req , res , next){


        client.verifyIdToken({
            idToken : req.body.id_token,
            audience : '898768895094-9co6bp6bghjrgnbqb9g9nllfctp7u4ec.apps.googleusercontent.com'
        })
        .then(ticket =>{
            let profile = ticket.getPayload()

            let dataUser = {
                email : profile.email,
                password : profile.email
            }

            return User.findOne({
                where:{
                    email : profile.email
                }
            })
            .then(data=>{
                if(!data){
                    return User.create(dataUser)
                }else{
                    let access_token = jwt.sign({id : data.id , email : data.email} , process.env.SECRET_KEY)
                    res.status(200).json({access_token , id:data.id , email : data.email})
                }
            })
            .then(data=>{
                let access_token = jwt.sign({id : data.id , email : data.email} , process.env.SECRET_KEY )
                res.status(200).json({access_token , id:data.id , email : data.email})
            })
            .catch(next)
        })

    }

}   

module.exports = UserController