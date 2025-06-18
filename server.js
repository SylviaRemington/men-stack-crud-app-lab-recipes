const express = require('express');

const app = express();

const port = 3000; //can add this but not necessary

// app.get('/', async (req, res) => {
//     res.send('Hello, supahstaaaars!'); //Checking if communicating with browser is working.
// });

app.get('/', async (req, res) => {
    res.render('index.ejs');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
})

