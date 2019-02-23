const mongoose = require('mongoose');

// const dbhost = 'mongodb+srv://nosa:nosa%40123@cluster0-av5ku.mongodb.net/test?retryWrites=true';

mongoose.Promise = global.Promise;
mongoose
  .connect(
    process.env.TODOAPP_MONGODB_URI || 'mongodb://localhost:27017/TodoApp',
    {
      useNewUrlParser: true
    }
  )
  .then(() => {
    console.log('connected to mongoDb');
  })
  .catch(e => {
    console.error(e.message);
  });

module.exports = {
  mongoose
};
