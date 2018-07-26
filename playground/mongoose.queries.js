const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectId} = require('mongodb');


var id = '5b58de0d133f688ffd89ec9e';

if(!ObjectId.isValid('5b58de0d133f688ffd89ec9e111111')){
    return console.log('Id not valid');
}


Todo.find({
    _id: id
})
.then((todos) => {
    console.log('todos find=======', todos);
})
.catch(e => console.log(e))




Todo.findOne({_id: id})
.then((todo) => {
    console.log('todo findOne======', todo);
})
.catch(e => console.log(e))



Todo.findById(id)
.then((todo) => {
    console.log('todos findById=======', todo);
})
.catch(e => console.log(e))



Todo.findById('6b58de0d133f688ffd89ec911111')
.then((todo) => {

    if(!todo){
        return console.log('Id not found')
    }
    console.log('todos findById=======', todos);
})
.catch(e => console.log(e))
