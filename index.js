const express = require('express')
const app = express()
const articles = [{ title: 'Example'}];
const bodyParser = require('body-parser');
const read = require('node-readability');
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

        res.format({
            html: () => {
                res.render('articles.ejs', { articles: articles });
            }, 
            json: () => {
                res.send(articles);
            }
        });
        
    });

    
});

// creates an article
app.post('/articles', (req, res, next) => {

    // gets the URL from the post body
    const url = req.body.url;
    // console.log(url);

    // use the readability module to fetch the url
    read(url, (err, result) => {
        if (err || !result) res.status(500).send('Error downloading article');
        Article.create(
            { title: result.title, content: result.content}, 
            (err, article) => {
                if (err) return next(err);
                res.format({
                    html: () => {
                        res.render('article.ejs', { message: 'ok' });
                    }, 
                    json: () => {
                        res.send('OK');
                    }
                });
            }
        );
    });
});

// gets a single article
app.get('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    // Find a specific article
    Article.find(id, (err, article) => {
        if (err) return next(err);
        res.format({
            html: () => {
                res.render('article.ejs', { article: article });
            }, 
            json: () => {
                res.send(articles);
            }
        });
    });
});


// deletes an article
app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    Article.delete(id, (err) => {
        if (err) return next(err);
        res.format({
            html: () => {
                res.render('article.ejs', { message: 'Deleted' });
            }, 
            json: () => {
                res.send({ message: 'Delete' });
            }
        });
    });
});
app.listen(app.get('port'), 
        () => console.log(`App started on port, `, app.get('port')));
module.exports = app;