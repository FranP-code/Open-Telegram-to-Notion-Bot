const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_LINK)
  .catch((err) => console.log(err));

mongoose.connection.once('open', () => {
  console.log('DB connected');
});

mongoose.connection.on('error', (err) => {
  console.log(err);
});
