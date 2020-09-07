const { Todo } = require('../models')
const helper = require('../helpers/helper.js')
require('dotenv').config()
const {google} = require('googleapis')
const Sequelize = require('sequelize');
const { Op } = require("sequelize")

class TodoController{

    static getTodo(req , res , next){

        let id = req.isLoggedIn.id

        Todo.findAll({where :{
            UserId : id,
            status :{
                [Op.notLike] : '%COMPLETED'
            }
        }})
            .then(data=>{
                res.status(200).json(data)
            })
            .catch(next)

    }

    static getAllTodo(req , res , next){

        let id = req.isLoggedIn.id

        Todo.findAll({where :{
            UserId : id
        }})
            .then(data=>{
                res.status(200).json(data)
            })
            .catch(next)

    }

    static createTodo(req , res , next){
        
        const dataTodo = req.body

        dataTodo.UserId = req.isLoggedIn.id

        console.log(dataTodo)
        return google.youtube('v3').search.list({
            key: process.env.YOUTUBE_TOKEN,
            part : 'snippet',
            q: dataTodo.title,
            maxResults: 1,
        })
        .then(youtubeData =>{
            let reference = helper(youtubeData)
            dataTodo.reference = reference
            return Todo.create(dataTodo)
        })
        .then(data=>{
            res.status(201).json(data)
        })
        .catch(next)

    }

    static getTodoById(req , res , next){

        const idTodo = req.params.id

            Todo.findByPk(idTodo)
                .then(data=>{
                    if(data){
                        let year =  data.due_date.getFullYear()
                        let month = data.due_date.getMonth() + 1

                        if(month < 10){
                            month = '0' + month
                        }

                        
                        let date = data.due_date.getDate()
                        if(date < 10){
                            date = '0' + date
                        }
                        let newDate = `${month}/${date}/${year}`
                        data.date = newDate
                        res.status(200).json(data)
                    }else{
                       throw { message : `Sorry There is no id ${idTodo} in database` , status:400}
                    }
                })
                .catch(next)
        
        
    }

    static updateTodo(req ,res , next){

        const idTodo = req.params.id
        const dataTodo = req.body

        dataTodo.status = dataTodo.status.toUpperCase()

        Todo.update(dataTodo , {
                where : {
                    id : idTodo
                }
            })
        .then(data=>{

            if(data != 0){
                res.status(201).json({message : 'Data berhasil di update' , data})
            }else{
                throw {message:`Sorry There is no id ${idTodo} in database` , status:400}
            }
        })
        .catch(next)

    }

    static deleteTodo(req , res , next){

        const idTodo = req.params.id

        Todo.destroy({
            where : {
                id : idTodo
            }
        })
        .then(data=>{
            if(data){
                res.status(200).json({message : 'Data sudah sudah berhasil di delete'})
            }else{
               throw {message:`Sorry There is no id ${idTodo} in database` , status:400}
            }
        })
        .catch(next)

    }
    
}


module.exports = TodoController