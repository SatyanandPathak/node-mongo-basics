const {ObjectID} = require('mongodb');
const JWT = require('jsonwebtoken');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


const userOneId = new ObjectID();
const userTwoId = new ObjectID();

var getToken = userId => JWT.sign({_id:userId, access: 'auth'}, 'secretsalt').toString();

const users = [
    {_id: userOneId, email: 'satyanand@gmail.com', password: 'userone123', tokens: [{access: 'auth', token: getToken(userOneId)}]},
    {_id: userTwoId, email: 'sunita@gmail.com', password: 'usertwo123', tokens: [{access: 'auth', token: getToken(userTwoId)}]}
]

const todos = [
    {_id: new ObjectID(),text: 'First test TODO', _creator: userOneId}, 
    {_id: new ObjectID(), text: 'Second test TODO', completed:true, completedAt:333, _creator: userTwoId}
];

const populateTodos = (done) => {
        Todo.remove({}).then(() => {
            return Todo.insertMany(todos);
          }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        // First save the users. 
        // This will make sure that pre save method is run inorder to encrypt the password
        var userOne = new User(users[0]).save(); // Return a promise
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};




module.exports = {todos, populateTodos, users, populateUsers};
