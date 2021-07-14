const { urlencoded } = require('express');
const express = require('express');
const fast2sms = require('fast-two-sms')
const app = express();
const cors = require("cors");
const pool = require('./db');
var fileSystem = require("fs");
var fastcsv = require("fast-csv");
const translate = require("translate");
translate.engine = "google";
translate.key = process.env.TRANSLATE_KEY;

require('dotenv').config();
const port = 3000;

// Middlewares

app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


// Middlewares

// Find slang in local language - Task 1
function findSlang(req, res, next) {
    console.log(req.query);
    try{
        const text = await translate(req.query.word, req.query.lang);
        // e.g. req.query.lang = 'hi' (Hindi) 
        // req.query.word = "Awesome" (English - auto detection)
        res.send(text); // Jhakaas
    }
    catch(err){
        res.send(err.message); 
    }
    next();
};


// Validate data middleware - Task 2
function validateData(req, res, next) {
    const { income_per_annum, savings_per_annum, mobile_number } = req.body;

    if (income_per_annum < savings_per_annum) {
        res.send("Invalid Data Savings cannot be more than Income");
    }
    else if (isNaN(mobile_number)) {
        res.send("Invalid mobile number, only digits are acceptable");
    }
    else if (mobile_number.length !== 10) {
        res.send("Invalid mobile number, should be of 10 digits");
    }
    next();
};

// Export data in csv - Task 3
async function exportCSV(req, res) {
    try {
        let data = await pool.query("SELECT * FROM client_income_data");
        data = data.rows;

        var file = fileSystem.createWriteStream("public/data.csv");
        fastcsv
            .write(data, { headers: true })
            .on("finish", function() {
 
                res.send("<a href='/public/data.csv' download='data.csv' id='download-link'></a><script>document.getElementById('download-link').click();</script>");
            })
            .pipe(file);

    } catch (err) {
        console.log(err.message);
    }
}

// Send SMS middleware - task 4
async function SMS(req, res) {
    try {
        const {client_email, client_name, income_per_annum, savings_per_annum, mobile_number} = req.body;
        var options = { authorization: process.env.API_KEY, message: ` Your Details :\n Email ID :${client_email}\n Name : ${client_name}\n Income Per Annum: ${income_per_annum}\n Savings Per Annum: ${savings_per_annum}\n Contact : ${mobile_number}\n Thankyou for your response`, numbers: [mobile_number] };
        const response = await fast2sms.sendMessage(options); //Asynchronous Function.
        res.send(response.message);
    } catch (err) {
        res.send("Failed to send SMS to the Client");
    }
}


//Routes

// Find slang in local language - task 1
app.get('/getSlang',findSlang, (req, res) => {});

// Validate while insertion of a new client details - task 2
app.post('/validateNew', validateData, async (req, res) => {
    try {
        const { client_email, client_name, income_per_annum, savings_per_annum, mobile_number } = req.body;
        const newClient = await pool.query("INSERT INTO client_income_data(client_email,client_name,income_per_annum,savings_per_annum,mobile_number) VALUES($1,$2,$3,$4,$5) RETURNING *", [client_email, client_name, income_per_annum, savings_per_annum, mobile_number]);
        res.json(newClient.rows[0]);
    } catch (err) {
        res.send(err.message);
    }
});

// Validate all and send invalid data to data collector - task 2
app.get('/validateAll', async (req, res) => {
    try {
        let inValidRows = await pool.query("SELECT * FROM client_income_data WHERE savings_per_annum > income_per_annum");
        inValidRows = inValidRows.rows;
        if(inValidRows.length === 0)
        {
            res.send("All records are Valid");
        }
        else {
            res.send(inValidRows);
        }
    } catch (err) {
        console.log(err.message);
    }
});

// Get data into csv - task 3
app.get('/getCSV', exportCSV, (req, res) => { });


// Send Message after a response - task 4
app.post('/sendmessage', SMS, (req, res) => { });

app.listen(port, () => {
    console.log(`Server is listening at port : ${port}`);
});