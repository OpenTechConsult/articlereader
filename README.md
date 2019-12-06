
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

