const {Todo} = require('../models')

function authorization(req , res , next){

    Todo.findOne({
        where : {
            id : req.params.id
        }
    })
    .then(data=>{

        if(req.isLoggedIn.id === data.UserId){
            next()
        }else{
            next({message:"Don't have Authorization" , status :401}) 
        }
    })
    .catch(next)
    
}

module.exports = authorization