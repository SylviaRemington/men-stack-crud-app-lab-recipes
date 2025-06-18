const dotenv = require('dotenv'); //initializing in JS
dotenv.config(); //This gives us access to process.evn.MONGODB_URI
const port = 3000; //can add this but not necessary
const express = require('express');
const mongoose = require('mongoose');
//Do we not need require ejs because express automatically is designed to find it? I think so, but not totally sure.

//Importing the model into server.js
const Recipe = require('./models/recipes.js')

const app = express();

// MongoDB Connection - connection to the database //also connecting via mongoose gives more feedback vs try catch 
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
});

// app.get('/', async (req, res) => {
//     res.send('Hello, supahstaaaars!'); //Checking if communicating with browser is working.
// });

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})

