const { urlencoded } = require('express');
const express = require('express');
const fast2sms = require('fast-two-sms')
const app = express();
const cors = require("cors");
const pool = require('./db')
require('dotenv').config();
const port = 3000;


// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


// Middleware Methods

// Validate data  middleware - Task 3
function validateData(req, res, next) {
    const { incomePerAnnum, savingsPerAnnum, mobileNumber } = req.body;

    if (incomePerAnnum < savingsPerAnnum) {
        res.send("Invalid Data Savings cannot be more than Income");
    }
    else if(isNaN(mobileNumber)){
        res.send("Invalid mobile number, only digits are acceptable");
    }
    else if(mobileNumber.length!==10){
        res.send("Invalid mobile number, should be of 10 digits");
    }
    next();
};

// Send SMS middleware - task 4
async function SMS(req, res) {
    try {
        const { client_email, client_name, incomePerAnnum, savingsPerAnnum, mobileNumber } = req.body;
        var options = { authorization: process.env.API_KEY, message: ` Your Details :\n Email ID :${client_email}\n Name : ${client_name}\n Income Per Annum: ${incomePerAnnum}\n Savings Per Annum: ${savingsPerAnnum}\n Contact : ${mobileNumber}\n Thankyou for your response`, numbers: [mobileNumber] };
        const response = await fast2sms.sendMessage(options); //Asynchronous Function.
        res.send(response.message);
    } catch (err) {
        res.send("Failed to send SMS to the Client");
    }
}


//Routes


// Validate while insertion of a new client details - task 3
app.post('/validateNew', validateData , async (req, res) => {
    try {
        const { client_email, client_name, incomePerAnnum, savingsPerAnnum, mobileNumber } = req.body;
        const newClient = await pool.query("INSERT INTO clientincomedata(client_email,client_name,incomePerAnnum,savingsPerAnnum,mobileNumber) VALUES($1,$2,$3,$4,$5) RETURNING *", [client_email, client_name, incomePerAnnum, savingsPerAnnum, mobileNumber]);
        res.json(newClient.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
});

// Validate all and send invalid data to data collector - task 3
app.post('/validateAll', async (req, res) => {
    try {
        const inValid = await pool.query("SELECT * FROM clientincomedata WHERE savingsPerAnnum > incomePerAnnum");
        res.send(inValid);
    } catch (err) {
        console.log(err.message);
    }
});

// Send Message after a response - task 4
app.post('/sendmessage', SMS,(req,res)=>{});

app.listen(port, () => {
    console.log(`Server is listening at port : ${port}`);
});