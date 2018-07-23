// const MongoClient = require('mongodb').MongoClient;

// ES6 Destructuring. Its same as code above. Create a variable called MongoClient 
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// Connect to Mongo DB
MongoClient.connect(
    'mongodb://localhost:27017/TodoApp', 
    { useNewUrlParser: true }, 
    (error, client) => {
        if(error){
            return console.log('Unable to connect to MOngo DB server');
        }
        console.log('connected to Mongo DB Server');
        const todoAppDB = client.db('TodoApp');
        const usersDB = client.db('Users');

        // todoAppDB.collection('Todos').insertOne({
        //     text: 'Something to do',
        //     completed: false
        // }, (error, result) => {
        //     if(error){
        //         return console.log('Unable to insert Todo', error);
        //     }
        //     console.log(JSON.stringify(result.ops, undefined, 2));
        // });

        // usersDB.collection('Users').insertOne({
        //     name: 'Satyanand Pathak',
        //     age: 25
        // }, (error, result) => {
        //     if (error){
        //         return console.log('Unable to create user', error);
        //     }
        //     console.log(JSON.stringify(result.ops, undefined, 2));
        //     console.log(result.ops[0]._id.getTimestamp());
        // });

        client.close();

});


