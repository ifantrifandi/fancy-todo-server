const express = require('express')
const app = express()
const routes = require('./routes')
const port = 3001

app.use(express.json())
app.use(express.urlencoded({extended : true}))

app.use('/' , routes)

app.listen(port, ()=>{
    console.log(`Listening in port ${port}`)
})
