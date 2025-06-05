const express = require('express');
const app = express();
const port = 3001;
const {recieveMail} = require('./consumer')


recieveMail();

app.listen(port , ()=>console.log('Litening To Port : ',port))

