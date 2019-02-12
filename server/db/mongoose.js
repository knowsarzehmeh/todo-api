const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose
  .connect('mongodb://localhost:27017/TodoApp', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('connected to mongoDb');
  })
  .catch(e => {
    console.error(e.message);
  });

module.exports = {
  mongoose
};
