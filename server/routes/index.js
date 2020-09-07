const express = require('express')
const router = express.Router()
const errorHandler = require('../middlewares/errorHandler.js')
const todoRouter = require('./todo-router.js')
const userRouter = require('./user-router.js')

router.use('/todos' , todoRouter)
router.use('/' , userRouter)
router.use(errorHandler)
module.exports = router