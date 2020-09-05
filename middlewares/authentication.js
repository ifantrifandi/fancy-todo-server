const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
require('dotenv').config()
const client = new OAuth2Client('898768895094-9co6bp6bghjrgnbqb9g9nllfctp7u4ec.apps.googleusercontent.com')
function authentication(req , res , next){

    if(req.headers.token){
        
        try {
            
            const dataUser = jwt.verify(req.headers.token , process.env.SECRET_KEY)
 
            if(dataUser){
                req.isLoggedIn = dataUser
                next()
            }

        }
        catch(err){
            throw {message:"Don't have Authentication" , status :401}
        }

    }else{
        throw {message:"Don't have Authentication" , status :401}
    }
    
}

module.exports =  authentication 