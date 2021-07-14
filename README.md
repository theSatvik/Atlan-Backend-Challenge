![alt text](https://github.com/theSatvik/Atlan-Backend-Challenge/blob/main/media/atlan-logo.jpg "Atlan")



# Atlan-Backend-Challenge

## :bookmark_tabs: What’s In This Document

- [Task 1](#rocket-task-1-great-task)
- [Task 2](rocket-task-2)
- [Task 3](#rocket-task-3)
- [Task 4](#rocket-task-4)
- [Dependencies Used](#ballot_box-dependencies-used)
- [License](#memo-license)
- [Thanks to Contributors and Sponsors](#purple_heart-thanks)

 

## :rocket: Task 1 (Great Task)
 ```shell
One of our clients wanted to search for slangs (in local language) for an answer to a text question
on the basis of cities (which was the answer to a different MCQ question).

Or 

Create a Middleware which should return slangs(in some other given language) of a word.

```
### Various Approches/ideas : -
1. **DataBase(SQL) approach :-** 
    - **We can create an API or a DataBase(SQL) to map the word(or Answer) to slangs in other languages**
     - Two DB Tables :
         
         A. TABLE wordlang
          
            | word_ID | word | lang |
            | :-----: | :-: | :-: |
            | 1       | "Awesome" |  "HI" |
            
          B. TABLE wordslang
          
          
            | lang_ID | word | slang |
            | :-----: | :-: | :-: |
            |  "HI"   | "Awesome" |  "Jhakaas" |
            
     Note :  To create such type of Database the number of records could be very high and hence throughput will not be as required.
     
2. **Translation API approach :-**
      - **We can use google translate API [Click to translate](https://translate.google.co.in/) to find slangs of the given word efficiently**

## :rocket: Task 2 
 ```shell
A market research agency wanted to validate responses coming in against a set of business rules 
(eg. monthly savings cannot be more than monthly income) and send the response back to the data collector 
to fix it when the rules generate a flag.

Or

Create a Middleware to validate responses and send back to data collector to fix invalid responses.

```
### Various Approches/ideas : -
1. **Middleware approach   :-** 
    - **Created a sample Postgres based relational database**
        - ```shell   
           CREATE DATABASE atlan;

            CREATE TABLE client_income_data(
                client_id SERIAL PRIMARY KEY,
                client_email VARCHAR(255),
                client_name VARCHAR(255), 
                income_per_annum FLOAT,
                savings_per_annum FLOAT,
                mobile_number VARCHAR(15)
            );   
         ```
    - **Route to validate while insertion**
        - ```shell   
                 // Validate data middleware sample
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
             ```   
        -   Route (POST Method) :  ```shell http://localhost:3000/validateNew ```
        -   ```shell  
                Route AJAX : 
               // Validate while insertion of a new client details 
                    app.post('/validateNew', validateData, async (req, res) => {
                        try {
                            const { client_email, client_name, income_per_annum, savings_per_annum, mobile_number } = req.body;
                            const newClient = await pool.query("INSERT INTO client_income_data(client_email,client_name,income_per_annum,savings_per_annum,mobile_number)       
                            VALUES($1,$2,$3,$4,$5) RETURNING *", [client_email, client_name, income_per_annum, savings_per_annum, mobile_number]);
                            res.json(newClient.rows[0]);
                        } catch (err) {
                            res.send(err.message);
                        }
                    });
             ```
    - **Route to validate All the records/responses  if missed to validate**    
        -   Route (GET method) :  ```shell http://localhost:3000/validateAll ```
        -   ```shell  
                Route AJAX : 
            // Validate all and send invalid data to data collector 
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
             ```
## :rocket: Task 3 
 ```shell
A very common need for organizations is wanting all their data onto Google Sheets, wherein they could
connect their CRM, and also generate graphs and charts offered by Sheets out of the box. In such cases,
each response to the form becomes a row in the sheet, and questions in the form become columns. 


Or

Create a Middleware to export data into sheets and download it.

```
### Various Approches/ideas : -
1. **Middleware approach   :-** 
    - **Using a sample Postgres based relational database**
        - ```shell   
           CREATE DATABASE atlan;

            CREATE TABLE client_income_data(
                client_id SERIAL PRIMARY KEY,
                client_email VARCHAR(255),
                client_name VARCHAR(255), 
                income_per_annum FLOAT,
                savings_per_annum FLOAT,
                mobile_number VARCHAR(15)
            );   
         ```
    - **Route to export and download **
        - ```shell   
                 async function exportCSV(req, res) {
                    try {
                        let data = await pool.query("SELECT * FROM client_income_data");
                        data = data.rows;
                        var file = fileSystem.createWriteStream("public/data.csv");
                        fastcsv
                            .write(data, { headers: true })
                            .on("finish", function() {
                                 res.send("<a href='/public/data.csv' download='data.csv' id='download-link'></a>
                                 <script>document.getElementById('download-link').click();</script>");
                            })
                            .pipe(file);
                    } catch (err) {
                        console.log(err.message);
                    }
                 }
             ```   
        -   Route (GET Method) :  ```shell http://localhost:3000/getCSV ```
       
## :rocket: Task 4 
 ```shell
A recent client partner wanted us to send an SMS to the customer whose details are
collected in the response as soon as the ingestion was complete reliably. The content
of the SMS consists of details of the customer, which were a part of the answers in 
the response. This customer was supposed to use this as a “receipt” for them having 
participated in the exercise


Or

Create a Middleware to send message to user/client after successfully recording a response.

```
### Various Approches/ideas : -
1. **Middleware approach  :-** 
    - **Using a sample Postgres based relational database**
        - ```shell   
           CREATE DATABASE atlan;

            CREATE TABLE client_income_data(
                client_id SERIAL PRIMARY KEY,
                client_email VARCHAR(255),
                client_name VARCHAR(255), 
                income_per_annum FLOAT,
                savings_per_annum FLOAT,
                mobile_number VARCHAR(15)
            );   
         ```
    - **Route to send SMS using fast-two-sms library**
        - ```shell   
                // Send SMS middleware -
                async function SMS(req, res) {
                    try {
                        const {client_email, client_name, income_per_annum, savings_per_annum, mobile_number} = req.body;
                        var options = { 
                            authorization: process.env.API_KEY, 
                            message: ` Your Details :\n 
                                        Email ID :${client_email}\n 
                                        Name : ${client_name}\n 
                                        Income Per Annum: ${income_per_annum}\n
                                        Savings Per Annum: ${savings_per_annum}\n
                                        Contact : ${mobile_number}\n
                                        Thankyou for your response`
                                        ,
                            numbers: [mobile_number] 
                            };
                        const response = await fast2sms.sendMessage(options); //Asynchronous Function.
                        res.send(response.message);
                    } catch (err) {
                        res.send("Failed to send SMS to the Client");
                    }
                }
             ```   
        -   Route (POST Method) :  ```shell http://localhost:3000/sendmessage ```
       

## :ballot_box: Dependencies Used
 ```shell
   "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "ejs": "^3.1.6",
    "express": "^4.17.1",
    "fast-csv": "^4.3.6",
    "fast-two-sms": "^3.0.0",
    "fs": "0.0.1-security",
    "pg": "^8.6.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
   ```

## :memo: License
Licensed under the [MIT License](./LICENSE).

## :purple_heart: Thanks
Thanks to all the smart people at Atlan for reviewing my project.
