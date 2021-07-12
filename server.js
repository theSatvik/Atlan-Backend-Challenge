const { urlencoded } = require('express');
const express = require('express');
const fast2sms = require('fast-two-sms')
const app = express();
const port= 3000;
require('dotenv').config();

app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));

app.post('/sendmessage',async (req,res)=>{
     
var options = {authorization : process.env.API_KEY , message : `Your Details : ${req.body.message}` ,  numbers : [req.body.number]};
const response =  await fast2sms.sendMessage(options); //Asynchronous Function.
res.send(response);
});

app.get('/',(req,res)=>{
    res.render('index.ejs');
})

app.listen(port,()=>{
    console.log(`Server is listening at port : ${port}`);
});