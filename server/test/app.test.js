const request = require('supertest');

const { server } = require('./../app');
const { Todo } = require('./../models/todo');

const todos = [
  {
    text: 'First test todo'
  },
  {
    text: 'Second test todo'
  }
];

beforeEach(done => {
  //  call the todo to remove all Todos before each test
  Todo.deleteMany({})
    .then(() => {
      return Todo.insertMany(todos);
    })
    .then(() => done());
});

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
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });

  it('should get a sigle todo', () => {});
});
