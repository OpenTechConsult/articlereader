const express = require('express')
const app = express()
const articles = [{ title: 'Example'}];
const bodyParser = require('body-parser');

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
    Article.all((err, articles) => {
        if (err) return next(err);
        res.send(articles);
    });
    res.send(articles);
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
    console.log('Fetching:', id);
    res.send(articles[id]);
})


// deletes an article
app.delete('/articles/:id', (req, res, nex) => {
    const id = req.params.id;
    console.log('Deleting:', id);
    delete articles[id];
    res.send({ message: 'Deleted'});
});
app.listen(app.get('port'), 
        () => console.log(`App started on port, `, app.get('port')));
module.exports = app;