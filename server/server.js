require('./config/config');
var {authenticate} = require('./middleware/authenticate');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

const port = process.env.PORT;

var app = express();

const internalServerError = {desctiption: 'Internal Server error'}

// Configure the middleware for getting JSON
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('Home Page.');
});


// Private Route
app.get('/users/me', authenticate, (request, response) => {
    // This calls authenticate before and if success request is populated with user and token
    return response.send(request.user);
})


// Generate token for a user
/*app.post('/token', (request, response) => {

    var body = _.pick(request.body, ['email', 'password']);
    var hashedPassword;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(body.password, salt, (err, hash) => {
            hashedPassword = hash;
        })
    });
    body.password = hashedPassword;
    var user = new User(body);

    User.findOne({email: body.email})
    .then((user) => {
        console.log('user obtained is==', user)
        var id = user._id;
        var access = 'auth';
        var token = JWT.sign({_id: id.toHexString(), access}, 'secretsalt').toString();
      
        response.send({token});
    })
    
    
});*/

/**
 * Users Route Handlers
 */

 app.get('/users', (request, response) => {
     User.find()
     .then(users => {

        console.log('response is===', JSON.stringify(users));
        console.log('normal response is==', users);
         response.status(200).send({users});
     })
     .catch(e => response.status(500).send(internalServerError))
 });

 app.post('/users', (request, response) => {
    var body = _.pick(request.body, ['email', 'password']);
    var user = new User(body);
    
    user.save()
    .then(() => {
        return user.generateAuthToken();
        //return response.status(201).send({user})
    })
    .then((token) => {

        return response.header('x-auth-token', token).status(201).send(user)
    })
    .catch(e => response.status(400).send({description: `${e}`}))
 });

 

/**
 * Todos Route handlers
 */
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
        return response.status(200).send({todo});
    })
    .catch(e => response.status(500).send({description: 'Internal Server Error'}));

    
});

app.listen(port, () => {
    console.log(`Server started at port ${port}`);
});

module.exports = {app};

