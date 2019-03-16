const {
  TODOAPP_MONGODB_URI,
  REPLICA_SET,
  AUTH_SOURCE,
  RETRY_WRITES
} = process.env;

let MONGODB_URI = `${TODOAPP_MONGODB_URI}&replicaSet=${REPLICA_SET}&authSource=${AUTH_SOURCE}&retryWrites=${RETRY_WRITES}`;

if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (process.env.NODE_ENV === 'test') {
  MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

module.exports = MONGODB_URI;
