// ALL IMPORTS AT TOP (with dotenv at the most top so environmental variables working through all of this.)
const dotenv = require('dotenv'); //initializing in JS
dotenv.config(); //This gives us access to process.evn.MONGODB_URI
const port = 3000; //can add this but not necessary
const express = require('express');
const mongoose = require('mongoose');
//Do we not need require ejs because express automatically is designed to find it? I think so, but not totally sure.


//Importing the model into server.js
const Recipe = require('./models/recipes.js')


// Creating the app using Express, so can build out routes, handle requests & send responses
const app = express();


// MongoDB Connection - connection to the database //also connecting via mongoose gives more feedback vs try catch 
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
});


// ROUTES

// TEST ROUTE TO CONFIRM SERVER IS WORKING PROPERLY
// app.get('/', async (req, res) => {
//     res.send('Hello, supahstaaaars!'); //Checking if communicating with browser is working.
// });

// GET ROUTES
app.get('/', async (req, res) => {
    res.render('index.ejs');
});

//Testing the route for the new.ejs page
// app.get('/recipes/new', (req, res) => {
//     res.send('This route sends the user to a form page for adding a new yummy recipe!');
// });

app.get('/recipes/new', (req, res) => {
    res.render('recipes/new.ejs');
});

// POST ROUTES




// Starts the app and tells it to listen for requests on PORT (3000)
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})

