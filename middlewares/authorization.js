function authorization(req , res , next){

    if(req.isLoggedIn.email === 'test@email.com'){
        next()
    }else{
        throw {message:"Don't have Authorization" , status :401}
    }
    
}

module.exports = authorization