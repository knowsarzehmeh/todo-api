const express = require('express');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');

const app = express();
app.use(express.json());

app.post('/todos', (req, res) => {
  const todo = new Todo({
    text: req.body.text
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

const server = app.listen(3000, () => {
  console.log('Started on port 3000');
});

module.exports = { app, server };
