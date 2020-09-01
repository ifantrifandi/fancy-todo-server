const {Todo , User} = require('../models')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

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
                    
                    res.status(200).json({access_token})
                }else{
                    throw {message : 'Email / Password is Wrong' , status : 401}
                }

            }else{
                throw {message : 'Email / Password is Wrong' , status : 401}
            }
        })
        .catch(next)
    }

}

module.exports = UserController