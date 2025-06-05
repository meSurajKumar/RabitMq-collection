const express = require('express');
const app = express();
const port = 3000;
const {sendMail} = require('./producer')

setInterval(()=>{
    sendMail()
    
},1000)


app.listen(port , ()=>console.log('Litening To Port : ',port))

