const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
require('dotenv').config()
const client = new OAuth2Client('898768895094-9co6bp6bghjrgnbqb9g9nllfctp7u4ec.apps.googleusercontent.com')
const {User} = require('../models')

function authentication(req , res , next){

    if(req.headers.token){
        
        try {
            
            const dataUser = jwt.verify(req.headers.token , process.env.SECRET_KEY)

            console.log(dataUser , 'datauser')
 
            if(dataUser){

                req.isLoggedIn = dataUser

                User.findByPk(dataUser.id)
                .then(data=>{
                    if(data){

                        next()    
                         
                    }else{
                        throw({message : 'not authenticate' , status:401})
                    }
                })
                .catch(next)

            }else{

                next({message : 'not authenticate' , status:401})

            }

        }
        catch(err){
            next ({message:"else dalem error 123" , status :401})
        }

    }else{
       throw  {message:"else error" , status :401}
    }
    
}

module.exports =  authentication 