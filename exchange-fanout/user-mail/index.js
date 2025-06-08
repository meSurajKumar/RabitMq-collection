const express = require('express');
const app = express();
const port = 3001;
const {receiveBroadCastMail} = require('./consumer')


receiveBroadCastMail();

app.listen(port , ()=>console.log('Litening To Port : ',port))

