const mongoose = require('mongoose');
const userName = 'nosa';
const password = encodeURIComponent('nosa@123');
console.log(password);
const dbhost = `mongodb://nosa:nosa%40123@cluster0-shard-00-00-av5ku.mongodb.net:27017,cluster0-shard-00-01-av5ku.mongodb.net:27017,cluster0-shard-00-02-av5ku.mongodb.net:27017/TodoApp?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`;
// 'mongodb+srv://nosa:nosa%40123@cluster0-av5ku.mongodb.net/test?retryWrites=true';
// process.env.TODOAPP_MONGODB_URI
const {
  TODOAPP_MONGODB_URI,
  REPLICA_SET,
  AUTH_SOURCE,
  RETRY_WRITES
} = process.env;
const MONGODB_URI = `${TODOAPP_MONGODB_URI}&replicaSet=${REPLICA_SET}&authSource=${AUTH_SOURCE}&retryWrites=${RETRY_WRITES}`;
mongoose.Promise = global.Promise;
mongoose
  .connect(MONGODB_URI || 'mongodb://localhost:27017/TodoApp', {
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
