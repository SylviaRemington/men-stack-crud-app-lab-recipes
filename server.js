// MY LAB SUBMISSION FOR GENERAL ASSEMBLY - MEN STACK CRUD APP LAB RECIPES

// NOTE TO PURVI: I put a lot of notes on this first app so that I could reference it in the future 
// in case I forget certain steps or need future clarification. These notes are more for me.
// I plan on having cleaner code after this lab/lesson (from this point forward).

// SERVER.JS
// FUNCTIONALITY JS BASIC CODING OF APP, IMPORTS, CREATING APP, CONNECTING TO DB, ROUTES


// -----------------------------IMPORTS------------------------------------------------------------
// ALL IMPORTS AT TOP (with dotenv at the most top so environmental variables working through all of this.)
const dotenv = require('dotenv'); //initializing in JS
dotenv.config(); //This gives us access to process.evn.MONGODB_URI
const port = 3000; //can add this but not necessary
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override'); //for overriding http methods as browser only makes POST & GET by default
const morgan = require('morgan'); //for logging incoming requests
//Do we not need require ejs because express automatically is designed to find it? I think so, but not totally sure.

//---------------------------IMPORTING MODEL-------------------------------------------------------
//Importing the model into server.js
const Recipe = require('./models/recipes.js')


// -----------------------------CREATING APP-------------------------------------------------------
// Creating the app using Express, so can build out routes, handle requests & send responses
const app = express();


