const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


var app = express();

// Configure the middleware for getting JSON
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('Home Page.');
});


app.get('/todos', (request, response) => {

    Todo.find()
    .then((todos) => {
        // ES6 format sending json todos: todos
        response.send({todos})
    })
    .catch(e => {
        response.status(400).send(e);
    });
});

app.post('/todos', (request, response) => {
    console.log(request.body);
    var todo = new Todo({
        text: request.body.text
    });
    todo.save().then((doc) => {
        response.status(200).send(doc);
    }).catch(e => {
        response.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Server started at port 2000');
});

module.exports = {app};

