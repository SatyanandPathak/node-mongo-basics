const mongoose = require('mongoose');
const validator = require('validator');
const JWT = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// Define UserSchema
var UserSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true, 
        trim: true, 
        minlength: 1,
        unique: true,  
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }},
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});



/**
 * Method to override toJSON render method from Mongoose. 
 * This will make sure that we only render few required values to the end client as JSON
 * This will prevent any passwords or tokens to be send to the requester
 */
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'tokens.token'])
}


// 
/**
 * Mongoose instance method.
 * Used to generate a auth token for a particular user instance and save it to mongo DB
 * As this is an instance method, we use lower u in user = this
 */
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';

    // Generate token based on user id, access value and secretsalt/private key
    var token = JWT.sign({_id: user._id.toHexString(), access}, 'secretsalt').toString();
    
    // Add the tokens array value i.e., access and token
    user.tokens.push({access, token});
    
    // Save the user and return the promise containing token
    return user.save().then(() => {
      return token;
    });
  };

  UserSchema.methods.removeToken = function(token){
      var user = this;
      return user.update({
          $pull: {
              tokens: {token}
          }
      });

  }


  /**
   * Mongoose static method. 
   * This can be called on User model in order to verify if a token is valid 
   * As this is a model method, we use uppercase User = this
   */
  UserSchema.statics.findByToken = function(token){
      // This is upper case U.
      var User = this;
      var decoded;
      try{
        // Verify the token and generate the decoded value.
        // Format will be as below: 
        // decoded = {_id: 'id_value', tokens: {[{token: 'token value', access: 'auth'}]}})
        decoded = JWT.verify(token, 'secretsalt');
      } catch(e){
        /*return new Promise((resolve, reject) => {
            reject('Invalid user');
        });*/
        // If verify fails, reject the request
        return Promise.reject('User not authorized');
      }
      
      // Return the user from User model using findOne from the decoded value
      return User.findOne({
          '_id': decoded._id, // Quotes are not needed for '_id' key
          'tokens.token': token, // Quotes are needed for nested keys
          'tokens.access': 'auth' // Quotes are needed for nested keys
      });
  }

  UserSchema.statics.findByCredentials = function(email, password){
    var User = this;
    return User.findOne({email})
    .then(user => {
        if(!user){
            return Promise.reject('Invalid Credentials(user id)')
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user);
                } else {
                    reject('Invalid Credentials(password)');
                }
            })
        });

    });
  }

  /**
   * Pre function middleware which gets called before saving a user. 
   * This is for encrypting and saving the password in mongo DB
   */
  UserSchema.pre('save', function(next) {
    var user = this;

    // Check if the password is modified
    if(user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
  })

var User = mongoose.model('User', UserSchema);

module.exports = {User}
