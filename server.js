// IMPORTS
// ALL IMPORTS AT TOP (with dotenv at the most top so environmental variables working through all of this.)
const dotenv = require('dotenv'); //initializing in JS
dotenv.config(); //This gives us access to process.evn.MONGODB_URI
const port = 3000; //can add this but not necessary
const express = require('express');
const mongoose = require('mongoose');
//Do we not need require ejs because express automatically is designed to find it? I think so, but not totally sure.

//IMPORTING MODEL
//Importing the model into server.js
const Recipe = require('./models/recipes.js')


// CREATING APP
// Creating the app using Express, so can build out routes, handle requests & send responses
const app = express();


// MONGOOSE CONNECT METHOD
// MongoDB Connection - connection to the database //also connecting via mongoose gives more feedback vs try catch 
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
});


// MIDDLEWARE
// Middleware (put all middleware above any routes) - 
// To access the data in express so can submit form from new.ejs, 
// we need to use middleware specifically express.urlencoded
// app.use allows us to plug additional functionality into express. It basically extends the capabilities of our app.
app.use(express.urlencoded({ extended: false }));


// ROUTES

// TEST ROUTE TO CONFIRM SERVER IS WORKING PROPERLY
// app.get('/', async (req, res) => {
//     res.send('Hello, supahstaaaars!'); //Checking if communicating with browser is working.
// });

// GET ROUTES
app.get('/', async (req, res) => {
    res.render('index.ejs');
});

app.get("/recipes", (req, res) => {
    res.send('Welcome to the index page!');
});

//Testing the route for the new.ejs page
// app.get('/recipes/new', (req, res) => {
//     res.send('This route sends the user to a form page for adding a new yummy recipe!');
// });
app.get('/recipes/new', (req, res) => {
    res.render('recipes/new.ejs');
});

app.get('/recipes', async (req, res) => {
    try {
        const allRecipes = await Recipe.find();
        res.render('index.ejs', { recipes: allRecipes });
    } catch (err) {
        res.status(500).send('Error loading recipes.');
    }
});

// POST ROUTES
// Need to set up post method route so that new.ejs can submit html forms
// Setting up A CREATE ROUTE / we're setting up a post handler for a POST ROUTE
// FIRST POST VERSION BELOW & THEN CHANGED IT TO NEXT VERSION BELOW:
// app.post('/recipes', async (req, res) => {
//     console.log(req.body);
    // Api functions work in async method and need to complete & do something before move on. 
    // Our api methods need to send something back in order to complete and move onto the next thing. 
    // Thus res.redirect below:
//     res.redirect("/recipes/new");
// });

app.post('/recipes', async (req, res) => {
    try {
        // Convert checkboxes from "on"/undefined to true/false
        req.body.isFavoriteRecipe = req.body.isFavoriteRecipe === 'on';
        req.body.isDelicious = req.body.isDelicious === 'on';
        //This line checks if the checkbox value is exactly "on" — 
        // if it is, it saves true; if it's missing (undefined) or anything else, 
        // it saves false.

        // Save the new recipe to the database
        await Recipe.create(req.body);

        // Redirect to the recipes list page after saving
        res.render('recipes/new.ejs', { success: true });

    } catch (err) {
        // If something goes wrong (like a missing field), log the error
        console.log('Error saving recipe:', err);

        // Show a server error in the browser
        res.status(500).send('Something went wrong while saving the recipe.');
    }
});


// Starts the app and tells it to listen for requests on PORT (3000)
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})

