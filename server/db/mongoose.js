const mongoose = require('mongoose');

const MONGODB_URI = require('./../config/config');

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
