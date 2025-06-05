const express = require('express');
const app = express()
const {receiveMails} = require('./consumer')
const port = 3001


receiveMails() // receive the mails

app.listen(port, ()=>console.log('Listening to port',port))