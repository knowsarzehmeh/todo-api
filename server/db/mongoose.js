const mongoose = require('mongoose');

const {
  TODOAPP_MONGODB_URI,
  REPLICA_SET,
  AUTH_SOURCE,
  RETRY_WRITES
} = process.env;

let MONGODB_URI = `${TODOAPP_MONGODB_URI}&replicaSet=${REPLICA_SET}&authSource=${AUTH_SOURCE}&retryWrites=${RETRY_WRITES}`;

process.env.NODE_ENV = 'development';
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test')
  MONGODB_URI = 'mongodb://localhost:27017/TodoApp';

mongoose.Promise = global.Promise;
mongoose
  .connect(MONGODB_URI, {
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