// ------------------------MONGOOSE CONNECT METHOD-------------------------------------------------
// MongoDB Connection - connection to the database //also connecting via mongoose gives more feedback vs try catch 
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}`)
});


// ---------------------------------MIDDLEWARE-----------------------------------------------------
// Middleware (put all middleware above any routes) - 
// To access the data in express so can submit form from new.ejs, 
// we need to use middleware specifically express.urlencoded
// app.use allows us to plug additional functionality into express. It basically extends the capabilities of our app.
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method')); //once we get this working we can comment it out for post method, etc.
app.use(morgan('dev'));

//------------------------------------ROUTES-------------------------------------------------------

// TEST ROUTE TO CONFIRM SERVER IS WORKING PROPERLY
// app.get('/', async (req, res) => {
//     res.send('Hello, supahstaaaars!'); //Checking if communicating with browser is working.
// });

// -------------------------------- GET ROUTES ----------------------------------------------------

// OUR HOMEPAGE ROUTE
app.get('/', async (req, res) => {
    res.render('index.ejs'); //sends back some html from index.ejs to populate the homepage
});


// FIRST VERSION of GET ROUTE for /recipes
// READ PART OF CRUD
// app.get("/recipes", (req, res) => {
//     res.send('Welcome to the index page!');
// });
// SECOND VERSION of GET ROUTE for /recipes
    // app.get("/recipes", async (req, res) => {
    //     const allRecipes = await Recipe.find();
    //     console.log(allRecipes);
    //     res.send('Welcome to the index page!');
    // });
// THIRD VERSION of GET ROUTE for /recipes
    app.get("/recipes", async (req, res) => {
        //gets all the recipes from the database and passes it into the index-pg template (READ part of CRUD), & passes them as something called recipes
        const allRecipes = await Recipe.find();
        console.log(allRecipes);
        res.render('recipes/index-pg-all-recipes.ejs', { recipes: allRecipes }); //rendering out the html from that link & its passing data from the mongoDB
    });


app.get('/recipes', async (req, res) => {
    try {
        const allRecipes = await Recipe.find();
        res.render('recipes/index.ejs', { recipes: allRecipes });
    } catch (err) {
        res.status(500).send('Error loading recipes.');
    }
});

// GET ROUTE FOR /recipes/new
//Testing the route for the new.ejs page
// app.get('/recipes/new', (req, res) => {
//     res.send('This route sends the user to a form page for adding a new yummy recipe!');
// });
// This shows us that form from new.ejs //It doesn't fetch any data, just returning our html form file
app.get('/recipes/new', (req, res) => {
    res.render('recipes/new.ejs');
});

// GET ROUTE FOR /recipes/:recipeId
// CREATING DYNAMIC ROUTE FOR SHOWPAGES
// READ PART OF CRUD

// FIRST VERSION BEFORE CHANGED IT TO WHAT I HAVE BELOW THIS
// app.get("/recipes/:recipeId", (req, res) => {
//     res.send("Show Page");
    // res.send(`This route renders the show page for recipe id: ${req.params.recipeId}!`);
// })

// SECOND VERSION BEFORE CHANGED TO THIRD VERSION BELOW
// This dynamic get route below is talking to the database, finding id, and showing recipe on the showpage
// app.get("/recipes/:recipeId", async (req, res) => {
//   const foundRecipe = await Recipe.findById(req.params.recipeId);
//   res.send(`This route renders the show page for recipe name: ${foundRecipe.name}!`);
//   res.render("recipes/show.ejs", { recipe: foundRecipe });
// });

//THIRD VERSION
app.get("/recipes/:recipeId", async (req, res) => {
    const recipeId = req.params.recipeId;
    const foundRecipe = await Recipe.findById(recipeId);
    res.render("recipes/show.ejs", { recipe: foundRecipe });
    // pass that info from the recipeId from the database to the show page, and pass in the data as something called recipe.
});

// EDIT - first version of getting edit route before updated it
// app.get("/recipes/:recipeId/edit", (req, res) => {
//     res.send(`This is the edit page for ${req.params.recipeId}!`);
// });

// EDIT - second version of getting edit route // Now have gotten the recipe from the database
// GET localhost:3000/recipes/:recipeId/edit
// app.get("/recipes/:recipeId/edit", async (req, res) => {
//     const foundRecipe = await Recipe.findById(req.params.recipeId);
//     console.log(foundRecipe);
//     res.send(`This is the edit route for ${foundRecipe.name}`);
// });

// EDIT - third version of getting edit route
app.get("/recipes/:recipeId/edit", async (req, res) => {
    //getting the fruit from the database below
    const foundRecipe = await Recipe.findById(req.params.recipeId);
    // Now,taking that data above and rendering it into a form via edit.ejs & passing in the data
    // We render out this recipes/edit.ejs, passing in the data.
    res.render("recipes/edit.ejs", {
    recipe: foundRecipe,
  });
});

// -------------------------------- POST ROUTES ----------------------------------------------------

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

// POST ROUTE for /recipes
// This handles the html and posts it from the new.ejs form
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


// -------------------------------- PUT ROUTES ----------------------------------------------------

// UPDATING FUNCTIONALITY
// To update a route, we would need the recipeId, a get route to get the edit page, put route to update it, need to create an update form for UI & make a new ejs, 
// So need: a form for the UI, we need a way to get to that form via a GET REQUEST, we need a method to respond to submitting the form aka a PUT REQUEST METHOD, & then redirect once completed.

// first version
// app.put("/recipes/:recipeId", async (req,res) => {
//     console.log(req.body);
//     req.body.isFavoriteRecipe = req.body.isFavoriteRecipe === 'on';
//     req.body.isDelicious = req.body.isDelicious === 'on';
//     res.send('some message');
// });

// second version
app.put("/recipes/:recipeId", async (req,res) => {
    const recipeId = req.params.recipeId;
    req.body.isFavoriteRecipe = req.body.isFavoriteRecipe === 'on';
    req.body.isDelicious = req.body.isDelicious === 'on';
    // res.send('some message');

    await Recipe.findByIdAndUpdate(recipeId, req.body);

    res.redirect(`/recipes/${recipeId}`);
});

// -------------------------------- DELETE ROUTES ----------------------------------------------------

// Defining the delete route - done first
// app.delete("/recipes/:recipeId", (req, res) => {
//   res.send("This is the delete route");
// });

// Then with recipe id, we need to find it in the database, and then delete it, 
// and then after redirect to a new page or confirmation it was deleted.

// Creating the delete route functionality
// One Version:
// app.delete("/recipes/:recipeId", async (req, res) => {
//   await Recipe.findByIdAndDelete(req.params.recipeId);
//   res.redirect("/recipes");
// });

// Another version could use:
app.delete("/recipes/:recipeId", async (req, res) => {
    // get the id of the recipe from the URL (endpoint)
    const recipeId = req.params.recipeId;

    // delete it from the database
    await Recipe.findByIdAndDelete(recipeId);

    // then redirect & go to the /recipes page via GET /recipes
    res.redirect("/recipes");
});


// --------------Starts the app and tells it to listen for requests on PORT (3000)-----------------
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`);
})

