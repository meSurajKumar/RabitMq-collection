const express = require('express');
const app = express();
const port = 3002;
const {receiveBroadCastSms} = require('./consumer')


receiveBroadCastSms();

app.listen(port , ()=>console.log('Litening To Port : ',port))

