const express = require('express')
const app = express()
const articles = [{ title: 'Example'}];
const bodyParser = require('body-parser');
// load the database module
const Article = require('./db').Article;

// define the default port for the express web app
app.set('port', process.env.PORT || 3000);

// add support to request body encoded as JSON
app.use(bodyParser.json());

// add support to forms encoded bodies
app.use(bodyParser.urlencoded({ extended: true}));

// gets all articles
app.get('/articles', (req, res, next) => {
   
    // this is an example of express http route handler making a call
    // to the database model. 
    // Fetches all articles
    Article.all((err, articles) => {
        if (err) return next(err);
        res.send(articles);
    });
});

// creates an article
app.post('/articles', (req, res, next) => {
    const article = { title: req.body.title };
    articles.push(article);
    res.send(article);
});

// gets a single article
app.get('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    // Find a specific article
    Article.find(id, (err, article) => {
        if (err) return next(err);
        res.send(article);
    });
});


// deletes an article
app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    Article.delete(id, (err) => {
        if (err) return next(err);
        res.send({ message: 'Delete' });
    });
});
app.listen(app.get('port'), 
        () => console.log(`App started on port, `, app.get('port')));
module.exports = app;