const mongoose = require('mongoose');
const validator = require('validator');
const JWT = require('jsonwebtoken');
const _ = require('lodash');


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


// Override toJSON method of mongoose in order to only display/send id and email.
// This will prevent any passwords or tokens to be send to the requester
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email'])
}

// This is an instance method addition. So we use lower u in user = this
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = JWT.sign({_id: user._id.toHexString(), access}, 'secretsalt').toString();
  
    user.tokens.push({access, token});
  
    return user.save().then(() => {
      return token;
    });
  };

  // This is a model method. So uppercase User = this
  UserSchema.statics.findByToken = function(token){
      // This is upper case U.
      var User = this;
      var decoded;
      try{
        decoded = JWT.verify(token, 'secretsalt');
      } catch(e){
        /*return new Promise((resolve, reject) => {
            reject('Invalid user');
        });*/
        return Promise.reject('User not authorized');
      }
      
      return User.findOne({
          '_id': decoded._id, // Quotes are not needed for '_id' key
          'tokens.token': token, // Quotes are needed for nested keys
          'tokens.access': 'auth' // Quotes are needed for nested keys
      });
  }

var User = mongoose.model('User', UserSchema);

module.exports = {User}