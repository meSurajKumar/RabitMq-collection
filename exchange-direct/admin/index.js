const express = require('express');
const app = express()
const {sendMail} = require('./producer')
const port = 3000

setInterval(()=>{
    sendMail() // send the mails

},1000)

app.listen(port, ()=>console.log('Listening to port',port))