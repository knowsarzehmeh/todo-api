const express = require('express');

const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user');
const { Todo } = require('./models/todo');

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

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

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  if (!todos) return res.status(404).send('Your todo list is empty');
  res.send({ todos });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(400).send({ error: 'Not a valid Id' });

  Todo.findById(id)
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

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send();

  Todo.findByIdAndRemove(id)
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

const server = app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = { app, server };
