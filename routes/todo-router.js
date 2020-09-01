const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication.js')
const authorization = require('../middlewares/authorization.js')
const TodoController = require('../controllers/todo-controller.js')


router.use(authentication)
router.use(authorization)
router.get('/' , TodoController.getTodo)
router.post('/' , TodoController.createTodo)
router.get('/:id' , TodoController.getTodoById)
router.put('/:id' , TodoController.updateTodo)
router.delete('/:id' , TodoController.deleteTodo)

module.exports = router