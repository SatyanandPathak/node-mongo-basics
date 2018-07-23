const {MongoClient, ObjectID} = require('mongodb');

console.log('trying to connect mongo db');

MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true }, (err, client) => {
    if (err){
        return console.log('unable to connect to Mongo DB');
    }
    console.log('Mongo DB connected.')

    const todoAppDB = client.db('TodoApp');

    /*todoAppDB.collection('Todos').find().toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }).catch((error) => {
        console.log(`Exception while reading table Todos due to: ${error}`);
    });

    todoAppDB.collection('Todos').find({_id:new ObjectID('5b553f2dac2e0b7524481dc9')}).toArray().then((docs) => {
        console.log('Filtered Records', JSON.stringify(docs, undefined, 2));
    }).catch(error => {
        console.log(`Exception while reading filtered values from table Todos due to: ${error}`);
    });

    todoAppDB.collection('Todos').find().count()
    .then(count => {
        console.log(`Count is: ${count}`)
    }).catch(err => {
        console.log('unable to gett the count')
    });*/

    todoAppDB.collection('Users')
    .find()
    .count()
    .then(count => {
        console.log(`Users count is: ${count}`)
    })
    .catch(err => {
        console.log('unable to get the count')
    });

    client.close();
});

