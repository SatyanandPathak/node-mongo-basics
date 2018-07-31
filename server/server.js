require('./config/config');


const express = require('express');
const bodyParser = require('body-parser'); // Parse 
const _ = require('lodash'); // Utility
const JWT = require('jsonwebtoken'); // JWT to generate token
const bcrypt = require('bcryptjs'); // Module used to encrypt a password before saving to Mongo

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');
var {authenticate} = require('./middleware/authenticate'); // Middleware for authenticating a token for a user 

const port = process.env.PORT;

var app = express();

const internalServerError = {desctiption: 'Internal Server error'}

// Configure the middleware for getting JSON
app.use(bodyParser.json());

app.get('/', (request, response) => {
    response.send('Home Page.');
});





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
 * Get a specifi user using a token. authenticate middleware is called
 */
app.get('/users/me', authenticate, (request, response) => {
    // This calls authenticate before and if success request is populated with user and token
    return response.send(request.user);
});

/**
 * Get all the users
 */

 app.get('/users', (request, response) => {
     User.find()
     .then(users => response.status(200).send({users}))
     .catch(e => response.status(500).send(internalServerError))
 });

 /**
  * Create a new user
  */
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
  * Post user login
  */

  app.post('/users/login', (request, response) => {
      var body = _.pick(request.body, ['email', 'password']);

      User.findByCredentials(body.email, body.password)
      .then(user => {

        user.generateAuthToken()
        .then(token => {
            return response.header('x-auth-token', token).send({user});
        })
      })
      .catch(e => {
        return response.status(401).send({message: e});
      });
  });

  /**
   * Delete token. Logout
   */

   app.delete('/users/me/token', authenticate, (request, response) => {
    request.user.removeToken(request.token)
    .then(() => {
        response.status(202).send({message: 'User successfully logged out. Session Token deleted'});
    })
    .catch(e => response.status(400).send(e));

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

