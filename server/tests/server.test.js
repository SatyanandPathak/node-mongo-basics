const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


// Expect documentation @: https://jestjs.io/docs/en/expect.html. It is maintained by JEST now

const initialTodos = 2;
beforeEach(populateUsers);
beforeEach(populateTodos);


describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  // Test for empty body
  it('should not create a new todo with empty body', (done) => {
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    .end((err, response) => {
      if(err){
        return done(err);
      }

      Todo.find()
      .then((todos) => {
        expect(todos.length).toBe(initialTodos);
        done();
      })
      .catch(e => done(e));

    });
  });
});

describe('GET /todos', ()=> {
  // it('should get all todos', (done) => {
  //   request(app)
  //   .get('/todos')
  //   .expect(200)
  //   .end((err, res) => {
  //     if(err){
  //       return done(err);
  //     }

  //     Todo.find()
  //     .then(todos => {
  //       expect(todos.length).toBe(initialTodos);
  //       done();
  //     })
  //     .catch(e => done(e));
  //   });

    
  // });

  // Simple way to do it
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect(resp => {
      expect(resp.body.todos.length).toBe(2);
    })
    .end(done);
    
  });

});

describe('GET todos by id', () => {

  it('should return a todo', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id}`)
    .expect(200)
    .expect((response) => {
      expect(response.body.todo.text).toBe(todos[0].text);
    })
    .end(done);

  });

  it('should return 404 if a todo is not found', (done) => {
    var randomId = new ObjectID();
    request(app)
    .get(`/todos/${randomId}`)
    .expect(404)
    .end(done);    
  });

  it('should return 400 when invalid id is passed', (done)=> {
    request(app)
    .get(`/todos/123`)
    .expect(400)
    .end(done);
  })
});


describe('Delete todos', () => {
  it('should remove a todo with valid ID', (done) => {
    var id = todos[0]._id;

    request(app)
    .delete(`/todos/${id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(id.toHexString())
    })
    .end((err, response) => {
      if(err){
        return done(err);
      }
      Todo.findById(id)
      .then((todo) => {
        expect(todo).toBe(null);
        done();
      })
      .catch(err => done(err));

    });

    
  });

  it('should return a 404 when a todo is not found', (done) => {
    var randomId = new ObjectID();
    request(app)
    .delete(`/todos/${randomId}`)
    .expect(404)
    .end(done);

  });

  it('should return 400 if object id is invalid', (done) => {
    request(app)
    .delete(`/todos/2`)
    .expect(400)
    .end(done);
  });

});

describe('Update todos', () => {

  it('should update todo', (done) => {
    var id = todos[0]._id.toHexString();
    text = 'Completed First TODO';


    request(app)
    .patch(`/todos/${id}`)
    .send({completed: true, text: text})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(text);
      expect(res.body.todo.completed).toBe(true);
      expect(typeof res.body.todo.completedAt).toBe('number');
    })
    .end(done);
  });

  it('should clear completedAt when todos is not completed', (done) => {
    var id = todos[1]._id.toHexString();

    request(app)
    .patch(`/todos/${id}`)
    .send({completed: false})
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBe(null);
    })
    .end(done);
  });
  
});

describe('Get /users/me', () => {

  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth-token', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    })
    .end(done);
    
  });

  it('should return a 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect(res => {
      expect(res.body.message).toBe('User not authorized');
    })
    .end(done);

    
  });
  
});

describe('POST, /users', () => {
  it('should create a user', (done) => {
    var email = 'testuser@example.com';
    var password = 'test123';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(201)
    .expect((res) => {
      expect(res.headers['x-auth-token']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
      expect(res.body.email).toBe(email);

    })
    .end((err, resp) => {
      if(err){
        return done(err);
      }

      User.findOne({email})
      .then(user => {
        expect(user).toBeTruthy();
        expect(user.password).not.toEqual(password);
        done();
      })
      .catch(err => done(err));
    });
  });

  it('should return validation errors if request is invalid', (done) => {
    var email = 'test';
    var password = '1';

    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .expect(res => {
      expect(res.body.description).toBeTruthy();
    })
    .end(done);
  });

  it('should not create user if email already in use', (done) => {
    var email = users[0].email;
    var password = 'samplepassword';
    request(app)
    .post('/users')
    .send({email, password})
    .expect(400)
    .expect(res => {
      expect(res.body.description).toBeTruthy();
    })
    .end(done);

  });
  
});

describe('POST /users/login', () => {
  it('should return user when valid credentials', (done) => {
    var email = users[1].email;
    var password = users[1].password;
    request(app)
    .post('/users/login')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.header['x-auth-token']).toBeTruthy();
    })
    .end((err, res) => {
      if (err){
        return done(err);
      }


      User.findById(users[1]._id)
      .then((user) => {
        // Here the user returned from DB will have complete details including the tokens

        expect(user.tokens[0].token).toBe(res.headers['x-auth-token']);
        expect(user.tokens[0].access).toBe('auth');
        
        // expect(user.tokens[0]).toBe({
        //   access: 'auth',
        //   token: res.headers['x-auth-token']
        // })
        expect(user.email).toBe(email);

        done()
      })
      .catch(e => done(e));
    });

  });

  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({email: 'satyanand.pathak', password: '12345'})
    .expect(401)
    .expect(res => {
      expect(res.header['x-auth-token']).toBeUndefined();
      expect(res.body.message).toBe('Invalid Credentials(user id)');
    })
    .end(done());
  });
});