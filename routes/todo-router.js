const express = require('express')
const router = express.Router()
const authentication = require('../middlewares/authentication.js')
const authorization = require('../middlewares/authorization.js')
const TodoController = require('../controllers/todo-controller.js')


router.use(authentication)
// authorization saat ini belum dipakai dikarenakan belum ada yang mendefinisikan apakah data / page yang digunakan dapat digunakan banyak orang / role yang berbeda
// bisa dipakai untuk saat ini apabila email hanya untuk test@email.com saja
// router.use(authorization)

router.get('/' , TodoController.getTodo)
router.get('/history' , TodoController.getAllTodo)
router.post('/' , TodoController.createTodo)
router.get('/:id' , TodoController.getTodoById)
router.put('/:id' , TodoController.updateTodo)
router.delete('/:id' , TodoController.deleteTodo)

module.exports = router