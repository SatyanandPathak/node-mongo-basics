const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectId} = require('mongodb');


Todo.findOneAndRemove({_id:'id_no'})
Todo.findIdAndRemove('')