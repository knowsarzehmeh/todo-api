const request = require('supertest');
const mongoose = require('mongoose');
const { server } = require('./../app');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

// afterEach(async done => {
//   await Todo.deleteMany({});
//   await server.close();
//   done();
// });

describe(' POST /todos', () => {
  it('should create a new todo', done => {
    const text = 'Test todo text';

    request(server)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // Check the db to see if data was stored in db
        Todo.find({ text })
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should not create todo with invalid body data', done => {
    text = {};

    request(server)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send(text)
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe(' GET /todos', () => {
  it('should get all todos', done => {
    request(server)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });

  it('should return a todo doc', done => {
    request(server)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return a todo doc created by other user', done => {
    request(server)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 400 if todo id is not valid', done => {
    request(server)
      .get('/todos/lksdlsdssle')
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBeDefined();
      })
      .end(done);
  });

  it('should return 404 if todo is not found', done => {
    const id = mongoose.Types.ObjectId().toHexString();
    request(server)
      .get(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', done => {
    const id = todos[1]._id.toHexString();

    request(server)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(id)
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });

  it('should not remove a todo created by another user', done => {
    const id = todos[0]._id.toHexString();

    request(server)
      .delete(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(id)
          .then(todo => {
            expect(todo).toBeTruthy();
            done();
          })
          .catch(err => {
            done(err);
          });
      });
  });

  it('should return 404 if todo not found', done => {
    const id = mongoose.Types.ObjectId().toHexString();
    request(server)
      .delete(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 400 if object id is invalid', done => {
    request(server)
      .delete('/todos/lksdkl')
      .set('x-auth', users[0].tokens[0].token)
      .expect(400)
      .end(done);
  });
});

describe('PATCH /todos/id', () => {
  it('should update the todo', done => {
    const id = todos[0]._id.toHexString();
    const text = 'this should be the new text';

    request(server)
      .patch(`/todos/${id}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });
  it('should not update the todo created by other user', done => {
    const id = todos[0]._id.toHexString();
    const text = 'this should be the new text';

    request(server)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: true,
        text
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', done => {
    const id = todos[1]._id.toHexString();
    const text = 'this should be the new text with new value';

    request(server)
      .patch(`/todos/${id}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(server)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', done => {
    request(server)
      .get('/users/me')
      .expect(401)
      .expect(res => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', done => {
    const email = 'example@example.com';
    const password = '123mnb!';

    request(server)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.header['x-auth']).toBeDefined();
        expect(res.body._id).toBeDefined();
        expect(res.body.email).toBe(email);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findOne({ email }).then(user => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        });
      });
  });

  it('should return validation errors if request invalid', done => {
    request(server)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done);
  });

  it('should not create use if email is in use', done => {
    request(server)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'Password123!'
      })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    request(server)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.header['x-auth']).toBeDefined();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // if no errors, find the user that registered in the db
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1]).toMatchObject({
              access: 'auth',
              token: res.header['x-auth']
            });
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });

  it('should reject if invalid token', done => {
    request(server)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '1'
      })
      .expect(400)
      .expect(res => {
        expect(res.header['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) return done(err);

        // find the user
        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', done => {
    request(server)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
