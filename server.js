const { urlencoded } = require('express');
const express = require('express');
const fast2sms = require('fast-two-sms')
const app = express();
const cors = require("cors");
const pool = require('./db')
require('dotenv').config();
const port= 3000;


app.set('view engine','ejs');

// Middlewares
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());


// Middleware Methods

//Routes

// Validate while insertion of a new client details.
var validateMiddleware = {
    validateData : function validateData(req,res,next){
        const {incomePerAnnum,savingsPerAnnum} = req.body;
    
        if(incomePerAnnum < savingsPerAnnum){
            res.json("Invalid Data Savings cannot be more than Income");
        }
        next();
    },
    sendMessage : async function sendMessage(req,res,next){
        try{ const {client_email, client_name, incomePerAnnum, savingsPerAnnum } = req.body;
         var options = {authorization : process.env.API_KEY , message : `Your Details : ${req.body.message}` ,  numbers : [req.body.number]};
         const response =  await fast2sms.sendMessage(options); //Asynchronous Function.
         res.send(response);
         }catch(err){
             res.json("Failed to send SMS to the Client");
         }
         next();
     }
}

app.post('/validateNew',[validateMiddleware.validateData, validateMiddleware.sendMessage],async(req,res) => {
    try{
        const {client_email, client_name, incomePerAnnum, savingsPerAnnum } = req.body;
        const newClient  = await pool.query("INSERT INTO clientincomedata(client_email,client_name,incomePerAnnum,savingsPerAnnum) VALUES($1,$2,$3,$4) RETURNING *",[client_email,client_name,incomePerAnnum,savingsPerAnnum]);
        res.json(newClient.rows[0]);
    }catch(err){
        console.log(err.message);
    }
});

// Validate all and send invalid data to data collector
app.post('/validateAll',async(req,res) => {
    try{
        const inValid = await pool.query("SELECT * FROM clientincomedata WHERE savingsPerAnnum > incomePerAnnum");
        res.send(inValid);
    }catch(err){
        console.log(err.message);
    }
});


// app.post('/sendmessage',async (req,res)=>{


//     var options = {authorization : process.env.API_KEY , message : `Your Details : ${req.body.message}` ,  numbers : [req.body.number]};
//     const response =  await fast2sms.sendMessage(options); //Asynchronous Function.
//     res.send(response);
// });

// app.get('/',(req,res)=>{
//     res.render('index.ejs');
// })

app.listen(port,()=>{
    console.log(`Server is listening at port : ${port}`);
});