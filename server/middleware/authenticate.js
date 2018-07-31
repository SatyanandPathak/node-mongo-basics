var {User} = require('./../models/user');


// Authenticate Middleware. Called by all the private routes for which authentication is required
var authenticate = (request, response, next) => {
    var token = request.header('x-auth-token');
    User.findByToken(token)
    .then(user => {
        if(!user){
            return Promise.reject({message: 'Cannot find a valid user'});
        }
        // Add the details into request and propogate it to next 
        request.user = user;
        request.token = token;
        // Propogate to the actual Route handler only if success.
        next();

    })
    .catch(e => {
        // No need to call next() to propogate as auth failed
        response.status(401).send(e);
    });
}

module.exports = {authenticate};