const { Todo } = require('../models')
const helper = require('../helpers/helper.js')
require('dotenv').config()
const {google} = require('googleapis')

class TodoController{

    static getTodo(req , res , next){

        Todo.findAll()
            .then(data=>{
                res.status(200).json(data)
            })
            .catch(next)

    }

    static createTodo(req , res , next){
        
        const dataTodo = req.body
        let newData = []
        console.log(dataTodo)
        Todo.create(dataTodo)
            .then(data=>{
                newData.push(data)
                return google.youtube('v3').search.list({
                    key: process.env.YOUTUBE_TOKEN,
                    part : 'snippet',
                    q: dataTodo.title,
                })
                .then(response=>{

                    let video = helper(response)
                    let reference = {video}

                    newData = {newData , reference}
                    res.status(201).json(data)
                })
            })
            .catch(next)

    }

    static getTodoById(req , res , next){

        const idTodo = req.params.id
        console.log(idTodo , req.isLoggedIn)

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

        Todo.update(dataTodo , {
            where : {
                id : idTodo
            }
        })
        .then(data=>{
            
            if(data != 0){

                return google.youtube('v3').search.list({
                    key: process.env.YOUTUBE_TOKEN,
                    part : 'snippet',
                    q: dataTodo.title,
                })
                .then(response=>{

                    let video = helper(response)
                    let reference = {video}
                    res.status(201).json({message : 'Data berhasil di update' , reference})
                    
                })

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