// importing and configuring dotenv for environment
require('dotenv').config()

//importing express.js module
const express = require('express')
const routes = require('./Routes/Routes')
const cors = require('cors')

//creating server app instance
const app=express()

//importing mongoose connection
require('./Connection/connection')

// configuring cors to app
app.use(cors())

//configuring json middleware into app
app.use(express.json())

//configuring routes into app
app.use(routes)

//serving upload files to client side
app.use('/uploadImg',express.static('bookImages'))

//serving uploaded resumes to client side
app.use('/resumes', express.static('resumeFiles'))

//setting a specific port number
const PORT=process.env.PORT || 3000

//turning on listening mode of server,so it runs
app.listen(PORT,(error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log(`Server running at http://localhost:${PORT}`)
    }
})