const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [
  {text: 'First test TODO'}, 
  {text: 'Second test TODO'}];

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

  // Simp[le way to do it
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

