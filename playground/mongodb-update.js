const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true }, (error, client) => {
    if(error){
        return console.log('could connect to mongo DB', error);
    }

    console.log('Connected to Mongo DB at port 27017');

    const todoAppDB = client.db('TodoApp');

    todoAppDB.collection('Users')
    .findOneAndUpdate(
        {_id: new ObjectID('5b561fde46b6cd278a0dd02c')}, 
        {$set: {name: 'Satyanand'}, $inc: {age: -1}}, 
        {returnOriginal: false})
    .then(result => {
        console.log(result);
    })
    .catch(e => {
        console.log(e);
    });
});