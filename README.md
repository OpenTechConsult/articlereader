
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

# Implementing the Add article features

In the last commit, the code that we wrote is unable to create an article. The main reason is that implementing a POST request involve body parsing .

A body parser knows how accept a MIME ( Multipurpose Internet Mail Extensions) encoded POST request bodies and turns them into data we can exploit, usually in JSON format.

We need to remind to ourselves that whenever we submitted a form on a website, a body parser has been involved somewhere in the server side.

To add the official supported body parser we run the command
`npm install --save body-parser`