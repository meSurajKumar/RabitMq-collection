const express = require('express');
const app = express();
const port = 3000;
const {sendFanoutMail} = require('./producer')

setInterval(()=>{
    sendFanoutMail()
    
},1000)


app.listen(port , ()=>console.log('Litening To Port : ',port))

