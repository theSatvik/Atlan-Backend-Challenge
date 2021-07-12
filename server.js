const { urlencoded } = require('express');
const express = require('express');
const app = express();
const port = 3000; 

app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');

app.get('/',(req,res)=>{
    res.render('index.ejs');
});


app.listen(port,()=>{
    console.log(`Server is listening at port : ${port} `);
});