const {SHA256} = require('crypto-js') // To demonstrate how SAH256 hashing works
const jwt = require('jsonwebtoken'); // To demonstrate how JWT works
const bcrypt = require('bcryptjs'); // To demonstrate how password encryption works



var password = 'satya@123';
// The number passes inside genSalt is to make gen salt slow. It means number of rounds to go for encrypting.
// The more the value the more slow is gen Salt and more secure the passwords are
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
});

var hashedPassword = '$2a$10$9znT.qQAih6WjPZIkh.8ROeWTwoib/VAXkyBP/i/Mj1cciYN7cscS';
bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result)
})











/*

var data = {
    id: 10,
    password: 'satya@123'
};

// This is the value we store in database. This return the token. We will send this back to user
var token = jwt.sign(data, 'secretsalt');

console.log(token)

var decoded = jwt.verify(token, 'secretsalt');
console.log('decoded:', decoded)*/

















/*


var message = 'I am user number 3'

var hash = SHA256(message).toString();

console.log(`Message: ${message}`)
console.log(`Hash : ${hash}`)


// Actual Data
var data = {
    id: 4
}


// Creating a Hash token from the data
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