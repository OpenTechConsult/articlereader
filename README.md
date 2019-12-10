
# Create a RESTFul API with Node.js and Express

In our journey on learning Node.js, here we are, about to create a RESFul API using Node.js and Express.js a popular Node framework.
The project is about a RESFul web service that allows articles to be created and saved in a similar way to Instapaper and Pocket. It'll use a module that was inspired by the original readability service to turn messy web pages into elegant articles that can be read later.

## Design

When designing a RESFul web service, we need to think about which operations we need, and map them to routes in Express. In our case, we need to :

- to be able to save articles,
- fetch the articles so they can be read
- fetch a list of all of them
- delete article we no longer need

The operations map to theses routes

- POST /articles         --> create a new article
- GET /articles/:id      --> get a single article
- GET /articles          --> get all articles
- DELETE /articles/:id   --> delete an article
  
Before getting into topics such database and web interface, web will create RESTFul resources with Express.
We then use cURL to make requests to get the results back. We then move on to complicated tasks such us storing data make it feel like real application.

## Implementing the Add article features

In the last commit, the code that we wrote is unable to create an article. The main reason is that implementing a POST request involve body parsing .

A body parser knows how accept a MIME ( Multipurpose Internet Mail Extensions) encoded POST request bodies and turns them into data we can exploit, usually in JSON format.

We need to remind to ourselves that whenever we submitted a form on a website, a body parser has been involved somewhere in the server side.

To add the official supported body parser we run the command
`npm install --save body-parser`

## Adding a database

We are close to build a real web application. We need a way to save data permanently in the database,
and way to generate the readable version of article found on the web.

The process of adding a database usually involve the following steps:

1. Decide on the database you want to use
2. choose the popular module on npm that implement a driver or ORM
3. add the module to the project with npm --save
4. create models that wrap database access services
5. add the models to our Express routes

Let's move backward by starting with the step 5 : add model to our express routes.
Let's focus on express by designing the route handling code. The HTTP route handlers will make simple calls to the database models. Here is an exemple

```js
app.get('/articles', (req, res, err) => {
Article.all((err, articles) => {
if(err) return next(err);
res.send(articles);
}));
```

> Here the HTTP route GET is getting all articles, so the Model should call something like Article.all. This will vary depending on the database API. Typical examples are `Article.find({}, cb)` and `Article.fetchAll().then(cb).

## Making our own Model API

We are now going to create our Article Model API. Articles should be created, retrieved, and deleted. Therefore we need the following methods for an Article model class.

- Article.all(cb)  : Return all articles
- Article.find(id, cb) : Given an ID, find the corresponding article
- Article.create({ title, content }, cb) : Create an article with a title and content
- Article.delete(id, cb) : Delete an article by ID.

We can implement all these methods with the sqlite3 module. This module allows us to fetch multiple rows with `db.all()` and a single row with `db.get()`

But first we need a database connection.

### Adding the Article model to the HTTP routes

Now that the basics database functionality is ready, we need to add it to the HTTP routes. The modifications in the index.js page shows how to add each method except for the  POST. We will deal with that separately because it needs to use the readability module. What we need perform are:

- load the db.js module
- use the module to fetch all articles,
- use the module to find a specific article,
- use the module to delete an article.

## Making articles readable and saving them for later

Final thing to do is to add support for creating an Article. For that we need to download the all the article and process them through the readability algorithm. We are going to code that convert web page into simplified **reader view** versions. We will implement this using a module **node-readability** from npm.

The node-readability provides an asynchronous function that downloads a URL and turns HTML into a simplified representation.

The following snippet shows how node-readability is used.

```js
const read = require('node-readability');
const url = 'http://www.manning.com/cantelon2/';
read(url, (err, result) => {
    // result has .title and .content
});
```

The node-readability module can be used with our database class to save articles with the `Article.create` method.

```js
const read = require('node-readability');
const url = 'http://www.manning.com/cantelon2/';
read(url, (err, result) => {
    Article.create(
        { title: result.title, content: result.content},
        (err, article) => {
            // Article saved to the database.
        }
    )
});
```

## ADDING A USER INTERFACE

There are several things to consider when we want to add a web interface to an express project. They are as follow :

1. modify the router handlers methods respond with both JSON and HTML format
2. choose and use a template engine (install and render template)
3. serve static files (such as CSS)

### 3.4.1 Supporting multiple formats

Up until now, we've use `res.send()` to send JSON back to the client. We used [**cURL**](https://curl.haxx.se/) to make request, and JSON was a perfect fit for that. But the application needs to support HTML as well. So we need a way to render HTML also. How do we support both ?

The basic technique is to use `res.format()` method provided by Express. It allows the application to respond with the right format based the request. To use it, we provide a list of formats with function that respond the desired way.

```js
res.format({
    html: () => {
        res.render('articles.ejs', { articles: articles });
    },
    json: () => {
        res.send(articles);
    }
});
```

In the snippet above, `res.render` will render the **articles.ejs** in the __view__ folder. But first we need to install the template engine.

### 3.4.2 Rendering templates

Among the array of template engines available, we choose **EJS** (Embedded JavaScrit). To install EJS module from npm, type the following :

`npm install ejs --save`

Now res.render can render HTML files formated with EJS. If we replace for instance the res.send(articles) in the app.get('/articles') route handler with the new res.format(...) code, and then we open http://localhost:3000/articles from the browser, it should attempt to render articles.ejs.

We need to create the __articles.ejs__ template in the __**view**__. Below is a full template that we can use

```html
<% include head %>
<ul>
    <% articles.forEach((article) => { %>
        <li>
            <a href="/articles/<%= article.id %>">
                <%= article.title %>
            </a>
        </li>
    <% })%>
</ul>
```
