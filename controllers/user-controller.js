const {Todo , User} = require('../models')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserController{

    static register(req , res){

        let dataUser = req.body

        User.create(dataUser)
            .then(data=>{
                res.status(201).json({id : data.id , email:data.email , message:`User ${data.email} Has Been Create`})
            })
            .catch(err=>{
                console.log(err)
                if(err.errors){
                    res.status(400).json(err)
                }else{
                    res.status(500).json({message : 'Sorry, There is error in our server. Please Try Again. (register)'})
                }
            })

    }

    static  login( req , res){

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
                    
                    const access_token = jwt.sign({id:data.id , email:data.email} , 'secretkey')
                    const decoded = jwt.verify(access_token , 'secretkey')

                    res.status(200).json({access_token , message : {decoded}})
                }else{
                    res.status(401).json({message : 'Please Register first!'})
                }

            }else{
                res.status(401).json({message : 'Email / Password is Wrong'})
            }
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json({message : 'Sorry, There is error in our server. Please Try Again. (register)'})
        })
    }

}

module.exports = UserController