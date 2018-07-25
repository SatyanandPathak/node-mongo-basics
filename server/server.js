const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/Todo');
const {User} = require('./models/User');


var app = express();

// Configure the middleware for getting JSON
app.use(bodyParser.json());

// app.get('', (request, response) => {
//     response.render({name:'Satyanand'});
// });


app.get('/', (request, response) => {
    response.render('Hello world');
});

app.post('/todos', (request, response) => {
    console.log(request.body);
    var todo = new Todo({
        text: request.body.text
    });
    todo.save().then((doc) => {
        console.log('received success==', doc)
        response.status(200).send(doc);
    }).catch(e => {
        console.log('received error==', e);
        response.status(400).send(e);
    });
});




app.listen(3000, () => {
    console.log('Server started at port 2000');
});

