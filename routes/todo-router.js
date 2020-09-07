const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication.js')
const authorization = require('../middlewares/authorization.js')
const TodoController = require('../controllers/todo-controller.js')


router.use(authentication)

router.post('/' , TodoController.createTodo)
router.get('/' , TodoController.getTodo)
router.get('/history' , TodoController.getAllTodo)
router.get('/:id' , TodoController.getTodoById)

router.put('/:id' , authorization, TodoController.updateTodo)
router.delete('/:id' , authorization ,  TodoController.deleteTodo)

module.exports = router