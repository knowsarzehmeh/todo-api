const express = require('express');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');
const { authenticate } = require('./middleware/authenticate');

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.post('/todos', authenticate, (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then(
    doc => {
      res.send(doc);
    },
    e => {
      res.status(400).send(e);
    }
  );
});

app.get('/todos', authenticate, async (req, res) => {
  const todos = await Todo.find({ _creator: req.user._id });
  if (!todos) return res.status(404).send('Your todo list is empty');
  res.send({ todos });
});

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ error: 'Not a valid Id' });

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      //  valid id and document found
      res.send({ todo });
    })
    .catch(e => {
      return res.status(400).send();
    });
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send();

  Todo.findOneAndDelete({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      return res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send();

  if (_.isBoolean(body.completed) && body.completed) {
    //  if todo is completed update the time it was completed
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id
    },
    {
      $set: body
    },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(e => {
      res.status(400).send();
    });
});

// POST /users
app.post('/users', (req, res) => {
  const newUser = _.pick(req.body, ['email', 'password']);
  const user = new User(newUser);

  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login
app.post('/users/login', (req, res) => {
  const userObj = _.pick(req.body, ['email', 'password']);
  User.findByCredentials(userObj)
    .then(user => {
      return user.generateAuthToken().then(token => {
        res.header('x-auth', token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send();
    });
});

// deleting the currently logged in users
app.delete('/users/me/token', authenticate, (req, res) => {
  const user = req.user;
  user
    .removeToken(req.token)
    .then(() => {
      res.status(200).send();
    })
    .catch(e => {
      res.status(400).send();
    });
});

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = { app, server };
