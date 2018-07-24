const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', (error, client) => {
    if(error){
        return console.log('Could not connect to Mongo DB');
    }

    console.log('Connected to Mongo DB at 27017');

    const todoAppDB = client.db('TodoApp');

    // todoAppDB.collection('Users')
    // .find()
    // .count()
    // .then(count => {
    //     console.log(`Count is: ${count}`);
    // })
    // .catch(err => {
    //     console.log(err);
    // })

    // todoAppDB.collection('Todos').deleteMany({text:'Something to do'})
    // .then((result) => {
    //     console.log(result);
    // }).catch(err => {
    //     console.log(err);
    // });

    // todoAppDB.collection('Todos').deleteOne({text: 'Something to do'})
    // .then(result => {
    //     console.log(result);
    // })
    // .catch(err => {
    //     console.log(err);
    // });
    todoAppDB.collection('Todos')
    .findOneAndDelete({text: 'Something to do'})
    .then(result => {
        console.log(result);
    })
    .catch(err => {
        console.log(err);
    });

});