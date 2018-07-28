const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

const port = process.env.PORT || 3000;

var app = express();

// Configure the middleware for getting JSON
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('Home Page.');
});

// Get all Todos
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

// Get a TODO by Id
app.get('/todos/:id', (request, response) => {

    const id = request.params.id;
    if(!ObjectID.isValid(id)){
        return response.status(400).send({message: 'Id not valid'});
    }
    Todo.findById(id)
    .then((todo) => {
        if(!todo){
            return response.status(404).send({message: 'Could not find a todo'});
        }

        response.status(200).send({todo});
    })
    .catch(e => response.status(500).send({'message':'Internal Server Error'}));
    
})


// POST a TODO
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

// Delete route handler
app.delete('/todos/:id', (request, response)=> {
    const id = request.params.id;
    
    if(!ObjectID.isValid(id)){
        return response.status(400).send({'description': 'Invalid id'});
    }

    Todo.findByIdAndRemove(id)
    .then((todo) => {
        if(!todo){
            return response.status(404).send({'description': 'Id does not exists'});
        }
        return response.status(200).send({todo});
    })
    .catch(e => response.status(500).send(e));
})

// Update todo. Can use PUT or PATCH
app.patch('/todos/:id', (request, response) => {
    var id = request.params.id;
    // No need to pick all the invalid content that is not supported for update
    var body = _.pick(request.body, ['completed', 'text'])

    if(!ObjectID(id)){
        return response.status(404).send({description: 'Id format not supported'});
    }
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(new ObjectID(id), {$set: body}, {new: true})
    .then((todo) => {
        if(!todo){
            return response.status(404).send({description: 'Id not found'});
        }
        return response.status(204).send(todo);
    })
    .catch(e => response.status(500).send({description: 'Internal Server Error'}));

    
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

module.exports = {app};

