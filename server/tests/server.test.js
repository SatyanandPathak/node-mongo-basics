const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {_id: new ObjectID(),text: 'First test TODO'}, 
  {_id: new ObjectID(), text: 'Second test TODO'}];

const initialTodos = 2;
beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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