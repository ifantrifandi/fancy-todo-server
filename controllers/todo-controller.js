const { Todo } = require('../models')

class TodoController{

    static getTodo(req , res){

        Todo.findAll()
            .then(data=>{
                res.status(200).json(data)
            })
            .catch(err=>{
                console.log(err)
                res.status(500).json({message : 'Sorry, There is error in our server. Please Try Again. (getTodo)'})
            })

    }

    static createTodo(req , res){

        const dataTodo = req.body

        Todo.create(dataTodo)
            .then(data=>{
                res.status(201).json(data)
            })
            .catch(err=>{
                 if(err){
                    res.status(400).json(err.errors)
                }else{
                    console.log(err)
                    res.status(500).json({message : 'Sorry, There is error in our server. Please Try Again. (createTodo)'})
                }
            })

    }

    static getTodoById(req , res){

        const idTodo = req.params.id

        Todo.findByPk(idTodo)
        .then(data=>{
            if(data){
                res.status(200).json(data)
            }else{
                res.status(400).json({message : `Sorry There is no id ${idTodo} in database`})
            }
            
        })
        .catch(err=>{
            if(!err){
                res.status(400).json({message : `Sorry There is no id ${idTodo} in database`})
            }else{
                console.log(err)
                res.status(500).json({message : 'Sorry, There is error in our server. Please Try Again. (getTodoById)'})
            }
        })
        
    }

    static updateTodo(req ,res){

        const idTodo = req.params.id
        const dataTodo = req.body

        Todo.update(dataTodo , {
            where : {
                id : idTodo
            }
        })
        .then(data=>{
            res.status(200).json({message: 'Data berhasil di update'})
        })
        .catch(err=>{

            if(err.errors){
                res.status(400).json(err.errors)
            }else{
                console.log(err)
                res.status(500).json({message : 'Sorry, There is error in our server. Please Try Again. (updateTodo)'})
            }

        })

    }

    static deleteTodo(req , res){

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
                res.status(400).json({message : `Sorry There is no id ${idTodo} in database`})
            }
            
        })
        .catch(err=>{

                console.log(err)
                res.status(500).json({message : 'Sorry, There is error in our server. Please Try Again. (deleteTodo)'})
        })

    }
    
}


module.exports = TodoController