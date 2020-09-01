const jwt = require('jsonwebtoken')
require('dotenv').config()

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