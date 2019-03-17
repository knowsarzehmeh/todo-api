// server env
const {
  TODOAPP_MONGODB_URI,
  REPLICA_SET,
  AUTH_SOURCE,
  RETRY_WRITES
} = process.env;

let MONGODB_URI = `${TODOAPP_MONGODB_URI}&replicaSet=${REPLICA_SET}&authSource=${AUTH_SOURCE}&retryWrites=${RETRY_WRITES}`;

// if we are in development or test use this config
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  const config = require('./config.json');
  const envConfig = config[process.env.NODE_ENV];
  //
  Object.keys(envConfig).forEach(key => {
    // set the environment variable
    process.env[key] = envConfig[key];
    // if the  object key is MONGODB_URI set the value of the key to the MONGODB_URI variable
    if (key === 'MONGODB_URI') {
      MONGODB_URI = envConfig[key];
    }
  });
}

module.exports = MONGODB_URI;
