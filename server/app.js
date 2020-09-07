const express = require('express')
const app = express()
const cors = require('cors')
const routes = require('./routes')
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use('/' , routes)

app.listen(port, ()=>{
    console.log(`Listening in port ${port}`)
})
