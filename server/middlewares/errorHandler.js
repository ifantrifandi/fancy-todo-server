function errorHandler(err , req , res , next){
    console.log(err)
    let message = err.message
    let status = err.status || 500

    if(status === 500){
        message = 'Internal Server Error'
    }

    if(err.name === 'SequelizeValidationError'){
        res.status(400).json({message : 'Validation Error'})
    }else{
        res.status(status).json({message})
    }

}

module.exports = errorHandler