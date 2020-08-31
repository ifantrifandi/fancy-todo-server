const express = require('express')
const router = express.Router()

const todoRouter = require('./todo-router.js')
const userRouter = require('./user-router.js')

router.use('/todos' , todoRouter)
router.use('/' , userRouter)

module.exports = router