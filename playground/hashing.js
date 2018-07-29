const jwt = require('jsonwebtoken');

var data = {
    id: 10,
    password: 'satya@123'
};

// This is the value we store in database. This return the token. We will send this back to user
var token = jwt.sign(data, 'secretsalt');

console.log(token)

var decoded = jwt.verify(token, 'secretsalt');
console.log('decoded:', decoded)

















/*
const {SHA256} = require('crypto-js');

var message = 'I am user number 3'

var hash = SHA256(message).toString();

console.log(`Message: ${message}`)
console.log(`Hash : ${hash}`)


// Actual Data
var data = {
    id: 4
}


// Creating a Hash toekn from the data
var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString()

// Hashing Data obtained from user
var resultHash = SHA256(JSON.stringify(data) + 'somesecret').toString()

if (resultHash === token.hash){
    console.log('data was not changed')
} else {
    console.log('data was changed. Dont trust')
} */